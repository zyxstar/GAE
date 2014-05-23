define (['require','exports','module','lib/utils','lib/piece'],function (require, exports, module){
    var utils = require('lib/utils'),
        BasePiece = require('lib/piece');

    function Piece_bing(camp, pos) {
        Piece_bing.superclass.constructor.call(this, 'bing', camp, pos);
    }
    utils.extend(Piece_bing, BasePiece);
    Piece_bing.prototype.calcVectors = function () {
        if (this.camp == 'red')
            return [[0, 1], [1, 0], [-1, 0]];
        else
            return [[0, -1], [1, 0], [-1, 0]];
    };
    Piece_bing.prototype.isRestrict = function (newPos, vector) {
        if (this.camp == 'red' && (this.pos.y <= 4 && newPos.x != this.pos.x))
            return true;
        if (this.camp == 'black' && (this.pos.y >= 5 && newPos.x != this.pos.x))
            return true;
        return false;
    };

    return Piece_bing;
});
