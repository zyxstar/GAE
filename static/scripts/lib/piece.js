define (function (require, exports, module){
    var Pos = require('lib/pos');

    function BasePiece(name, camp, pos) {
        this.name = name;
        this.board = null;
        this.camp = camp;
        this.pos = pos;
    }

    BasePiece.prototype = {
        _calcPos: function (vector) {
            return new Pos(this.pos.x + vector[0], this.pos.y + vector[1]);
        },
        _isEnemy: function (pos) {
            var camp = this.board._belong(pos);
            return (camp != 'none' && camp != this.camp);
        },
        _getEnemy: function () {
            if (this.camp == 'red') return 'black';
            else return 'red';
        },
        equals: function (piece) {
            if (this == piece) return true;
            else return (this.name == piece.name &&
                        this.camp == piece.camp &&
                        this.board == piece.board &&
                        this.pos.equals(piece.pos));
        },
        isInArray: function (arr) {
            var me = this;
            return (arr.filter(function (item, index) {
                return me.equals(item);
            }).length > 0);
        },
        isCur: function () {
            return this.board.curCamp == this.camp;
        },
        canMove: function () {
            var posArr = [],
                vectors = this.calcVectors(),
                newPos;
            for (var i = 0, len = vectors.length; i < len; i++) {
                newPos = this._calcPos(vectors[i]);
                if (!this.board._isOverBoard(newPos) &&
                    !this.isRestrict(newPos, vectors[i]) &&
                    this.board._belong(newPos) != this.camp) {
                    posArr.push(newPos);
                }
            }
            return posArr;
        },
        canKill: function () {//not apply to Piece_pao
            var arr = this.canMove(),
                posArr = [];
            for (var i = 0, len = arr.length; i < len; i++) {
                if (this._isEnemy(arr[i]))
                    posArr.push(arr[i]);
            }
            return posArr;
        },
        canBeKilled: function () {
            var enemyPieceArr = this.board._getPieceArr(this._getEnemy());
            for (var i = 0, len = enemyPieceArr.length; i < len; i++)
                if (this.pos.isInArray(enemyPieceArr[i].canKill())) return true;
            return false;
        },
        moveTo: function (newPos) {
            if (this.pos.equals(newPos)) return false;
            if (!newPos.isInArray(this.canMove()) &&
                !newPos.isInArray(this.canKill()))
                return false;
            return (this.board.execute(this.pos, newPos));
        },
        calcVectors: function () { throw new Error('must be overried'); },
        isRestrict: function (newPos, vector) { throw new Error('must be overried'); }
    };

    return BasePiece;
});
