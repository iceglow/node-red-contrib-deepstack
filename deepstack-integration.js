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
function objectDetection(image, server, confidence) {
    const form = new FormData();
    form.append('image', image, {filename: 'image.jpg'});
    form.append('min_confidence', confidence);
    if (server.credentials.apiKey) {
        form.append('api_key', server.credentials.apiKey);
    }
    if (server.credentials.adminKey) {
        form.append('admin_key', server.credentials.adminKey);
    }

    return got(constructURL(server, '/vision/detection'), {
            method: 'POST',
            headers: form.getHeaders(),
            https: {
                rejectUnauthorized: server.rejectUnauthorized
            },
            body: form
        })
        .then((response) => JSON.parse(response.body));
};

/**
 * Call the Deepstack API and return Promise with response body as JSON.
 *
 * @param image the image buffer to send to the Deepstack API.
 * @param url the base URL of the Deepstack service.
 * @param rejectUnauthorized if not false, the server certificate is verified against the list of supplied CAs
 * @returns {Promise<unknown>}
 */
function faceRecognition(image, server, confidence) {
    const form = new FormData();
    form.append('image', image, {filename: 'image.jpg'});
    form.append('min_confidence', confidence);
    if (server.credentials.apiKey) {
        form.append('api_key', server.credentials.apiKey);
    }
    if (server.credentials.adminKey) {
        form.append('admin_key', server.credentials.adminKey);
    }

    return got(constructURL(server, '/vision/face/recognize'), {
            method: 'POST',
            headers: form.getHeaders(),
            https: {
                rejectUnauthorized: server.rejectUnauthorized
            },
            body: form
        })
        .then((response) => JSON.parse(response.body));
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

function constructURL(server, endpoint) {
    return server.proto + '://' + server.host + ':' + server.port + '/' + server.version + endpoint;
}

module.exports = {
    objectDetection,
    faceRecognition,
    getOutlines
};
