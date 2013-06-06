function Piece_ju(camp, pos) {
    Piece_ju.superclass.constructor.call(this, 'ju', camp, pos);
}
extend(Piece_ju, BasePiece);
Piece_ju.prototype.calcVectors = function () {//return relative vector array
    var ret = [];

    function help(pos, f) {
        var piece = this.board.getPiece(pos);
        if (piece) {
            f();
            return true;
        }
        else
            f();
        return false;
    }

    var topArr = Array.range(this.pos.y, Board.ROWS)
    for (var i = 1; i < topArr.length; i++) {
        if (help.call(this, new Pos(this.pos.x, topArr[i]),
            function () {
                ret.push([0, i]);
            })) break;
    }

    var rightArr = Array.range(this.pos.x, Board.COLS)
    for (var i = 1; i < rightArr.length; i++) {
        if (help.call(this, new Pos(rightArr[i], this.pos.y),
            function () {
                ret.push([i, 0]);
            })) break;
    }

    var downArr = Array.range(this.pos.y, -1, -1)
    for (var i = 1; i < downArr.length; i++) {
        if (help.call(this, new Pos(this.pos.x, downArr[i]),
            function () {
                ret.push([0, 0 - i]);
            })) break;
    }

    var leftArr = Array.range(this.pos.x, -1, -1)
    for (var i = 1; i < leftArr.length; i++) {
        if (help.call(this, new Pos(leftArr[i], this.pos.y),
            function () {
                ret.push([0 - i, 0]);
            })) break;
    }

    return ret;
};
Piece_ju.prototype.isRestrict = function () {
    return false;
};