import strip from 'rollup-plugin-strip'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import minify from 'rollup-plugin-babel-minify'
import cleanup from 'rollup-plugin-cleanup'

export default {
  input: 'index.js',
  output: {
    file: 'bundle.js',
    format: 'cjs'
  },
  plugins: [
    strip(),
    resolve(),
    commonjs(),
    minify(),
    cleanup()
  ]
};
