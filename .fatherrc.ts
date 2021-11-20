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
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
  ],
  extractCSS: true,
  lessInBabelMode: true,
  runtimeHelpers: true,
};
