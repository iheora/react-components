/**
 * @file 搜索框
 * @module components/ProTreeTransfer
 */

import React from 'react';
import { Input } from 'antd';
import type { SearchProps } from 'antd/lib/input';
import './index.less';

interface Props {
  cacheMax: number;
  showSearch: boolean;
}

export const CACHE_MAX_LENGTH = 200;

export type LzaySearchProps = Partial<Props & SearchProps>;

const Search: React.FC<LzaySearchProps> = (props) => {
  const { showSearch, placeholder, ...restProps } = props;

  return (
    <Input.Search
      {...restProps}
      placeholder={placeholder || '请输入搜索内容'}
      className="transfer-search"
    />
  );
};

export default Search;
