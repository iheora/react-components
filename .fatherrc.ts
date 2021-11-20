export default {
  esm: 'babel',
  cjs: 'babel',
  umd: {
    sourcemap: true,
    globals: {
      react: 'React',
      antd: 'antd',
    },
  },
  extractCSS: true,
  lessInBabelMode: true,
};
