'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = createResponsiveConnect;

var _createMatchMediaConnect = require('./createMatchMediaConnect');

var _createMatchMediaConnect2 = _interopRequireDefault(_createMatchMediaConnect);

var _capitalize = require('./utils/capitalize');

var _capitalize2 = _interopRequireDefault(_capitalize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultBreakpoints = {
    xs: 480,
    sm: 768,
    md: 992,
    lg: 1200
};

function createResponsiveConnect() {
    var breakpoints = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultBreakpoints;
    var matchMediaOptions = arguments[1];

    var breakpointsList = [];
    var queryMap = {
        isLandscape: '(orientation: landscape)',
        isPortrait: '(orientation: portrait)'
    };

    for (var key in breakpoints) {
        if (!breakpoints.hasOwnProperty(key)) continue;
        var value = breakpoints[key];
        breakpointsList.push({ key: key, value: value });
    }

    // Make sure breakpoints are ordered by value ASC
    breakpointsList.sort(function (_ref, _ref2) {
        var a = _ref.value;
        var b = _ref2.value;
        return a - b;
    });

    breakpointsList.forEach(function (breakpoint, idx) {
        var key = breakpoint.key;

        var capitalizedKey = (0, _capitalize2.default)(key);
        // Skip min-width query for first element
        if (idx > 0) {
            var width = breakpoint.value;

            var minWidthKey = 'isMin' + capitalizedKey;
            queryMap[minWidthKey] = '(min-width: ' + width + 'px)';
        }
        var nextBreakpoint = breakpointsList[idx + 1];
        // Skip max-width query for last element
        if (nextBreakpoint) {
            var nextWidth = nextBreakpoint.value;

            var maxWidthKey = 'isMax' + capitalizedKey;
            queryMap[maxWidthKey] = '(max-width: ' + (nextWidth - 1) + 'px)';
        }
    });

    return (0, _createMatchMediaConnect2.default)(queryMap, matchMediaOptions);
}