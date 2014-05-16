define (function (require, exports, module){
    var utils = require('lib/utils'),
        BasePiece = require('lib/piece'),
        Board = require('lib/board'),
        Pos = require('lib/pos');

    function Piece_pao(camp, pos) {
        Piece_pao.superclass.constructor.call(this, 'pao', camp, pos);
    }
    utils.extend(Piece_pao, BasePiece);
    Piece_pao.prototype._calcRoute = function () {
        var x,
            y,
            me = this;

        this.scope = { top: null, right: null, bottom: null, left: null};
        this.canMoveArr = [];

        function check_collision(posx, posy, orientation) {
            var pos = new Pos(posx, posy);
            var piece = me.board.getPiece(pos);
            if (piece) me.scope[orientation] = piece;
            else me.canMoveArr.push(pos);
            return !!piece;
        }

        for (y = this.pos.y + 1; y < Board.ROWS; y++) {
            if (check_collision(this.pos.x, y, 'top')) break;
        }

        for (x = this.pos.x + 1; x < Board.COLS; x++) {
            if (check_collision(x, this.pos.y, 'right')) break;
        }

        for (y = this.pos.y - 1; y >= 0; y--) {
            if (check_collision(this.pos.x, y, 'bottom')) break;
        }

        for (x = this.pos.x - 1; x >= 0; x--) {
            if (check_collision(x, this.pos.y, 'left')) break;
        }

    };

    Piece_pao.prototype.canMove = function () {//return absolute pos array straight
        this._calcRoute();
        return this.canMoveArr;
    };
    Piece_pao.prototype.canKill = function () {
        var x,
            y,
            ret = [],
            me = this;
        this._calcRoute();

        function check_collision(posx, posy) {
            var piece = me.board.getPiece(new Pos(posx, posy));
            if (piece && piece.camp !== me.camp)
                ret.push(piece.pos);
            return !!piece;
        }

        if (this.scope.top) {
            for (y = this.scope.top.pos.y + 1; y < Board.ROWS; y++) {
                if (check_collision(this.pos.x, y)) break;
            }
        }
        if (this.scope.right) {
            for (x = this.scope.right.pos.x + 1; x < Board.COLS; x++) {
                if (check_collision(x, this.pos.y)) break;
            }
        }
        if (this.scope.bottom) {
            for (y = this.scope.bottom.pos.y - 1; y >= 0; y--) {
                if (check_collision(this.pos.x, y)) break;
            }
        }
        if (this.scope.left) {
            for (x = this.scope.left.pos.x - 1; x >= 0; x--) {
                if (check_collision(x, this.pos.y)) break;
            }
        }
        return ret;
    };

    return Piece_pao;

});
