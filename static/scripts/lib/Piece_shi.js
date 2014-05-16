define (function (require, exports, module){
    var utils = require('lib/utils'),
        BasePiece = require('lib/piece');

    function Piece_shi(camp, pos) {
        Piece_shi.superclass.constructor.call(this, 'shi', camp, pos);
    }
    utils.extend(Piece_shi, BasePiece);
    Piece_shi.prototype.calcVectors = function () {
        return [[1, 1], [1, -1], [-1, -1], [-1, 1]];
    };
    Piece_shi.prototype.isRestrict = function (newPos, vector) {
        if (this.camp == 'red' && (newPos.x < 3 || newPos.x > 5 || newPos.y > 3))
            return true;
        if (this.camp == 'black' && (newPos.x < 3 || newPos.x > 5 || newPos.y < 7))
            return true;
        return false;
    };

    return Piece_shi;
});
