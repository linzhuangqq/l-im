const {executeRollup, fse} = require('rollup-standalone')
const fs = require('fs-extra')

let opts = {
  format: 'iife',
  sourceMap: true,
  uglifyOptions: false,
  babelOptions: {
    exclude: 'node_modules/**',
    'presets': ['es2017'],
    'plugins': [
      ['transform-object-rest-spread', { 'useBuiltIns': true }]
    ]
  },
  external: [
    'vue'
  ],
  vueOptions: {
    include: [
      '.src/**/*.vue',
      '**/*.vue'
    ]
  },
  moduleName: 'app'
}

executeRollup(Object.assign({
  entry: 'src/apps/index.js',
  dest: 'dist/js/index.js'
}, opts))

fs.ensureDir('dist/js').then(() => {
  return Promise.all([
    fse.copy('src/assets/emotion', 'dist/js/emotion'),
    fse.copy(require.resolve('vue/dist/vue.js'), 'dist/js/vue.js'),
    fse.copy('src/assets/element.js', 'dist/js/element.js'),
    fse.copy('src/assets/element.css', 'dist/css/element.css'),
    fse.copy('src/htmls/index.html', 'dist/index.html')
  ])
})

const sass = require('node-sass')
const path = require('path')
const {mkdirAsync, writeFileAsync} = require('./fs-util')

let distCssDir = path.resolve(__dirname, '../dist/css/')

let includePaths = [
  path.resolve(__dirname, '../src/css')
]

let outputStyle = 'expanded'

mkdirAsync(distCssDir).then(() => {
  sassRenderAsync({
    outputStyle,
    sourceMap: true,
    file: path.resolve(__dirname, '../src/css/index.sass'),
    outFile: path.resolve(distCssDir, 'index.css'),
    includePaths
  })
})

function sassRenderAsync (opts) {
  return new Promise((resolve, reject) => {
    sass.render(opts, (err, result) => {
      if (err) {
        return reject(err)
      }
      let {outFile, sourceMap} = opts
      let ret = [writeFileAsync(outFile, result.css)]
      if (sourceMap) {
        ret.push(writeFileAsync(outFile + '.map', result.map))
      }
      Promise.all(ret).then(resolve, reject)
    })
  })
}
