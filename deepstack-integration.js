const got = require('got');
const FormData = require('form-data');

/**
 * Call the Deepstack API and return Promise with response body as JSON.
 *
 * @param image the image buffer to send to the Deepstack API.
 * @param server Deepstack server configuration.
 * @param confidence the minimum confidence in decimal form, 0-1. Ex: 0.8
 * @returns {Promise<unknown>}
 */
function imageALPR(image, server, confidence) {
    const form = new FormData();
    form.append('image', image, {filename: 'image.jpg'});
    form.append('min_confidence', confidence);
    if (server.credentials.apiKey) {
        form.append('api_key', server.credentials.apiKey);
    }
    if (server.credentials.adminKey) {
        form.append('admin_key', server.credentials.adminKey);
    }
    return got(constructURL(server, '/image/alpr'), {
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
 * @param server Deepstack server configuration.
 * @param confidence the minimum confidence in decimal form, 0-1. Ex: 0.8
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
 * @param server Deepstack server configuration.
 * @param confidence the minimum confidence in decimal form, 0-1. Ex: 0.8
 * @returns {Promise<unknown>}
 */
function customModel(image, server, confidence, customModel) {
    const form = new FormData();
    form.append('image', image, {filename: 'image.jpg'});
    form.append('min_confidence', confidence);
    if (server.credentials.apiKey) {
        form.append('api_key', server.credentials.apiKey);
    }
    if (server.credentials.adminKey) {
        form.append('admin_key', server.credentials.adminKey);
    }
    return got(constructURL(server, '/vision/custom/' + customModel), {
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
 * @param server Deepstack server configuration.
 * @param confidence the minimum confidence in decimal form, 0-1. Ex: 0.8
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
 * Call the Deepstack API and return Promise with response body as JSON.
 *
 * @param images array of image buffers to send to the Deepstack API.
 * @param server Deepstack server configuration.
 * @param userid user id to registrate faces for.
 * @returns {Promise<unknown>}
 */
function faceRegistration(images, server, userid) {
    const form = new FormData();
    for (let i = 0; i < images.length; i++) {
        form.append(`image${i}`, images[i], {filename: `image${i}.jpg`});
    }
    form.append('userid', userid);
    if (server.credentials.apiKey) {
        form.append('api_key', server.credentials.apiKey);
    }
    if (server.credentials.adminKey) {
        form.append('admin_key', server.credentials.adminKey);
    }

    return got(constructURL(server, '/vision/face/register'), {
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
    imageALPR,
    objectDetection,
    customModel,
    faceRecognition,
    faceRegistration,
    getOutlines
};
