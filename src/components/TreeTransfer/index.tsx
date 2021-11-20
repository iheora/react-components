/**
 * @file 树形穿梭框
 * @module components/TreeTransfer
 * @author 月落 <yueluo.yang@qq.com>
 */

import React, { useState } from 'react';
import { Transfer, Tree } from 'antd';
import type { TransferProps } from 'antd';
import type { TransferDirection } from 'antd/lib/transfer';
import Search, { CACHE_MAX_LENGTH } from './components/Search';
import type { LzaySearchProps } from './components/Search';
import './index.less';

export enum DIRECTION {
  LEFT = 'left',
  RIGHT = 'right',
}

type normalizeProps = {
  key?: string;
  title?: string;
  children?: string;
  isLeaf?: (item: any) => boolean;
};

/**
 * @description 标准化树形结构数据
 * @param data
 * @param normalizeProps
 * @returns
 */
export const normalizeTreeData = (
  data: any,
  normalizeProps: normalizeProps,
) => {
  const {
    key = 'key',
    title = 'title',
    children = 'children',
    isLeaf = () => true,
  } = normalizeProps;

  if (!data) return [];

  return data.map((item: any) => ({
    key: item[key],
    title: item[title],
    children: normalizeTreeData(item[children], normalizeProps),
    isLeaf: isLeaf(item),
  }));
};

/**
 * @description 生成树节点
 * @param treeNodes
 * @param checkedKeys
 * @returns
 */
const generateTreeNode = (treeNodes: any = [], checkedKeys: any = []): any => {
  if (!treeNodes) return [];

  return treeNodes.map(({ children, key, ...props }: any) => ({
    ...props,
    key,
    // disabled: checkedKeys.includes(key),
    children: generateTreeNode(children, checkedKeys),
  }));
};

interface TreeTransferProps {
  parentOnly?: boolean;
  lazySearchProps?: LzaySearchProps;
  hiddenDataSource?: any[];
  showSelectCount?: boolean;
  loadData: (key: string, next: () => void) => void;
}

type Props = Partial<TreeTransferProps & TransferProps<any>>;

// 判断是否选中
const isChecked = (selectedKeys: string[], eventKey: string) =>
  selectedKeys.includes(eventKey);

const TreeTransfer: React.FC<Props> = (props) => {
  const {
    dataSource,
    hiddenDataSource,
    lazySearchProps = {},
    showSelectCount = true,
    parentOnly,
    targetKeys = [],
    loadData,
    onChange,
    onSelectChange,
    ...restProps
  } = props;

  /**
   * @property {object} lazySearchProps - 懒加载搜索配置
   * @property {NormalizeProps[]} lazyCache - 懒加载数据缓存
   */
  const {
    showSearch,
    cacheMax = CACHE_MAX_LENGTH,
    onSearch,
    ...searchProps
  } = lazySearchProps;
  const [lazyCache, setLazyCache] = useState<normalizeProps[]>([]);

  // 穿梭框实际数据
  const transferDataSource: any[] = [];

  // 深度遍历数据
  const flattern = (list: any = []) => {
    list.forEach((item: any) => {
      transferDataSource.push(item);
      item.children && flattern(item.children);
    });
  };

  flattern(dataSource);

  // 已选中且不在侧边栏的数据
  if (Array.isArray(dataSource)) {
    const keys = transferDataSource.map((item) => item.key);

    hiddenDataSource &&
      hiddenDataSource.forEach((item) => {
        if (!keys.includes(item.key)) {
          transferDataSource.push(item);
        }
      });
    lazyCache.forEach((item) => {
      if (!keys.includes(item.key)) {
        transferDataSource.push(item);
      }
    });
  }

  // 懒加载数据
  const handleLoadData = ({ key, children }: any) => {
    return new Promise<void>((resolve) => {
      if (children && children.length > 0) {
        resolve();
        return;
      }
      loadData ? loadData(key, resolve) : resolve();
    });
  };

  // 选项移动
  const handleChange = (
    targetKeys: string[],
    direction: TransferDirection,
    movekeys: string[],
  ) => {
    if (direction === DIRECTION.RIGHT && parentOnly) {
      const cacheData = JSON.parse(JSON.stringify(dataSource));

      while (targetKeys.length) {
        const p = targetKeys.shift();

        const dfs = (data: any[]) => {
          data.forEach((item) => {
            if (item.key === p) {
              item.checked = true;
              return;
            }
            if (item.children) {
              dfs(item.children);
            }
          });
        };

        dfs(cacheData as string[]);
      }

      const keys: string[] = [];

      const dfs = (data: any[]) => {
        data.forEach((item) => {
          if (item.checked) {
            keys.push(item.key);
            return;
          }

          item.children && dfs(item.children);
        });
      };

      dfs(cacheData);

      onChange && onChange([...new Set(keys)] as string[], direction, movekeys);
    } else {
      onChange && onChange(targetKeys, direction, movekeys);
    }
  };

  // 缓存懒加载数据，避免获取新数据后右侧已选中条目消失
  const handleLazySearch = (value: string, e: any) => {
    const data = dataSource?.filter((item) =>
      targetKeys.some((key) => key === item.key),
    );

    const cache = lazyCache.concat(data || []);
    const len = cache.length - cacheMax;

    if (len > 0) {
      // 缓存淘汰策略，优先淘汰历史数据
      cache.splice(0, len);
    }

    setLazyCache(cache);

    onSearch && onSearch(value, e);
  };

  return (
    <Transfer
      {...restProps}
      className={`tree-transfer ${showSelectCount ? '' : 'hidden'}`}
      dataSource={transferDataSource}
      targetKeys={targetKeys}
      onChange={handleChange}
    >
      {({
        direction,
        onItemSelect,
        onItemSelectAll,
        selectedKeys,
        notFoundContent,
        prefixCls,
      }) => {
        if (direction === 'left') {
          const checkedKeys = [...selectedKeys, ...targetKeys];

          return (
            <>
              {showSearch && (
                <Search {...searchProps} onSearch={handleLazySearch} />
              )}
              {dataSource && dataSource.length > 0 ? (
                <Tree
                  blockNode
                  checkable
                  checkStrictly={!parentOnly}
                  selectable={false}
                  checkedKeys={checkedKeys}
                  loadData={handleLoadData}
                  treeData={generateTreeNode(dataSource, targetKeys)}
                  onCheck={(keys, { node: { key } }) => {
                    if (parentOnly) {
                      if ((keys as string[]).length > selectedKeys.length) {
                        onItemSelectAll(keys as string[], true);
                      } else {
                        const _keys = (keys as string[]) || [];
                        const difference = selectedKeys.filter(
                          (x) => !_keys.includes(x),
                        );
                        onItemSelectAll(difference, false);
                      }
                    } else {
                      onItemSelect(
                        key as string,
                        !isChecked(checkedKeys, key as string),
                      );
                    }
                  }}
                />
              ) : (
                <div className={`${prefixCls}-body-not-found no-data-board`}>
                  {notFoundContent}
                </div>
              )}
            </>
          );
        }
        return null;
      }}
    </Transfer>
  );
};

export default TreeTransfer;
