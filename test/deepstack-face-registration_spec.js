const chai = require('chai');
const expect = chai.expect;
const rewire = require("rewire");

describe('Deepstack face registration', function() {
    describe('#faceRegistration()', function() {
        var deepstackFaceRegisration;
        var faceRegistration;

        beforeEach(function(){
            deepstackFaceRegisration = rewire('../deepstack-face-registration.js');
            faceRegistration = deepstackFaceRegisration.__get__('faceRegistration');
        });
        
        it('should set duration from deepstack result', async function() {
            const duration = 10;
            let deepstackMock = {
                faceRegistration: function (images, server, userid) {
                    return new Promise((resolve, reject) => {
                        resolve({duration: duration});
                    });
                }
            };

            deepstackFaceRegisration.__set__("deepstack", deepstackMock);

            var output = await faceRegistration({payload: []},{},'test');
            expect(output.duration).to.equal(duration);
        });
        
        it('should set duration to 0 for missing duration', async function() {
            const duration = undefined;
            let deepstackMock = {
                faceRegistration: function (original, server, confidence) {
                    return new Promise((resolve, reject) => {
                        resolve({duration: duration});
                    });
                }
            };

            deepstackFaceRegisration.__set__("deepstack", deepstackMock);

            var output = await faceRegistration({payload: []},{},'test');
            expect(output.duration).to.equal(0);
        });
    });
});