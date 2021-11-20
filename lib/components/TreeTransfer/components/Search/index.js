'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = exports.CACHE_MAX_LENGTH = void 0;

var _objectSpread2 = _interopRequireDefault(
  require('@babel/runtime/helpers/objectSpread2'),
);

require('antd/es/input/style');

var _input = _interopRequireDefault(require('antd/es/input'));

var _objectWithoutProperties2 = _interopRequireDefault(
  require('@babel/runtime/helpers/objectWithoutProperties'),
);

var _react = _interopRequireDefault(require('react'));

require('./index.css');

var _excluded = ['showSearch', 'placeholder'];
var CACHE_MAX_LENGTH = 200;
exports.CACHE_MAX_LENGTH = CACHE_MAX_LENGTH;

var Search = function Search(props) {
  var showSearch = props.showSearch,
    placeholder = props.placeholder,
    restProps = (0, _objectWithoutProperties2.default)(props, _excluded);
  return /*#__PURE__*/ _react.default.createElement(
    _input.default.Search,
    (0, _objectSpread2.default)(
      (0, _objectSpread2.default)({}, restProps),
      {},
      {
        placeholder: placeholder || '请输入搜索内容',
        className: 'transfer-search',
      },
    ),
  );
};

var _default = Search;
exports.default = _default;
