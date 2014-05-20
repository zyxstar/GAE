define (function (require, exports, module){
    var utils = require('lib/utils'),
        BasePiece = require('lib/piece'),
        Pos = require('lib/pos'),
        Board = require('lib/board');

    function Piece_ju(camp, pos) {
        Piece_ju.superclass.constructor.call(this, 'ju', camp, pos);
    }
    utils.extend(Piece_ju, BasePiece);
    Piece_ju.prototype.calcVectors = function () {//return relative vector array
        var ret = [],
            me = this;

        function check_collision(posx, posy, vec) {
            ret.push(vec);
            return !!me.board.getPiece(new Pos(posx,posy));
        }

        utils.takeWhile(utils.range(this.pos.y+1, Board.ROWS), //top
            function(item, idx, arr){
                return check_collision(this.pos.x, arr[idx], [0, idx+1]);
            }, this);

        utils.takeWhile(utils.range(this.pos.x+1, Board.COLS), //right
            function(item, idx, arr){
                return check_collision(arr[idx], this.pos.y, [idx+1, 0]);
            }, this);

        utils.takeWhile(utils.range(this.pos.y-1, -1, -1), //bottom
            function(item, idx, arr){
                return check_collision(this.pos.x, arr[idx], [0, 0-idx+1]);
            }, this);

        utils.takeWhile(utils.range(this.pos.x-1, -1, -1), //left
            function(item, idx, arr){
                return check_collision(arr[idx], this.pos.y, [0-idx+1, 0]);
            }, this);

        // var topArr = utils.range(this.pos.y, Board.ROWS);
        // for (i = 1, len = topArr.length; i < len; i++) {
        //     if (check_collision(this.pos.x, topArr[i], [0, i]))
        //         break;
        // }

        // var rightArr = utils.range(this.pos.x, Board.COLS);
        // for (i = 1, len = rightArr.length; i < len; i++) {
        //     if (check_collision(rightArr[i], this.pos.y, [i, 0]))
        //         break;
        // }

        // var bottomArr = utils.range(this.pos.y, -1, -1);
        // for (i = 1, len = bottomArr.length; i < len; i++) {
        //     if (check_collision(this.pos.x, downArr[i], [0, 0 - i]))
        //         break;
        // }

        // var leftArr = utils.range(this.pos.x, -1, -1);
        // for (i = 1, len = leftArr.length; i < len; i++) {
        //     if (check_collision(leftArr[i], this.pos.y, [0 - i, 0]))
        //         break;
        // }

        return ret;
    };
    Piece_ju.prototype.isRestrict = function () {
        return false;
    };
    return Piece_ju;
});
