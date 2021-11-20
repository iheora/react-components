'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

var _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.normalizeTreeData = exports.default = exports.DIRECTION = void 0;

require('antd/es/tree/style');

var _tree = _interopRequireDefault(require('antd/es/tree'));

require('antd/es/transfer/style');

var _transfer = _interopRequireDefault(require('antd/es/transfer'));

var _toConsumableArray2 = _interopRequireDefault(
  require('@babel/runtime/helpers/toConsumableArray'),
);

var _slicedToArray2 = _interopRequireDefault(
  require('@babel/runtime/helpers/slicedToArray'),
);

var _objectSpread2 = _interopRequireDefault(
  require('@babel/runtime/helpers/objectSpread2'),
);

var _objectWithoutProperties2 = _interopRequireDefault(
  require('@babel/runtime/helpers/objectWithoutProperties'),
);

var _react = _interopRequireWildcard(require('react'));

var _Search = _interopRequireWildcard(require('./components/Search'));

require('./index.css');

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
var DIRECTION;
exports.DIRECTION = DIRECTION;

(function (DIRECTION) {
  DIRECTION['LEFT'] = 'left';
  DIRECTION['RIGHT'] = 'right';
})(DIRECTION || (exports.DIRECTION = DIRECTION = {}));
/**
 * @description 标准化树形结构数据
 * @param data
 * @param normalizeProps
 * @returns
 */

var normalizeTreeData = function normalizeTreeData(data, normalizeProps) {
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

exports.normalizeTreeData = normalizeTreeData;

var generateTreeNode = function generateTreeNode() {
  var treeNodes =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var checkedKeys =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  if (!treeNodes) return [];
  return treeNodes.map(function (_ref) {
    var children = _ref.children,
      key = _ref.key,
      props = (0, _objectWithoutProperties2.default)(_ref, _excluded);
    return (0, _objectSpread2.default)(
      (0, _objectSpread2.default)({}, props),
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
    restProps = (0, _objectWithoutProperties2.default)(props, _excluded2);
  /**
   * @property {object} lazySearchProps - 懒加载搜索配置
   * @property {NormalizeProps[]} lazyCache - 懒加载数据缓存
   */

  var showSearch = lazySearchProps.showSearch,
    _lazySearchProps$cach = lazySearchProps.cacheMax,
    cacheMax =
      _lazySearchProps$cach === void 0
        ? _Search.CACHE_MAX_LENGTH
        : _lazySearchProps$cach,
    onSearch = lazySearchProps.onSearch,
    searchProps = (0, _objectWithoutProperties2.default)(
      lazySearchProps,
      _excluded3,
    );

  var _useState = (0, _react.useState)([]),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
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
        onChange(
          (0, _toConsumableArray2.default)(new Set(_keys2)),
          direction,
          movekeys,
        );
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

  return /*#__PURE__*/ _react.default.createElement(
    _transfer.default,
    (0, _objectSpread2.default)(
      (0, _objectSpread2.default)({}, restProps),
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
          (0, _toConsumableArray2.default)(selectedKeys),
          (0, _toConsumableArray2.default)(targetKeys),
        );
        return /*#__PURE__*/ _react.default.createElement(
          _react.default.Fragment,
          null,
          showSearch &&
            /*#__PURE__*/ _react.default.createElement(
              _Search.default,
              (0, _objectSpread2.default)(
                (0, _objectSpread2.default)({}, searchProps),
                {},
                {
                  onSearch: handleLazySearch,
                },
              ),
            ),
          dataSource && dataSource.length > 0
            ? /*#__PURE__*/ _react.default.createElement(_tree.default, {
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
            : /*#__PURE__*/ _react.default.createElement(
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

var _default = TreeTransfer;
exports.default = _default;
