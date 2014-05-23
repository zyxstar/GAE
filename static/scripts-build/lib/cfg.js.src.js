define (['require','exports','module','lib/piece_leader','lib/piece_shi','lib/piece_xiang','lib/piece_ma','lib/piece_ju','lib/piece_pao','lib/piece_bing'],function (require, exports, module){

    var Piece_leader = require('lib/piece_leader'),
        Piece_shi = require('lib/piece_shi'),
        Piece_xiang = require('lib/piece_xiang'),
        Piece_ma = require('lib/piece_ma'),
        Piece_ju = require('lib/piece_ju'),
        Piece_pao = require('lib/piece_pao'),
        Piece_bing = require('lib/piece_bing');

    Cfg = {};
    Cfg.pieceName = {
        leader: { red: '帅', black: '将', cls: function () { return Piece_leader; } }, //直接用类作为cls属性,则必须要求类要先于cfg加载
        shi: { red: '士', black: '士', cls: function () { return Piece_shi; } },
        xiang: { red: '相', black: '象', cls: function () { return Piece_xiang; } },
        ma: { red: '马', black: '马', cls: function () { return Piece_ma; } },
        ju: { red: '車', black: '車', cls: function () { return Piece_ju; } },
        pao: { red: '炮', black: '炮', cls: function () { return Piece_pao; } },
        bing: { red: '兵', black: '卒', cls: function () { return Piece_bing; } }
    };
    Cfg.campLocation = {
        red: function () {
            return [
                [[4, 0], 'leader'],
                [[3, 0], 'shi'],[[5, 0], 'shi'],
                [[2, 0], 'xiang'],[[6, 0], 'xiang'],
                [[1, 0], 'ma'],[[7, 0], 'ma'],
                [[0, 0], 'ju'],[[8, 0], 'ju'],
                [[1, 2], 'pao'],[[7, 2], 'pao'],
                [[0, 3], 'bing'],[[2, 3], 'bing'],[[4, 3], 'bing'],[[6, 3], 'bing'],[[8, 3], 'bing']
            ];
        },
        black: function () {
            return [
                [[4, 9], 'leader'],
                [[3, 9], 'shi'],[[5, 9], 'shi'],
                [[2, 9], 'xiang'],[[6, 9], 'xiang'],
                [[1, 9], 'ma'],[[7, 9], 'ma'],
                [[0, 9], 'ju'],[[8, 9], 'ju'],
                [[1, 7], 'pao'],[[7, 7], 'pao'],
                [[0, 6], 'bing'],[[2, 6], 'bing'],[[4, 6], 'bing'],[[6, 6], 'bing'],[[8, 6], 'bing']
            ];
        }
    };

    Cfg.showName = function (piece) {
        return Cfg.pieceName[piece.name][piece.camp];
    };

    return Cfg;
});
