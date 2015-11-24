"use strict";
// http://jsfiddle.net/justin_c_rounds/Gd2S2/

class V {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    subtract(v) {
        return new V(this.x - v.x, this.y - v.y);
    }
}

function checkLineIntersection(a1, a2, b1, b2) {
    var a = a2.subtract(a1);
    var b = b2.subtract(b1);

    var denominator = a.x*b.y - b.x*a.y;

    // Lines are parellel
    if (denominator == 0) return undefined;

    var numerator1 = (b.x * (a1.y - b1.y)) - (b.y * (a1.x - b1.x));
    var numerator2 = (a.x * (a1.y - b1.y)) - (a.y * (a1.x - b1.x));

    var ra = numerator1 / denominator;
    var rb = numerator2 / denominator;

    if (ra > 0 && ra < 1 && rb > 0 && rb < 1) {
        // The point overlaps both segments

        // if we cast these lines infinitely in both directions, they intersect here:
        var x = a1.x + (ra * a.x);
        var y = a1.y + (ra * a.y);
        return new V(x, y);
    }
};

var result = checkLineIntersection(new V(0, 0), new V(4, 4),  new V(4, 0), new V(0, 4));

console.log(result); // V { x: 2, y: 2 }
