'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createMatchMediaConnect;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _shallowEqual = require('./utils/shallowEqual');

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

var _throttle = require('./utils/throttle');

var _throttle2 = _interopRequireDefault(_throttle);

var _pick = require('./utils/pick');

var _pick2 = _interopRequireDefault(_pick);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function createMatchMediaConnect() {
    var queryMap = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _options$matchMediaFn = options.matchMediaFn,
        matchMediaFn = _options$matchMediaFn === undefined ? window.matchMedia : _options$matchMediaFn;

    var mqls = {};
    var listeners = [];
    var state = {};

    function subscribe(listener) {
        listeners.push(listener);
        return function unsubscribe() {
            var index = listeners.indexOf(listener);
            listeners.splice(index, 1);
        };
    }

    function createState() {
        var nextState = {};
        for (var key in mqls) {
            if (!mqls.hasOwnProperty(key)) continue;
            var mql = mqls[key];
            var matches = mql.matches;

            nextState[key] = matches;
        }
        return nextState;
    }

    var handleChange = (0, _throttle2.default)(function () {
        var nextState = createState();
        if ((0, _shallowEqual2.default)(state, nextState)) return;
        state = nextState;
        listeners.forEach(function (listener) {
            return listener(nextState);
        });
    });

    if (matchMediaFn) {
        for (var key in queryMap) {
            if (!queryMap.hasOwnProperty(key)) continue;
            var query = queryMap[key];
            var mql = matchMediaFn(query);
            mql.addListener(handleChange);
            mqls[key] = mql;
        }
    }

    function destroy() {
        listeners.length = 0;
        for (var _key in mqls) {
            if (!mqls.hasOwnProperty(_key)) continue;
            var _mql = mqls[_key];
            _mql.removeListener(handleChange);
            mqls[_key] = undefined;
        }
    }

    state = createState();

    function connect() {
        var pickProperties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        function pickState(stateToPickFrom) {
            if (!pickProperties.length) return stateToPickFrom;
            return _pick2.default.apply(undefined, [stateToPickFrom].concat(_toConsumableArray(pickProperties)));
        }
        return function wrapWithConnect(Component) {
            return (0, _react.createClass)({
                displayName: 'ConnectMatchMedia',
                getInitialState: function getInitialState() {
                    return pickState(state);
                },
                componentDidMount: function componentDidMount() {
                    this.unsubscribe = subscribe(this.handleChange);
                },
                componentWillUnmount: function componentWillUnmount() {
                    this.unsubscribe();
                },
                handleChange: function handleChange(nextState) {
                    var nextPickedState = pickState(nextState);
                    if ((0, _shallowEqual2.default)(this.state, nextPickedState)) return;
                    this.setState(nextPickedState);
                },
                render: function render() {
                    return _react2.default.createElement(Component, _extends({}, this.props, this.state));
                }
            });
        };
    }

    // For testing
    connect.destroy = destroy;
    connect.listeners = listeners;
    return connect;
}