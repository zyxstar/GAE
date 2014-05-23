define (['require','exports','module','lib/utils','lib/piece'],function (require, exports, module){
    var utils = require('lib/utils'),
        BasePiece = require('lib/piece');

    function Piece_ma(camp, pos) {
        Piece_ma.superclass.constructor.call(this, 'ma', camp, pos);
    }
    utils.extend(Piece_ma, BasePiece);
    Piece_ma.prototype._calcLeg = function (vector) {
        var x = Math.abs(vector[0]),
            y = Math.abs(vector[1]);
        if (x > y)
            return (vector[0] > 0) ? [1, 0] : [-1, 0];
        return (vector[1] > 0) ? [0, 1] : [0, -1];
    };
    Piece_ma.prototype.calcVectors = function () {
        return [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]];
    };
    Piece_ma.prototype.isRestrict = function (newPos, vector) {//newPos not be used
        var pos = this._calcPos(this._calcLeg(vector));
        return !!this.board.getPiece(pos);
    };

    return Piece_ma;
});

