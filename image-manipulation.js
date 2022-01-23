const sharp = require('sharp');

const imageManipulation = {
    /**
     * Paint outlines on the supplied picture.
     *
     * @param buffer image buffer to painnt outlines on.
     * @param outlines the outlines to paint. {x: *, width: number, y: *, height: number}
     * @param outlineColor color to use for the outline.
     * @returns {PromiseLike<T>}
     */
    outlineImage: function(buffer, outlines, outlineColor) {
        return sharp(buffer).metadata().then(meta => {
            let svgOverlay = '';

            outlines = outlines instanceof Array ? outlines : [outlines];

            outlines.forEach(o => {
                svgOverlay += '<rect x="' + o.x + '" y="' + o.y + '" width="' + o.width + '" height="' + o.height + '" ' +
                    'style="fill:none;stroke:' + outlineColor + ';stroke-width:3;" />';
            });
            return '<svg width="' + meta.width + '" height="' + meta.height + '">' + svgOverlay + '</svg>';
        }).then(overlay => {
            return sharp(buffer).composite([{
                input: Buffer.from(overlay),
                blend: 'over'
            }]).toBuffer();
        });
    },

    addLabel: function(buffer, label, x, y, color) {
        return sharp(buffer).metadata().then(meta => {
            let text = '<text x="' + x + '" y="' + y + '" fill="' + color + '" font-size="100%" dominant-baseline="ideographic" baseline-shift="8" alignment-baseline="baseline">' + label + '</text>';
            return '<svg width="' + meta.width + '" height="' + meta.height + '">' + text + '</svg>';
        }).then(overlay => {
            return sharp(buffer).composite([{
                input: Buffer.from(overlay),
                blend: 'over'
            }]).toBuffer();
        });
    }
};

module.exports = imageManipulation;