const deepstack = require('./deepstack-integration');

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
    function FaceRegistration(config) {
        RED.nodes.createNode(this, config);
        let node = this;
        node.server = RED.nodes.getNode(config.server);

        node.status({fill:"grey",shape:"dot",text:"idling"});
        node.on('input', function(msg, send, done) {
            node.status({fill:"yellow",shape:"ring",text:"Processing..."});

            faceRegistration(msg, config, node.server).then(outputs =>{
                node.status({fill: "green", shape: "dot", text: "success"});
                setTimeout(function () {
                    node.status({fill: "grey", shape: "dot", text: "idling"});
                }, 2000);

                node.send(outputs);
            }).catch(reason => {
                node.status({fill:"red",shape:"ring",text:"error registering objects"});
                node.error(reason);
                console.log(reason);
            });
        });
    }
    RED.nodes.registerType("deepstack-face-registration", FaceRegistration, {});
};

/**
 * Construct the object detection outputs.
 *
 * @param msg the incomming msg object.
 * @param config the node configuration.
 * @param server the server configuration node.
 * @returns {Promise<unknown>}
 */
function faceRegistration(msg, config, server) {

    let images = msg.payload;

    if (images.type === 'Buffer') {
        images = Buffer.from(images.data);
    } else if(images.type === 'Array') {
        let arr = [];
        for (let i = 0; i < images.length; i++) {
            if (images[i].type === 'Buffer') {
                arr.push(Buffer.from(images[i].data));
            }
        }
        images = arr;
    }
    
    if (images.type !== 'Array') {
        images = [images];
    }

    return new Promise((resolve, reject) => {
        
        deepstack.faceRegistration(
            images,
            server,
            config.userid
        ).then(async result => {
            msg.payload = result.message || result.error;
            msg.success = result.success;

            resolve(msg);
        }).catch(reject);
    });
}