const chai = require('chai');
const expect = chai.expect;
const rewire = require("rewire");

describe('Deepstack face recognition', function() {
    describe('#faceRecognition()', function() {
        var deepstackFaceRecognition;
        var faceRecognition;

        beforeEach(function(){
            deepstackFaceRecognition = rewire('../deepstack-face-recognition.js');
            faceRecognition = deepstackFaceRecognition.__get__('faceRecognition');
        });
        
        it('should set duration from deepstack result', async function() {
            const duration = 10;
            let deepstackMock = {
                faceRecognition: function (original, server, confidence) {
                    return new Promise((resolve, reject) => {
                        resolve({duration: duration});
                    });
                }
            };

            deepstackFaceRecognition.__set__("deepstack", deepstackMock);

            var outputs = await faceRecognition({payload: {}},{filters: []},{});
            expect(outputs[0].duration).to.equal(duration);
        });
        
        it('should set duration to 0 for missing duration', async function() {
            const duration = undefined;
            let deepstackMock = {
                faceRecognition: function (original, server, confidence) {
                    return new Promise((resolve, reject) => {
                        resolve({duration: duration});
                    });
                }
            };

            deepstackFaceRecognition.__set__("deepstack", deepstackMock);

            var outputs = await faceRecognition({payload: {}},{filters: []},{});
            expect(outputs[0].duration).to.equal(0);
        });
    });
});