"use strict";

var THREEUTILS = {};

THREEUTILS.spritesColliding(sprite1, sprite2) {
    
};

// Detect if this header is being used in nodejs or not, for fun.
if (typeof window === 'undefined') {
    console.log("Not a browser!");
    module.exports = THREEUTILS;
} else {
    console.log("This is a browser!");
}
