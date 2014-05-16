
'use strict';

require.config({
    baseUrl: '../static/scripts',
    shim: {
        json2: {
            exports: 'JSON'
        }
    },
    paths: {
        jquery: 'vendor/jquery2.0.3',
        json2: 'vendor/json2',
        text: 'vendor/requirejs-text'
    }
});

require([
    'lib/pos',
    'lib/piece'
], function (Pos, BasePiece) {

    debugger;

});
