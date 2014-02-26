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
        var ret = [];
        ret.push([[4, 0], 'leader']);
        ret.push([[3, 0], 'shi']); ret.push([[5, 0], 'shi']);
        ret.push([[2, 0], 'xiang']); ret.push([[6, 0], 'xiang']);
        ret.push([[1, 0], 'ma']); ret.push([[7, 0], 'ma']);
        ret.push([[0, 0], 'ju']); ret.push([[8, 0], 'ju']);
        ret.push([[1, 2], 'pao']); ret.push([[7, 2], 'pao']);
        ret.push([[0, 3], 'bing']); ret.push([[2, 3], 'bing']); ret.push([[4, 3], 'bing']); ret.push([[6, 3], 'bing']); ret.push([[8, 3], 'bing']);
        return ret;
    },
    black: function () {
        var ret = [];
        ret.push([[4, 9], 'leader']);
        ret.push([[3, 9], 'shi']); ret.push([[5, 9], 'shi']);
        ret.push([[2, 9], 'xiang']); ret.push([[6, 9], 'xiang']);
        ret.push([[1, 9], 'ma']); ret.push([[7, 9], 'ma']);
        ret.push([[0, 9], 'ju']); ret.push([[8, 9], 'ju']);
        ret.push([[1, 7], 'pao']); ret.push([[7, 7], 'pao']);
        ret.push([[0, 6], 'bing']); ret.push([[2, 6], 'bing']); ret.push([[4, 6], 'bing']); ret.push([[6, 6], 'bing']); ret.push([[8, 6], 'bing']);
        return ret;
    }

};