define (['require','exports','module','lib/utils','lib/piece'],function (require, exports, module){
    var utils = require('lib/utils'),
        BasePiece = require('lib/piece');

    function Piece_xiang(camp, pos) {
        Piece_xiang.superclass.constructor.call(this, 'xiang', camp, pos);
    }
    utils.extend(Piece_xiang, BasePiece);
    Piece_xiang.prototype._calcLeg = function (vector) {
        return [vector[0] / 2, vector[1] / 2];
    };
    Piece_xiang.prototype.calcVectors = function () {
        return [[2, 2], [2, -2], [-2, -2], [-2, 2]];
    };
    Piece_xiang.prototype.isRestrict = function (newPos, vector) {
        if (this.camp == 'red' && newPos.y > 4) return true;
        if (this.camp == 'black' && newPos.y < 5) return true;
        var pos = this._calcPos(this._calcLeg(vector));
        if (this.board.getPiece(pos)) return true;
        return false;
    };

    return Piece_xiang;
});
