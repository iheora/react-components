/**
 * @file 搜索框
 * @module components/ProTreeTransfer
 */
import React from 'react';
import type { SearchProps } from 'antd/lib/input';
import './index.less';
interface Props {
  cacheMax: number;
  showSearch: boolean;
}
export declare const CACHE_MAX_LENGTH = 200;
export declare type LzaySearchProps = Partial<Props & SearchProps>;
declare const Search: React.FC<LzaySearchProps>;
export default Search;
