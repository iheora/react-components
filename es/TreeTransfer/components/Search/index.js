import _objectSpread from '@babel/runtime/helpers/esm/objectSpread2';
import 'antd/es/input/style';
import _Input from 'antd/es/input';
import _objectWithoutProperties from '@babel/runtime/helpers/esm/objectWithoutProperties';
var _excluded = ['showSearch', 'placeholder'];

/**
 * @file 搜索框
 * @module components/ProTreeTransfer
 */
import React from 'react';
import './index.css';
export var CACHE_MAX_LENGTH = 200;

var Search = function Search(props) {
  var showSearch = props.showSearch,
    placeholder = props.placeholder,
    restProps = _objectWithoutProperties(props, _excluded);

  return /*#__PURE__*/ React.createElement(
    _Input.Search,
    _objectSpread(
      _objectSpread({}, restProps),
      {},
      {
        placeholder: placeholder || '请输入搜索内容',
        className: 'transfer-search',
      },
    ),
  );
};

export default Search;
