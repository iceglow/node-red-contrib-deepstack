const chai = require('chai');
const expect = chai.expect;
const rewire = require("rewire");

describe('Deepstack oject detection', function() {
    describe('#objectDetection()', function() {
        var deepstackOjectDetection;
        var objectDetection;

        beforeEach(function(){
            deepstackOjectDetection = rewire('../deepstack-object-detection.js');
            objectDetection = deepstackOjectDetection.__get__('objectDetection');
        });
        
        it('should set duration from deepstack result', async function() {
            const duration = 10;
            let deepstackMock = {
                objectDetection: function (original, server, confidence) {
                    return new Promise((resolve, reject) => {
                        resolve({duration: duration});
                    });
                }
            };

            deepstackOjectDetection.__set__("deepstack", deepstackMock);

            var outputs = await objectDetection({payload: {}},{filters: []},{});
            expect(outputs[0].duration).to.equal(duration);
        });
        
        it('should set duration to 0 for missing duration', async function() {
            const duration = undefined;
            let deepstackMock = {
                objectDetection: function (original, server, confidence) {
                    return new Promise((resolve, reject) => {
                        resolve({duration: duration});
                    });
                }
            };

            deepstackOjectDetection.__set__("deepstack", deepstackMock);

            var outputs = await objectDetection({payload: {}},{filters: []},{});
            expect(outputs[0].duration).to.equal(0);
        });
        
        it('should handle floats', async function() {
            const duration = 0.123;
            let deepstackMock = {
                objectDetection: function (original, server, confidence) {
                    return new Promise((resolve, reject) => {
                        resolve({duration: duration});
                    });
                }
            };

            deepstackOjectDetection.__set__("deepstack", deepstackMock);

            var outputs = await objectDetection({payload: {}},{filters: []},{});
            expect(outputs[0].duration).to.equal(duration);
        });
    });
});