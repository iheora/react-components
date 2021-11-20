/**
 * @file 树形穿梭框
 * @module components/TreeTransfer
 * @author 月落 <yueluo.yang@qq.com>
 */
import React from 'react';
import type { TransferProps } from 'antd';
import type { LzaySearchProps } from './components/Search';
import './index.less';
export declare enum DIRECTION {
  LEFT = 'left',
  RIGHT = 'right',
}
declare type normalizeProps = {
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
export declare const normalizeTreeData: (
  data: any,
  normalizeProps: normalizeProps,
) => any;
interface TreeTransferProps {
  parentOnly?: boolean;
  lazySearchProps?: LzaySearchProps;
  hiddenDataSource?: any[];
  showSelectCount?: boolean;
  loadData: (key: string, next: () => void) => void;
}
declare type Props = Partial<TreeTransferProps & TransferProps<any>>;
declare const TreeTransfer: React.FC<Props>;
export default TreeTransfer;
