const got = require('got');
const FormData = require('form-data');

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

        node.status({fill:"grey",shape:"dot",text:"idel"});
        node.on('input', function(msg, send, done) {
            node.status({fill:"yellow",shape:"ring",text:"Processing..."});
            detect(function (result) {
                msg.payload = result;

                node.status({fill:"green",shape:"dot",text:"success"});
                setTimeout(function() {
                    node.status({fill:"grey",shape:"dot",text:"idel"});
                }, 2000);
                node.send(msg);
            },
                msg, {url: config.url, rejectUnauthorized: config.rejectUnauthorized}, node)
        });
    }
    RED.nodes.registerType("deepstack-object-detection", ObjectDetection, {});
};

function detect(cb, msg, options, node) {

    const image = msg.payload;

    const form = new FormData();
    form.append('image', image,{ filename: 'image.jpg' });

    got(options.url + '/vision/detection', {
        method: 'POST',
        headers: form.getHeaders(),
        body: form
    }).then( function (response) {
        const result = {
            deepstackResponse: JSON.parse(response.body),
            originalImage: image
        }

        cb(result);
    }).catch( function (err) {
        node.status({fill:"red",shape:"ring",text:"error detecting objects"});
        setTimeout(function() {
            node.status({fill:"grey",shape:"dot",text:"idel"});
        }, 2000);
        node.error(err);
        console.log(err)
    });
}