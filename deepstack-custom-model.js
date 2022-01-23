const clonedeep = require('lodash.clonedeep')

const deepstack = require('./deepstack-integration');
const pu = require('./prediction-utils');

/*
 * Custom Model node
 *
 * Status:
 *   - grey   dot  "Idling, waiting for images to process"
 *   - green  dot  "Successfully processed an image and result delivered"
 *   - yellow ring "Processing image"
 *   - red    ring "Error processing image"
 */

module.exports = function(RED) {
    function CustomModel(config) {
        RED.nodes.createNode(this, config);
        let node = this;
        node.server = RED.nodes.getNode(config.server);

        node.status({fill:"grey",shape:"dot",text:"idling"});
        node.on('input', function(msg, send, done) {
            node.status({fill:"yellow",shape:"ring",text:"Processing..."});

            customModel(msg, config, node.server).then(output =>{
                node.status({fill: "green", shape: "dot", text: "success"});
                setTimeout(function () {
                    node.status({fill: "grey", shape: "dot", text: "idling"});
                }, 2000);

                node.send(output);
            }).catch(reason => {
                node.status({fill:"red",shape:"ring",text:"error detecting objects"});
                node.error(reason);
                console.log(reason);
            });
        });
    }
    RED.nodes.registerType("deepstack-custom-model", CustomModel, {});
};

/**
 * Construct the object detection outputs.
 *
 * @param msg the incomming msg object.
 * @param config the node configuration.
 * @param server the server configuration node.
 * @returns {Promise<unknown>}
 */
function customModel(msg, config, server) {

    return new Promise((resolve, reject) => {

        let original = msg.payload;

        if (!original) {
            reject("No image provided. Please set msg.payload.")
        }
    
        if (original.type === 'Buffer') {
            original = Buffer.from(original.data)
        }

        deepstack.customModel(
            original,
            server,
            config.confidence/100,
            config.customModel,
        ).then(async result => {
            msg.payload = result.predictions;
            msg.success = result.success;
            msg.duration = result.duration || 0;
            msg.originalImage = original;
            if (config.drawPredictions) {
                msg.outlinedImage = await pu.drawPredictions(original, result.predictions, config.outlineColor, config.printLabel);
            }

            resolve(msg);
        }).catch(reject);
    });
}