const got = require('got');
const FormData = require('form-data');

/**
 * Call the Deepstack API and return Promise with response body as JSON.
 *
 * @param image the image buffer to send to the Deepstack API.
 * @param url the base URL of the Deepstack service.
 * @param rejectUnauthorized if not false, the server certificate is verified against the list of supplied CAs
 * @returns {Promise<unknown>}
 */
function objectDetection(image, url, rejectUnauthorized, confidence) {
    const form = new FormData();
    form.append('image', image, {filename: 'image.jpg'});
    form.append('min_confidence', confidence);

    return new Promise((resolve, reject) => {
        got(url + '/vision/detection', {
            method: 'POST',
            headers: form.getHeaders(),
            https: {
                rejectUnauthorized: rejectUnauthorized
            },
            body: form
        }).then(function (response) {
            resolve(JSON.parse(response.body));
        }).catch(reject);
    });
};

/**
 * Call the Deepstack API and return Promise with response body as JSON.
 *
 * @param image the image buffer to send to the Deepstack API.
 * @param url the base URL of the Deepstack service.
 * @param rejectUnauthorized if not false, the server certificate is verified against the list of supplied CAs
 * @returns {Promise<unknown>}
 */
function faceRecognition(image, url, rejectUnauthorized, confidence) {
    const form = new FormData();
    form.append('image', image, {filename: 'image.jpg'});
    form.append('min_confidence', confidence);

    return new Promise((resolve, reject) => {
        got(url + '/vision/face/recognize', {
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
};

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
};

module.exports = {
    objectDetection,
    faceRecognition,
    getOutlines
};