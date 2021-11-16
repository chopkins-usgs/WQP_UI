/**
 * Rollup configuration.
 * NOTE: This is a CommonJS module so it can be imported by Karma.
 */

const buble = require('@rollup/plugin-buble');
const commonjs = require('@rollup/plugin-commonjs');
const handlebars = require('rollup-plugin-handlebars-plus');
const json = require('@rollup/plugin-json');
const resolve = require('@rollup/plugin-node-resolve');
const replace = require('@rollup/plugin-replace');
const {terser} = require('rollup-plugin-terser');
const alias = require('@rollup/plugin-alias');
const vuePlugin = require('rollup-plugin-vue');

const ENV = process.env.NODE_ENV || 'development';

const getBundleConfig = function (src, dest) {
    return {
        input: src,
        plugins: [
            vuePlugin(),
            alias({
                entries: [{
                    find: 'vue',
                    replacement: require.resolve('vue/dist/vue.esm.js')
                }
            ]
            }),
            resolve.nodeResolve({
                browser: true
            }),
            json(),
            commonjs(),
            handlebars({
                handlebars: {
                    options: {
                        sourceMap: ENV !== 'production' ? 'inline' : false
                    }
                },
                templateExtension: '.hbs'
            }),
            buble({
                objectAssign: 'Object.assign',
                transforms: {
                    asyncAwait: false,
                    forOf: false,
                    generator: false,
                    templateString: false
                }
            }),
            replace({
                preventAssignment: true,
                'process.env.NODE_ENV': JSON.stringify(ENV)
            }),
            ENV === 'production' && terser({
                compress: {
                    drop_console: true
                }
            })
        ],
        output: {
            name: 'wqp_bundle',
            file: dest,
            format: 'iife',
            sourcemap: ENV !== 'production' ? 'inline' : false
        },
        treeshake: ENV === 'production'
    };
};

module.exports = [
    getBundleConfig('js/bundles/portal.js', 'dist/scripts/portal.js'),
    getBundleConfig('js/bundles/site_map.js', 'dist/scripts/site_map.js'),
    getBundleConfig('js/bundles/sites_map.js', 'dist/scripts/sites_map.js')
];
