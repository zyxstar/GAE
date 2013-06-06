function Piece_pao(camp, pos) {
    Piece_pao.superclass.constructor.call(this, 'pao', camp, pos);
}
extend(Piece_pao, BasePiece);
Piece_pao.prototype._calcRoute = function () {
    this.top = null;
    this.right = null;
    this.down = null;
    this.left = null;
    this.canMoveArray = [];
    var me = this;

    function help(pos, f) {
        var piece = this.board.getPiece(pos);
        if (piece) {
            f(piece);
            return true;
        }
        else
            this.canMoveArray.push(pos);
        return false;
    }

    for (var y = this.pos.y + 1; y < Board.ROWS; y++) {//top       
        if (help.call(this, new Pos(this.pos.x, y), function (piece) { me.top = piece; })) break;
    }

    for (var x = this.pos.x + 1; x < Board.COLS; x++) {//right
        if (help.call(this, new Pos(x, this.pos.y), function (piece) { me.right = piece; })) break;
    }

    for (var y = this.pos.y - 1; y >= 0; y--) {//down
        if (help.call(this, new Pos(this.pos.x, y), function (piece) { me.down = piece; })) break;
    }

    for (var x = this.pos.x - 1; x >= 0; x--) {//left
        if (help.call(this, new Pos(x, this.pos.y), function (piece) { me.left = piece; })) break;
    }

};

Piece_pao.prototype.canMove = function () {//return absolute pos array straight
    this._calcRoute();
    return this.canMoveArray;
};
Piece_pao.prototype.canKill = function () {
    var ret = [];
    this._calcRoute();

    function help(pos) {
        var piece = this.board.getPiece(pos);
        if (piece) {
            if (piece.camp != this.camp) ret.push(piece.pos);
            return true;
        }
        return false;
    }

    if (this.top) {
        for (var y = this.top.pos.y + 1; y < Board.ROWS; y++) {
            if (help.call(this, new Pos(this.pos.x, y))) break;
        }
    }
    if (this.right) {
        for (var x = this.right.pos.x + 1; x < Board.COLS; x++) {
            if (help.call(this, new Pos(x, this.pos.y))) break;
        }
    }
    if (this.down) {
        for (var y = this.down.pos.y - 1; y >= 0; y--) {
            if (help.call(this, new Pos(this.pos.x, y))) break;
        }
    }
    if (this.left) {
        for (var x = this.left.pos.x - 1; x >= 0; x--) {
            if (help.call(this, new Pos(x, this.pos.y))) break;
        }
    }
    return ret;
};