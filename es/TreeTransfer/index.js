import 'antd/es/tree/style';
import _Tree from 'antd/es/tree';
import 'antd/es/transfer/style';
import _Transfer from 'antd/es/transfer';
import _toConsumableArray from '@babel/runtime/helpers/esm/toConsumableArray';
import _slicedToArray from '@babel/runtime/helpers/esm/slicedToArray';
import _objectSpread from '@babel/runtime/helpers/esm/objectSpread2';
import _objectWithoutProperties from '@babel/runtime/helpers/esm/objectWithoutProperties';
var _excluded = ['children', 'key'],
  _excluded2 = [
    'dataSource',
    'hiddenDataSource',
    'lazySearchProps',
    'showSelectCount',
    'parentOnly',
    'targetKeys',
    'loadData',
    'onChange',
    'onSelectChange',
  ],
  _excluded3 = ['showSearch', 'cacheMax', 'onSearch'];

/**
 * @file 树形穿梭框
 * @module components/TreeTransfer
 * @author 月落 <yueluo.yang@qq.com>
 */
import React, { useState } from 'react';
import Search, { CACHE_MAX_LENGTH } from './components/Search';
import './index.css';
export var DIRECTION;

(function (DIRECTION) {
  DIRECTION['LEFT'] = 'left';
  DIRECTION['RIGHT'] = 'right';
})(DIRECTION || (DIRECTION = {}));
/**
 * @description 标准化树形结构数据
 * @param data
 * @param normalizeProps
 * @returns
 */

export var normalizeTreeData = function normalizeTreeData(
  data,
  normalizeProps,
) {
  var _normalizeProps$key = normalizeProps.key,
    key = _normalizeProps$key === void 0 ? 'key' : _normalizeProps$key,
    _normalizeProps$title = normalizeProps.title,
    title = _normalizeProps$title === void 0 ? 'title' : _normalizeProps$title,
    _normalizeProps$child = normalizeProps.children,
    children =
      _normalizeProps$child === void 0 ? 'children' : _normalizeProps$child,
    _normalizeProps$isLea = normalizeProps.isLeaf,
    isLeaf =
      _normalizeProps$isLea === void 0
        ? function () {
            return true;
          }
        : _normalizeProps$isLea;
  if (!data) return [];
  return data.map(function (item) {
    return {
      key: item[key],
      title: item[title],
      children: normalizeTreeData(item[children], normalizeProps),
      isLeaf: isLeaf(item),
    };
  });
};
/**
 * @description 生成树节点
 * @param treeNodes
 * @param checkedKeys
 * @returns
 */

var generateTreeNode = function generateTreeNode() {
  var treeNodes =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var checkedKeys =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  if (!treeNodes) return [];
  return treeNodes.map(function (_ref) {
    var children = _ref.children,
      key = _ref.key,
      props = _objectWithoutProperties(_ref, _excluded);

    return _objectSpread(
      _objectSpread({}, props),
      {},
      {
        key: key,
        // disabled: checkedKeys.includes(key),
        children: generateTreeNode(children, checkedKeys),
      },
    );
  });
}; // 判断是否选中

var isChecked = function isChecked(selectedKeys, eventKey) {
  return selectedKeys.includes(eventKey);
};

var TreeTransfer = function TreeTransfer(props) {
  var dataSource = props.dataSource,
    hiddenDataSource = props.hiddenDataSource,
    _props$lazySearchProp = props.lazySearchProps,
    lazySearchProps =
      _props$lazySearchProp === void 0 ? {} : _props$lazySearchProp,
    _props$showSelectCoun = props.showSelectCount,
    showSelectCount =
      _props$showSelectCoun === void 0 ? true : _props$showSelectCoun,
    parentOnly = props.parentOnly,
    _props$targetKeys = props.targetKeys,
    targetKeys = _props$targetKeys === void 0 ? [] : _props$targetKeys,
    loadData = props.loadData,
    onChange = props.onChange,
    onSelectChange = props.onSelectChange,
    restProps = _objectWithoutProperties(props, _excluded2);
  /**
   * @property {object} lazySearchProps - 懒加载搜索配置
   * @property {NormalizeProps[]} lazyCache - 懒加载数据缓存
   */

  var showSearch = lazySearchProps.showSearch,
    _lazySearchProps$cach = lazySearchProps.cacheMax,
    cacheMax =
      _lazySearchProps$cach === void 0
        ? CACHE_MAX_LENGTH
        : _lazySearchProps$cach,
    onSearch = lazySearchProps.onSearch,
    searchProps = _objectWithoutProperties(lazySearchProps, _excluded3);

  var _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    lazyCache = _useState2[0],
    setLazyCache = _useState2[1]; // 穿梭框实际数据

  var transferDataSource = []; // 深度遍历数据

  var flattern = function flattern() {
    var list =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    list.forEach(function (item) {
      transferDataSource.push(item);
      item.children && flattern(item.children);
    });
  };

  flattern(dataSource); // 已选中且不在侧边栏的数据

  if (Array.isArray(dataSource)) {
    var keys = transferDataSource.map(function (item) {
      return item.key;
    });
    hiddenDataSource &&
      hiddenDataSource.forEach(function (item) {
        if (!keys.includes(item.key)) {
          transferDataSource.push(item);
        }
      });
    lazyCache.forEach(function (item) {
      if (!keys.includes(item.key)) {
        transferDataSource.push(item);
      }
    });
  } // 懒加载数据

  var handleLoadData = function handleLoadData(_ref2) {
    var key = _ref2.key,
      children = _ref2.children;
    return new Promise(function (resolve) {
      if (children && children.length > 0) {
        resolve();
        return;
      }

      loadData ? loadData(key, resolve) : resolve();
    });
  }; // 选项移动

  var handleChange = function handleChange(targetKeys, direction, movekeys) {
    if (direction === DIRECTION.RIGHT && parentOnly) {
      var cacheData = JSON.parse(JSON.stringify(dataSource));

      var _loop = function _loop() {
        var p = targetKeys.shift();

        var dfs = function dfs(data) {
          data.forEach(function (item) {
            if (item.key === p) {
              item.checked = true;
              return;
            }

            if (item.children) {
              dfs(item.children);
            }
          });
        };

        dfs(cacheData);
      };

      while (targetKeys.length) {
        _loop();
      }

      var _keys2 = [];

      var dfs = function dfs(data) {
        data.forEach(function (item) {
          if (item.checked) {
            _keys2.push(item.key);

            return;
          }

          item.children && dfs(item.children);
        });
      };

      dfs(cacheData);
      onChange &&
        onChange(_toConsumableArray(new Set(_keys2)), direction, movekeys);
    } else {
      onChange && onChange(targetKeys, direction, movekeys);
    }
  }; // 缓存懒加载数据，避免获取新数据后右侧已选中条目消失

  var handleLazySearch = function handleLazySearch(value, e) {
    var data =
      dataSource === null || dataSource === void 0
        ? void 0
        : dataSource.filter(function (item) {
            return targetKeys.some(function (key) {
              return key === item.key;
            });
          });
    var cache = lazyCache.concat(data || []);
    var len = cache.length - cacheMax;

    if (len > 0) {
      // 缓存淘汰策略，优先淘汰历史数据
      cache.splice(0, len);
    }

    setLazyCache(cache);
    onSearch && onSearch(value, e);
  };

  return /*#__PURE__*/ React.createElement(
    _Transfer,
    _objectSpread(
      _objectSpread({}, restProps),
      {},
      {
        className: 'tree-transfer '.concat(showSelectCount ? '' : 'hidden'),
        dataSource: transferDataSource,
        targetKeys: targetKeys,
        onChange: handleChange,
      },
    ),
    function (_ref3) {
      var direction = _ref3.direction,
        onItemSelect = _ref3.onItemSelect,
        onItemSelectAll = _ref3.onItemSelectAll,
        selectedKeys = _ref3.selectedKeys,
        notFoundContent = _ref3.notFoundContent,
        prefixCls = _ref3.prefixCls;

      if (direction === 'left') {
        var checkedKeys = [].concat(
          _toConsumableArray(selectedKeys),
          _toConsumableArray(targetKeys),
        );
        return /*#__PURE__*/ React.createElement(
          React.Fragment,
          null,
          showSearch &&
            /*#__PURE__*/ React.createElement(
              Search,
              _objectSpread(
                _objectSpread({}, searchProps),
                {},
                {
                  onSearch: handleLazySearch,
                },
              ),
            ),
          dataSource && dataSource.length > 0
            ? /*#__PURE__*/ React.createElement(_Tree, {
                blockNode: true,
                checkable: true,
                checkStrictly: !parentOnly,
                selectable: false,
                checkedKeys: checkedKeys,
                loadData: handleLoadData,
                treeData: generateTreeNode(dataSource, targetKeys),
                onCheck: function onCheck(keys, _ref4) {
                  var key = _ref4.node.key;

                  if (parentOnly) {
                    if (keys.length > selectedKeys.length) {
                      onItemSelectAll(keys, true);
                    } else {
                      var _keys = keys || [];

                      var difference = selectedKeys.filter(function (x) {
                        return !_keys.includes(x);
                      });
                      onItemSelectAll(difference, false);
                    }
                  } else {
                    onItemSelect(key, !isChecked(checkedKeys, key));
                  }
                },
              })
            : /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: ''.concat(
                    prefixCls,
                    '-body-not-found no-data-board',
                  ),
                },
                notFoundContent,
              ),
        );
      }

      return null;
    },
  );
};

export default TreeTransfer;
