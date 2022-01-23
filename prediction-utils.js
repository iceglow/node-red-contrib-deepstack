const deepstack = require('./deepstack-integration');
const im = require('./image-manipulation');

async function drawPredictions(image, predictions, color, printLabel = false) {
    let tempImage = image;
    
    for await(const prediction of predictions) {
        const outlines = deepstack.getOutlines(prediction);
        tempImage = await im.outlineImage(tempImage, outlines, color);

        if (printLabel) {
            tempImage = await im.addLabel(tempImage, prediction.label, outlines.x, outlines.y, color);
        }
    };

    return tempImage;
}

module.exports = {
    drawPredictions
};
