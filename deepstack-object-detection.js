const got = require('got');
const FormData = require('form-data');
const sharp = require('sharp');

/*
 * Object Detection node
 *
 * Status:
 *   - grey   dot  "Idling, waiting for images to process"
 *   - green  dot  "Successfully processed an image and result delivered"
 *   - yellow ring "Processing image"
 *   - red    ring "Error processing image"
 */

module.exports = function(RED) {
    function ObjectDetection(config) {
        RED.nodes.createNode(this, config);
        let node = this;

        node.status({fill:"grey",shape:"dot",text:"idling"});
        node.on('input', function(msg, send, done) {
            node.status({fill:"yellow",shape:"ring",text:"Processing..."});

            objectDetection(msg, config).then(outputs =>{
                node.status({fill: "green", shape: "dot", text: "success"});
                setTimeout(function () {
                    node.status({fill: "grey", shape: "dot", text: "idling"});
                }, 2000);

                node.send(outputs);
            }).catch(reason => {
                node.status({fill:"red",shape:"ring",text:"error detecting objects"});
                node.error(reason);
                console.log(reason);
            });
        });
    }
    RED.nodes.registerType("deepstack-object-detection", ObjectDetection, {});
};

/**
 * Construct the object detection outputs.
 *
 * @param msg the incomming msg object.
 * @param config the node configuration.
 * @returns {Promise<unknown>}
 */
function objectDetection(msg, config) {

    let original = msg.payload;

    return new Promise((resolve, reject) => {

        deepstackDetection(
            original,
            config.url,
            config.rejectUnauthorized
        ).then(async result => {
            msg.payload = result.predictions;
            msg.success = result.success;
            msg.originalImage = original;
            if (config.drawPredictions) {
                msg.outlinedImage = await outlineImage(
                    original,
                    getOutlines(result.predictions),
                    config.outlineColor);
            }

            let outputs = [msg];

            for (let i = 0; i < config.filters.length; i++){
                let filterResult = result.predictions.filter(function (p) {
                    return p.label == config.filters[i];
                });

                let filterOutput = undefined;
                if (filterResult.length > 0) {
                    filterOutput = JSON.parse(JSON.stringify(msg));
                    filterOutput.payload = filterResult;
                    if (config.drawPredictions) {
                        filterOutput.outlinedImage = await outlineImage(
                            original,
                            getOutlines(filterResult),
                            config.outlineColor);
                    }
                }
                outputs.push(filterOutput);
            }

            resolve(outputs);
        }).catch(reject);
    });
}

/**
 * Call the Deepstack API and return Promise with response body as JSON.
 *
 * @param image the image buffer to send to the Deepstack API.
 * @param url the base URL of the Deepstack service.
 * @param rejectUnauthorized if not false, the server certificate is verified against the list of supplied CAs
 * @returns {Promise<unknown>}
 */
function deepstackDetection(image, url, rejectUnauthorized) {
    const form = new FormData();
    form.append('image', image,{ filename: 'image.jpg' });

    return new Promise((resolve, reject) => {
        got(url + '/vision/detection', {
            method: 'POST',
            headers: form.getHeaders(),
            https: {
                rejectUnauthorized: rejectUnauthorized
            },
            body: form
        }).then( function (response) {
            resolve(JSON.parse(response.body));
        }).catch(reject);
    });
}

/**
 * Paint outlines on the supplied picture.
 *
 * @param buffer image buffer to painnt outlines on.
 * @param outlines the outlines to paint. {x: *, width: number, y: *, height: number}
 * @param outlineColor color to use for the outline.
 * @returns {PromiseLike<T>}
 */
function outlineImage(buffer, outlines, outlineColor) {
    return sharp(buffer).metadata().then(meta => {
        let svgOverlay = '';

        outlines.forEach(o => {
            svgOverlay += '<rect x="' + o.x + '" y="' + o.y + '" width="' + o.width + '" height="' + o.height + '" ' +
                'style="fill:none;stroke:' + outlineColor + ';stroke-width:3;" />';
        });
        return '<svg width="' + meta.width + '" height="' + meta.height + '">' + svgOverlay + '</svg>';
    }).then(overlay => {
        return sharp(buffer).composite([{
            input: Buffer.from(overlay),
            blend: 'over'
        }]).toBuffer();
    });
}

/**
 * Calculate where to place the outlines.
 *
 * @param prediction the prediction/predictions to calculate for.
 * @returns {{x: *, width: number, y: *, height: number}[]|{x: *, width: number, y: *, height: number}}
 */
function getOutlines(prediction) {
    if (prediction instanceof Array) {
        return prediction.map(p => getOutlines(p));
    } else {
        return {
            x: prediction.x_min,
            y: prediction.y_min,
            width: prediction.x_max - prediction.x_min,
            height: prediction.y_max - prediction.y_min
        }
    }
}