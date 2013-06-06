function Piece_leader(camp, pos) {
    Piece_leader.superclass.constructor.call(this, 'leader', camp, pos);
}
extend(Piece_leader, BasePiece);
Piece_leader.prototype.calcVectors = function () {
    return [[0, 1], [1, 0], [0, -1], [-1, 0]];
};
Piece_leader.prototype.isRestrict = function (newPos, vector) {
    if (this.camp == 'red' && (newPos.x < 3 || newPos.x > 5 || newPos.y > 3))
        return true;
    if (this.camp == 'black' && (newPos.x < 3 || newPos.x > 5 || newPos.y < 7))
        return true;
    return false;
};