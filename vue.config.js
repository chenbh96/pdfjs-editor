const output = {
  globalObject: "this",
};

const publicPath = process.env.WEBPACK_PUBLIC_PATH || '/';

module.exports = {
  publicPath,
  configureWebpack: {
    devServer: {
      port: process.env.BASE_PORT,
      watchOptions: {
        poll: true,
      },
    },
    output,
  },
  chainWebpack: config => {
    config.module
      .rule('svg')
      .use('file-loader')
        .loader('vue-svg-loader')
  },
};
