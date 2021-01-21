const clonedeep = require('lodash.clonedeep')

const deepstack = require('./deepstack-integration');
const im = require('./image-manipulation');

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
    function FaceRecognition(config) {
        RED.nodes.createNode(this, config);
        let node = this;
        node.server = RED.nodes.getNode(config.server);

        node.status({fill:"grey",shape:"dot",text:"idling"});
        node.on('input', function(msg, send, done) {
            node.status({fill:"yellow",shape:"ring",text:"Processing..."});

            faceRecognition(msg, config, node.server).then(outputs =>{
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
    RED.nodes.registerType("deepstack-face-recognition", FaceRecognition, {});
};

/**
 * Construct the object detection outputs.
 *
 * @param msg the incomming msg object.
 * @param config the node configuration.
 * @param server the server configuration node.
 * @returns {Promise<unknown>}
 */
function faceRecognition(msg, config, server) {

    let original = msg.payload;

    if (original.type === 'Buffer') {
        original = Buffer.from(original.data)
    }

    return new Promise((resolve, reject) => {
        
        deepstack.faceRecognition(
            original,
            server,
            config.confidence/100
        ).then(async result => {
            msg.payload = result.predictions;
            msg.success = result.success;
            msg.originalImage = original;
            if (config.drawPredictions) {
                msg.outlinedImage = await im.outlineImage(
                    original,
                    deepstack.getOutlines(result.predictions),
                    config.outlineColor);
            }

            let outputs = [msg];

            for (let i = 0; i < config.filters.length; i++){
                let filterResult = result.predictions.filter(function (p) {
                    return p.userid == config.filters[i];
                });

                let filterOutput = undefined;
                if (filterResult.length > 0) {
                    filterOutput = clonedeep(msg);
                    filterOutput.payload = filterResult;
                    if (config.drawPredictions) {
                        filterOutput.outlinedImage = await im.outlineImage(
                            original,
                            deepstack.getOutlines(filterResult),
                            config.outlineColor);
                    }
                }
                outputs.push(filterOutput);
            }

            resolve(outputs);
        }).catch(reject);
    });
}