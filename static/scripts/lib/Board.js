define (function (require, exports, module){
    var Pos = require('lib/pos');

    function Board(subscriber) {
        this._pos_piece = {};
        this._commandHistory = [];

        this.subscriber = subscriber || {
            drawPiece: function (piece) { },
            clearPos: function (pos) { },
            notifyIsFaced: function () { },
            notifyWinner: function (camp) { },
            notifyNoHistory: function () { },
            notifyHasHistory: function () { },
            notifyCurCamp: function (camp) { },
            notifyExecute: function (info) { }
        }; //default

        this.curCamp = 'red';
        this.subscriber.notifyCurCamp(this.curCamp);

        this.redLeader = null;
        this.blackLeader = null;
    }
    Board.COLS = 9;
    Board.ROWS = 10;
    Board.prototype = {
        _isOverBoard: function (pos) {
            return (pos.x < 0 || pos.x >= Board.COLS || pos.y < 0 || pos.y >= Board.ROWS);
        },
        _belong: function (pos) {
            if (!this.getPiece(pos)) return 'none';
            return this.getPiece(pos).camp;
        },
        _changeCamp: function () {
            if (this.curCamp == 'red') this.curCamp = 'black';
            else this.curCamp = 'red';
            this.subscriber.notifyCurCamp(this.curCamp);
        },
        _getPieceArr: function (camp) {
            var ret = [],
                piece;
            for (piece in this._pos_piece) {
                if (!this._pos_piece.hasOwnProperty(piece)) continue;
                if (this._pos_piece[piece] && this._pos_piece[piece].camp == camp) ret.push(this._pos_piece[piece]);
            }
            return ret;
        },
        _isNotFaced: function () {
            if (this.redLeader.pos.x != this.blackLeader.pos.x) return true;
            var x = this.redLeader.pos.x,
                y,
                y_low = this.redLeader.pos.y,
                y_high = this.blackLeader.pos.y;
            for (y = y_low + 1; y < y_high; y++)
                if (this._belong(new Pos(x, y)) != 'none') return true;
            return false;
        },
        _isWinner: function () {//be called after execute()
            if (this.curCamp == 'red' && this.blackLeader.canBeKilled())
                return true;
            if (this.curCamp == 'black' && this.redLeader.canBeKilled())
                return true;
            return false;
        },
        _move: function (posA, posB) {
            this.setPiece(posB, this.getPiece(posA));
            this.setPiece(posA, null);
        },
        addPiece: function (piece) {
            var pos = piece.pos;
            if (this.getPiece(pos)) throw new Error('already exist ' + pos.toString());
            if (piece.name == 'leader') {
                if (piece.camp == 'red') this.redLeader = piece;
                else this.blackLeader = piece;
            }
            this.setPiece(pos, piece);
            piece.board = this;
        },
        setPiece: function (pos, piece) {
            if (piece) piece.pos = pos;
            this._pos_piece[pos.toString()] = piece;

            if (piece)
                this.subscriber.drawPiece(piece);
            else
                this.subscriber.clearPos(pos);
        },
        getPiece: function (pos) {
            return this._pos_piece[pos.toString()];
        },
        execute: function (posA, posB) {
            var info = {
                camp: this.curCamp,
                posA: posA,
                posB: posB,
                Death: this.getPiece(posB)
            };
            this._commandHistory.push(info);
            if (this._commandHistory.length == 1)
                this.subscriber.notifyHasHistory();
            this._move(posA, posB);
            this._changeCamp();
            if (!this._isNotFaced()) {
                this.subscriber.notifyIsFaced();
                this.undo();
                return false;
            }
            this.subscriber.notifyExecute(info);
            if (this._isWinner()) {
                this.subscriber.notifyWinner(this.curCamp);
            }
            return true;
        },
        undo: function () {
            if (this._commandHistory.length === 0) return;
            var info = this._commandHistory.pop();
            this._move(info.posB, info.posA);
            if (info.Death)
                this.setPiece(info.posB, info.Death);
            this.curCamp = info.camp;
            this.subscriber.notifyCurCamp(this.curCamp);
            if (this._commandHistory.length === 0)
                this.subscriber.notifyNoHistory();
        },


        newGame: function () { },
        loadGame: function () { },
        saveGame: function () { }

    };

    return Board;
});
