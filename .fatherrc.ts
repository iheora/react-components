export default {
  esm: 'babel',
  cjs: 'babel',
  umd: {
    name: 'yueluotd',
    sourcemap: true,
    globals: {
      react: 'React',
      antd: 'antd',
    },
  },
  extractCSS: true,
  lessInBabelMode: true,
};
