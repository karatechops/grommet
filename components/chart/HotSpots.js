'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('./utils');

var _CSSClassnames = require('../../utils/CSSClassnames');

var _CSSClassnames2 = _interopRequireDefault(_CSSClassnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CLASS_ROOT = _CSSClassnames2.default.CHART_HOT_SPOTS;

// Interactive regions.

// (C) Copyright 2016 Hewlett Packard Enterprise Development LP

var HotSpots = function (_Component) {
  (0, _inherits3.default)(HotSpots, _Component);

  function HotSpots(props) {
    (0, _classCallCheck3.default)(this, HotSpots);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(HotSpots).call(this, props));

    _this.state = { size: {} };
    _this._size = new _utils.trackSize(props, _this._onSize.bind(_this));
    return _this;
  }

  (0, _createClass3.default)(HotSpots, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._size.start(this.refs.hotSpots);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this._size.reset(nextProps);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._size.stop();
    }
  }, {
    key: '_onSize',
    value: function _onSize(size) {
      this.setState({ size: size });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var count = _props.count;
      var values = _props.values;
      var max = _props.max;
      var min = _props.min;
      var vertical = _props.vertical;
      var activeIndex = _props.activeIndex;
      var onActive = _props.onActive;
      var _state$size = this.state.size;
      var height = _state$size.height;
      var width = _state$size.width;


      var classes = [CLASS_ROOT];
      if (vertical) {
        classes.push(CLASS_ROOT + '--vertical');
      }

      var graphValues = [];
      if (values) {
        graphValues = values.map(function (value, index) {
          return (0, _utils.graphValue)(value, min, max, vertical ? height : width);
        });
      } else if (count) {
        var delta = (max - min) / (count - 1);
        for (var value = min; value <= max; value += delta) {
          graphValues.push((0, _utils.graphValue)(value, min, max, vertical ? height : width));
        }
      }

      var priorEnd = graphValues[0];
      var totalBasis = 0;
      var items = graphValues.map(function (graphValue, index) {
        var classes = ['hot-spots__band'];
        if (index === activeIndex) {
          classes.push('hot-spots__band--active');
        }
        var start = priorEnd;
        var end = void 0;
        if (index >= graphValues.length - 1) {
          end = graphValue;
        } else {
          end = graphValue + (graphValues[index + 1] - graphValue) / 2;
        }
        priorEnd = end;
        var delta = end - start;

        var basis = void 0;
        if (index > 0 && index === graphValues.length - 1) {
          basis = 100 - totalBasis;
        } else {
          basis = delta / ((vertical ? height : width) || 1) * 100;
          totalBasis += basis;
        }
        var style = { flexBasis: basis + '%' };

        var onOver = void 0,
            onOut = void 0;
        if (onActive) {
          onOver = function onOver() {
            return onActive(index);
          };
          onOut = function onOut() {
            return onActive(undefined);
          };
        }

        return _react2.default.createElement('div', { key: index, className: classes.join(' '), style: style,
          onMouseOver: onOver, onMouseOut: onOut });
      });

      return _react2.default.createElement(
        'div',
        { ref: 'hotSpots', className: classes.join(' ') },
        items
      );
    }
  }]);
  return HotSpots;
}(_react.Component);

HotSpots.displayName = 'HotSpots';
exports.default = HotSpots;
;

HotSpots.propTypes = {
  activeIndex: _react.PropTypes.number,
  count: _react.PropTypes.number,
  max: _react.PropTypes.number.isRequired,
  min: _react.PropTypes.number,
  onActive: _react.PropTypes.func,
  values: _react.PropTypes.arrayOf(_react.PropTypes.number),
  vertical: _react.PropTypes.bool
};

HotSpots.defaultProps = {
  min: 0,
  max: 100
};
module.exports = exports['default'];