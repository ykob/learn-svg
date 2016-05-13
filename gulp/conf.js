// 設定ファイル
// 対象パスやオプションを指定

const DIR = module.exports.DIR =  {
  PATH: '',
  SRC: 'src',
  DEST: 'dst',
  BUILD: 'build'
};

module.exports.serve = {
  notify: false,
  startPath: DIR.PATH,
  ghostMode: false,
  server: {
    baseDir: DIR.DEST,
    index: 'index.html',
    routes: {
      [DIR.PATH]: `${DIR.DEST}${DIR.PATH}/`
    }
  }
};

module.exports.scripts = {
  common: '',
  entryFiles: [
    `./${DIR.SRC}/js/main.js`,
  ],
  browserifyOpts: {
    transform: [
      ['babelify', {
        babelrc: false,
        presets: ['es2015']
      }],
      'envify'
    ]
  },
  dest: `${DIR.DEST}${DIR.PATH}/js`
};

module.exports.pug = {
  src: [
    `${DIR.SRC}/**/*.pug`,
    `!${DIR.SRC}/**/_**/*.pug`,
    `!${DIR.SRC}/**/_*.pug`
  ],
  dest: `${DIR.DEST}${DIR.PATH}`,
  opts: {
    pretty: true
  }
};

module.exports.sass = {
  src: [
    `${DIR.SRC}/**/*.{sass,scss}`,
    `!${DIR.SRC}/**/_**/*.{sass,scss}`,
    `!${DIR.SRC}/**/_*.{sass,scss}`
  ],
  dest: `${DIR.DEST}${DIR.PATH}/css`,
  browsers: [
    'last 2 versions',
    'ie >= 9',
    'Android >= 4',
    'ios_saf >= 8',
  ]
};

module.exports.copy_vendor_script = {
  src: [
    `${DIR.SRC}/js/vendor/*.js`,
  ],
  dest: `${DIR.DEST}${DIR.PATH}/js/vendor/`
};
