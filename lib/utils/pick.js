"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = pick;
function pick(object) {
    for (var _len = arguments.length, props = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        props[_key - 1] = arguments[_key];
    }

    if (!props.length) return {};
    return props.reduce(function (acc, prop) {
        if (object.hasOwnProperty(prop)) {
            acc[prop] = object[prop];
        }
        return acc;
    }, {});
}