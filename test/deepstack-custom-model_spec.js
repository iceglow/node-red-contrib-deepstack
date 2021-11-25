const chai = require('chai');
const expect = chai.expect;
const rewire = require("rewire");

describe('Deepstack custom model', function() {
    describe('#customModel()', function() {
        var deepstackCustomModel;
        var customModel;

        beforeEach(function(){
            deepstackCustomModel = rewire('../deepstack-custom-model.js');
            customModel = deepstackCustomModel.__get__('customModel');
        });
        
        it('should set duration from deepstack result', async function() {
            const duration = 10;
            let deepstackMock = {
                customModel: function (original, server, confidence) {
                    return new Promise((resolve, reject) => {
                        resolve({duration: duration});
                    });
                }
            };

            deepstackCustomModel.__set__("deepstack", deepstackMock);

            var output = await customModel({payload: {}},{});
            expect(output.duration).to.equal(duration);
        });
        
        it('should set duration to 0 for missing duration', async function() {
            const duration = undefined;
            let deepstackMock = {
                customModel: function (original, server, confidence) {
                    return new Promise((resolve, reject) => {
                        resolve({duration: duration});
                    });
                }
            };

            deepstackCustomModel.__set__("deepstack", deepstackMock);

            var output = await customModel({payload: {}},{});
            expect(output.duration).to.equal(0);
        });
        
        it('should handle floats', async function() {
            const duration = 0.123;
            let deepstackMock = {
                customModel: function (original, server, confidence) {
                    return new Promise((resolve, reject) => {
                        resolve({duration: duration});
                    });
                }
            };

            deepstackCustomModel.__set__("deepstack", deepstackMock);

            var output = await customModel({payload: {}},{});
            expect(output.duration).to.equal(duration);
        });
    });
});