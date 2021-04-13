const chai = require('chai');
const expect = chai.expect;
const nock = require('nock');

describe('Deepstack integration', function() {
    describe('#objectDetection()', function() {
        var deepstack;
        var image;
        var server;

        beforeEach(function(){
            deepstack = require('../deepstack-integration');
            image = '-';
            server = {
                proto: "http",
                host: "deepstack.example.com",
                port: 80,
                version: "v1",
                rejectUnauthorized: true,
                credentials: {
                    apiKey: "apiKey",
                    adminKey: "adminKey"
                }
            }
        });
        
        it('should POST to /vision/detection', async function() {
            const scope = nock('http://deepstack.example.com:80')
                .post('/v1/vision/detection', function(body) {return true})
                .reply(200, {test:"test"});
            
            var res = await deepstack.objectDetection(image, server, 0.8);
            expect(scope.isDone()).to.be.true;
            expect(res.test).to.equal('test');
        });
        
        it('should use protocol from server', async function() {
            server.proto = 'https';
            const scope = nock('https://deepstack.example.com:80')
                .post('/v1/vision/detection', function(body) {return true})
                .reply(200, {test:"test"});
            
            await deepstack.objectDetection(image, server, 0.8);
            expect(scope.isDone()).to.be.true;
        });
        
        it('should use host from server', async function() {
            server.host = 'deepstack2.example.com';
            const scope = nock('http://deepstack2.example.com:80')
                .post('/v1/vision/detection', function(body) {return true})
                .reply(200, {test:"test"});
            
            await deepstack.objectDetection(image, server, 0.8);
            expect(scope.isDone()).to.be.true;
        });
        
        it('should use port from server', async function() {
            server.port = 81;
            const scope = nock('http://deepstack.example.com:81')
                .post('/v1/vision/detection', function(body) {return true})
                .reply(200, {test:"test"});
            
            await deepstack.objectDetection(image, server, 0.8);
            expect(scope.isDone()).to.be.true;
        });
        
        it('should use version from server', async function() {
            server.version = 'v2';
            const scope = nock('http://deepstack.example.com:80')
                .post('/v2/vision/detection', function(body) {return true})
                .reply(200, {test:"test"});
            
            await deepstack.objectDetection(image, server, 0.8);
            expect(scope.isDone()).to.be.true;
        });
        
        it('should use version from server', async function() {
            server.version = 'v2';
            const scope = nock('http://deepstack.example.com:80')
                .post('/v2/vision/detection', function(body) {return true})
                .reply(200, {test:"test"});
            
            await deepstack.objectDetection(image, server, 0.8);
            expect(scope.isDone()).to.be.true;
        });
        
        it('should set image as image.jpg in the form data', async function() {
            const scope = nock('http://deepstack.example.com:80')
                .post('/v1/vision/detection', function(body) {
                    return body.includes('Content-Disposition: form-data; name="image"; filename="image.jpg"\r\nContent-Type: image/jpeg')
                })
                .reply(200, {test:"test"});
            
            await deepstack.objectDetection(image, server, 0.8);
            expect(scope.isDone()).to.be.true;
        });
        
        it('should set min_confidence as confidence', async function() {
            const scope = nock('http://deepstack.example.com:80')
                .post('/v1/vision/detection', function(body) {
                    return body.includes('Content-Disposition: form-data; name="min_confidence"\r\n\r\n0.8')
                })
                .reply(200, {test:"test"});
            
            await deepstack.objectDetection(image, server, 0.8);
            expect(scope.isDone()).to.be.true;
        });
        
        it('should set api_key if present', async function() {
            const scope = nock('http://deepstack.example.com:80')
                .post('/v1/vision/detection', function(body) {
                    return body.includes('Content-Disposition: form-data; name=\"api_key\"\r\n\r\napiKey')
                })
                .reply(200, {test:"test"});
            
            await deepstack.objectDetection(image, server, 0.8);
            expect(scope.isDone()).to.be.true;
        });
        
        it('should not set api_key if not present', async function() {
            server.credentials.apiKey=null
            const scope = nock('http://deepstack.example.com:80')
                .post('/v1/vision/detection', function(body) {
                    return !body.includes('Content-Disposition: form-data; name=\"api_key\"\r\n\r\napiKey')
                })
                .reply(200, {test:"test"});
            
            await deepstack.objectDetection(image, server, 0.8);
            expect(scope.isDone()).to.be.true;
        });
        
        it('should set admin_key if present', async function() {
            const scope = nock('http://deepstack.example.com:80')
                .post('/v1/vision/detection', function(body) {
                    return body.includes('Content-Disposition: form-data; name=\"admin_key\"\r\n\r\nadminKey')
                })
                .reply(200, {test:"test"});
            
            await deepstack.objectDetection(image, server, 0.8);
            expect(scope.isDone()).to.be.true;
        });
        
        it('should not set admin_key if not present', async function() {
            server.credentials.adminKey=null
            const scope = nock('http://deepstack.example.com:80')
                .post('/v1/vision/detection', function(body) {
                    return !body.includes('Content-Disposition: form-data; name=\"admin_key\"\r\n\r\nadminKey')
                })
                .reply(200, {test:"test"});
            
            await deepstack.objectDetection(image, server, 0.8);
            expect(scope.isDone()).to.be.true;
        });
    });

    describe('#faceRecognition()', function() {
        var deepstack;
        var image;
        var server;

        beforeEach(function(){
            deepstack = require('../deepstack-integration');
            image = '-';
            server = {
                proto: "http",
                host: "deepstack.example.com",
                port: 80,
                version: "v1",
                rejectUnauthorized: true,
                credentials: {
                    apiKey: "apiKey",
                    adminKey: "adminKey"
                }
            }
        });
        
        it('should POST to /vision/face/recognize', async function() {
            const scope = nock('http://deepstack.example.com:80')
                .post('/v1/vision/face/recognize', function(body) {return true})
                .reply(200, {test:"test"});
            
            var res = await deepstack.faceRecognition(image, server, 0.8);
            expect(scope.isDone()).to.be.true;
            expect(res.test).to.equal('test');
        });
        
        it('should use protocol from server', async function() {
            server.proto = 'https';
            const scope = nock('https://deepstack.example.com:80')
                .post('/v1/vision/face/recognize', function(body) {return true})
                .reply(200, {test:"test"});
            
            await deepstack.faceRecognition(image, server, 0.8);
            expect(scope.isDone()).to.be.true;
        });
        
        it('should use host from server', async function() {
            server.host = 'deepstack2.example.com';
            const scope = nock('http://deepstack2.example.com:80')
                .post('/v1/vision/face/recognize', function(body) {return true})
                .reply(200, {test:"test"});
            
            await deepstack.faceRecognition(image, server, 0.8);
            expect(scope.isDone()).to.be.true;
        });
        
        it('should use port from server', async function() {
            server.port = 81;
            const scope = nock('http://deepstack.example.com:81')
                .post('/v1/vision/face/recognize', function(body) {return true})
                .reply(200, {test:"test"});
            
            await deepstack.faceRecognition(image, server, 0.8);
            expect(scope.isDone()).to.be.true;
        });
        
        it('should use version from server', async function() {
            server.version = 'v2';
            const scope = nock('http://deepstack.example.com:80')
                .post('/v2/vision/face/recognize', function(body) {return true})
                .reply(200, {test:"test"});
            
            await deepstack.faceRecognition(image, server, 0.8);
            expect(scope.isDone()).to.be.true;
        });
        
        it('should use version from server', async function() {
            server.version = 'v2';
            const scope = nock('http://deepstack.example.com:80')
                .post('/v2/vision/face/recognize', function(body) {return true})
                .reply(200, {test:"test"});
            
            await deepstack.faceRecognition(image, server, 0.8);
            expect(scope.isDone()).to.be.true;
        });
        
        it('should set image as image.jpg in the form data', async function() {
            const scope = nock('http://deepstack.example.com:80')
                .post('/v1/vision/face/recognize', function(body) {
                    return body.includes('Content-Disposition: form-data; name="image"; filename="image.jpg"\r\nContent-Type: image/jpeg')
                })
                .reply(200, {test:"test"});
            
            await deepstack.faceRecognition(image, server, 0.8);
            expect(scope.isDone()).to.be.true;
        });
        
        it('should set min_confidence as confidence', async function() {
            const scope = nock('http://deepstack.example.com:80')
                .post('/v1/vision/face/recognize', function(body) {
                    return body.includes('Content-Disposition: form-data; name="min_confidence"\r\n\r\n0.8')
                })
                .reply(200, {test:"test"});
            
            await deepstack.faceRecognition(image, server, 0.8);
            expect(scope.isDone()).to.be.true;
        });
        
        it('should set api_key if present', async function() {
            const scope = nock('http://deepstack.example.com:80')
                .post('/v1/vision/face/recognize', function(body) {
                    return body.includes('Content-Disposition: form-data; name=\"api_key\"\r\n\r\napiKey')
                })
                .reply(200, {test:"test"});
            
            await deepstack.faceRecognition(image, server, 0.8);
            expect(scope.isDone()).to.be.true;
        });
        
        it('should not set api_key if not present', async function() {
            server.credentials.apiKey=null
            const scope = nock('http://deepstack.example.com:80')
                .post('/v1/vision/face/recognize', function(body) {
                    return !body.includes('Content-Disposition: form-data; name=\"api_key\"\r\n\r\napiKey')
                })
                .reply(200, {test:"test"});
            
            await deepstack.faceRecognition(image, server, 0.8);
            expect(scope.isDone()).to.be.true;
        });
        
        it('should set admin_key if present', async function() {
            const scope = nock('http://deepstack.example.com:80')
                .post('/v1/vision/face/recognize', function(body) {
                    return body.includes('Content-Disposition: form-data; name=\"admin_key\"\r\n\r\nadminKey')
                })
                .reply(200, {test:"test"});
            
            await deepstack.faceRecognition(image, server, 0.8);
            expect(scope.isDone()).to.be.true;
        });
        
        it('should not set admin_key if not present', async function() {
            server.credentials.adminKey=null
            const scope = nock('http://deepstack.example.com:80')
                .post('/v1/vision/face/recognize', function(body) {
                    return !body.includes('Content-Disposition: form-data; name=\"admin_key\"\r\n\r\nadminKey')
                })
                .reply(200, {test:"test"});
            
            await deepstack.faceRecognition(image, server, 0.8);
            expect(scope.isDone()).to.be.true;
        });
    });

    describe('#faceRegistration()', function() {
        var deepstack;
        var image;
        var server;

        beforeEach(function(){
            deepstack = require('../deepstack-integration');
            images = ['-'];
            server = {
                proto: "http",
                host: "deepstack.example.com",
                port: 80,
                version: "v1",
                rejectUnauthorized: true,
                credentials: {
                    apiKey: "apiKey",
                    adminKey: "adminKey"
                }
            }
        });
        
        it('should POST to /vision/face/register', async function() {
            const scope = nock('http://deepstack.example.com:80')
                .post('/v1/vision/face/register', function(body) {return true})
                .reply(200, {test:"test"});
            
            var res = await deepstack.faceRegistration(images, server, 'userid');
            expect(scope.isDone()).to.be.true;
            expect(res.test).to.equal('test');
        });
        
        it('should use protocol from server', async function() {
            server.proto = 'https';
            const scope = nock('https://deepstack.example.com:80')
                .post('/v1/vision/face/register', function(body) {return true})
                .reply(200, {test:"test"});
            
            await deepstack.faceRegistration(images, server, 'userid');
            expect(scope.isDone()).to.be.true;
        });
        
        it('should use host from server', async function() {
            server.host = 'deepstack2.example.com';
            const scope = nock('http://deepstack2.example.com:80')
                .post('/v1/vision/face/register', function(body) {return true})
                .reply(200, {test:"test"});
            
            await deepstack.faceRegistration(images, server, 'userid');
            expect(scope.isDone()).to.be.true;
        });
        
        it('should use port from server', async function() {
            server.port = 81;
            const scope = nock('http://deepstack.example.com:81')
                .post('/v1/vision/face/register', function(body) {return true})
                .reply(200, {test:"test"});
            
            await deepstack.faceRegistration(images, server, 'userid');
            expect(scope.isDone()).to.be.true;
        });
        
        it('should use version from server', async function() {
            server.version = 'v2';
            const scope = nock('http://deepstack.example.com:80')
                .post('/v2/vision/face/register', function(body) {return true})
                .reply(200, {test:"test"});
            
            await deepstack.faceRegistration(images, server, 'userid');
            expect(scope.isDone()).to.be.true;
        });
        
        it('should use version from server', async function() {
            server.version = 'v2';
            const scope = nock('http://deepstack.example.com:80')
                .post('/v2/vision/face/register', function(body) {return true})
                .reply(200, {test:"test"});
            
            await deepstack.faceRegistration(images, server, 'userid');
            expect(scope.isDone()).to.be.true;
        });
        
        it('should set image as image0.jpg in the form data', async function() {
            const scope = nock('http://deepstack.example.com:80')
                .post('/v1/vision/face/register', function(body) {
                    return body.includes('Content-Disposition: form-data; name="image0"; filename="image0.jpg"\r\nContent-Type: image/jpeg')
                })
                .reply(200, {test:"test"});
            
            await deepstack.faceRegistration(images, server, 'userid');
            expect(scope.isDone()).to.be.true;
        });
        
        it('should add all images from the array to the form data', async function() {
            images.push('-', '-');
            const scope = nock('http://deepstack.example.com:80')
                .post('/v1/vision/face/register', function(body) {
                    let hasImage0 = body.includes('Content-Disposition: form-data; name="image0"; filename="image0.jpg"\r\nContent-Type: image/jpeg');
                    let hasImage1 = body.includes('Content-Disposition: form-data; name="image1"; filename="image1.jpg"\r\nContent-Type: image/jpeg');
                    let hasImage2 = body.includes('Content-Disposition: form-data; name="image2"; filename="image2.jpg"\r\nContent-Type: image/jpeg');
                    return hasImage0 && hasImage1 && hasImage2;
                })
                .reply(200, {test:"test"});
            
            await deepstack.faceRegistration(images, server, 'userid');
            expect(scope.isDone()).to.be.true;
        });
        
        it('should set userid as userid', async function() {
            const scope = nock('http://deepstack.example.com:80')
                .post('/v1/vision/face/register', function(body) {
                    return body.includes('Content-Disposition: form-data; name="userid"\r\n\r\nuserid')
                })
                .reply(200, {test:"test"});
            
            await deepstack.faceRegistration(images, server, 'userid');
            expect(scope.isDone()).to.be.true;
        });
        
        it('should set api_key if present', async function() {
            const scope = nock('http://deepstack.example.com:80')
                .post('/v1/vision/face/register', function(body) {
                    return body.includes('Content-Disposition: form-data; name=\"api_key\"\r\n\r\napiKey')
                })
                .reply(200, {test:"test"});
            
            await deepstack.faceRegistration(images, server, 'userid');
            expect(scope.isDone()).to.be.true;
        });
        
        it('should not set api_key if not present', async function() {
            server.credentials.apiKey=null
            const scope = nock('http://deepstack.example.com:80')
                .post('/v1/vision/face/register', function(body) {
                    return !body.includes('Content-Disposition: form-data; name=\"api_key\"\r\n\r\napiKey')
                })
                .reply(200, {test:"test"});
            
            await deepstack.faceRegistration(images, server, 'userid');
            expect(scope.isDone()).to.be.true;
        });
        
        it('should set admin_key if present', async function() {
            const scope = nock('http://deepstack.example.com:80')
                .post('/v1/vision/face/register', function(body) {
                    return body.includes('Content-Disposition: form-data; name=\"admin_key\"\r\n\r\nadminKey')
                })
                .reply(200, {test:"test"});
            
            await deepstack.faceRegistration(images, server, 'userid');
            expect(scope.isDone()).to.be.true;
        });
        
        it('should not set admin_key if not present', async function() {
            server.credentials.adminKey=null
            const scope = nock('http://deepstack.example.com:80')
                .post('/v1/vision/face/register', function(body) {
                    return !body.includes('Content-Disposition: form-data; name=\"admin_key\"\r\n\r\nadminKey')
                })
                .reply(200, {test:"test"});
            
            await deepstack.faceRegistration(images, server, 'userid');
            expect(scope.isDone()).to.be.true;
        });
    });

    describe('#getOutlines()', function() {
        const deepstack = require('../deepstack-integration');
        const prediction = {x_min: 1, y_min: 2, x_max: 3, y_max: 4}

        it('should set x from prediction x_min', function() {
            expect(deepstack.getOutlines(prediction).x).to.equal(prediction.x_min);
        });

        it('should set y from prediction y_min', function() {
            expect(deepstack.getOutlines(prediction).y).to.equal(prediction.y_min);
        });

        it('should set width from prediction x_max-x_min', function() {
            expect(deepstack.getOutlines(prediction).width).to.equal(prediction.x_max - prediction.x_min);
        });

        it('should set height from prediction y_max-y_min', function() {
            expect(deepstack.getOutlines(prediction).height).to.equal(prediction.y_max - prediction.y_min);
        });
    });
});