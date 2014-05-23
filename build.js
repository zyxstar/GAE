// node r.js -o build.js

// 将目录下所有js文件依次mini + map
({
    appDir: 'static/scripts',
    baseUrl: 'static/scripts',
    dir: 'static/scripts-build',
    fileExclusionRegExp: /^(vendor*)|(test*)/,
    optimize: 'uglify2',
    preserveLicenseComments: false,
    generateSourceMaps: true
})

// 将指定的requirejs主文件进行mini + map
// ({
//     baseUrl: 'static/scripts',
//     name: 'ui/chess',
//     out: 'chess-build.js',
//     paths: {
//         jquery: 'vendor/jquery2.0.3',
//         json2: 'vendor/json2',
//         text: 'vendor/requirejs-text'
//     },
//     shim: {
//         json2: {
//             exports: 'JSON'
//         }
//     },
//     optimize: 'uglify2',
//     preserveLicenseComments: false,
//     generateSourceMaps: true
// })




