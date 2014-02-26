function Piece_ma(camp, pos) {
    Piece_ma.superclass.constructor.call(this, 'ma', camp, pos);
}
extend(Piece_ma, BasePiece);
Piece_ma.prototype._calcLeg = function (vector) {
    var x = Math.abs(vector[0]);
    var y = Math.abs(vector[1]);
    if (x > y) {
        if (vector[0] > 0) return [1, 0];
        else return [-1, 0];
    }
    else {
        if (vector[1] > 0) return [0, 1];
        else return [0, -1];
    }
};
Piece_ma.prototype.calcVectors = function () {
    return [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]];
};
Piece_ma.prototype.isRestrict = function (newPos, vector) {//newPos not be used
    var pos = this._calcPos(this._calcLeg(vector));
    if (this.board.getPiece(pos)) return true;
    return false;
};

