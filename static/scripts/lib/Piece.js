
function BasePiece(name, camp, pos) {
    this.name = name;
    this.board = null;
    this.camp = camp;
    this.pos = pos;
};
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
        return (Array.find(arr, function (item, index) {
            return me.equals(item);
        }) != null);
    },
    isCur: function () {
        return this.board.curCamp == this.camp;
    },
    showName: function () {
        return Cfg.pieceName[this.name][this.camp];
    },
    canMove: function () {
        var posArr = []
        var vectors = this.calcVectors();
        for (var i = 0; i < vectors.length; i++) {
            var newPos = this._calcPos(vectors[i]);
            if (!this.board._isOverBoard(newPos) &&
                !this.isRestrict(newPos, vectors[i]) &&
                this.board._belong(newPos) != this.camp) {
                posArr.push(newPos);
            }
        }
        return posArr;
    },
    canKill: function () {//not apply to Piece_pao
        var arr = this.canMove();
        var posArr = [];
        for (var i = 0; i < arr.length; i++) {
            if (this._isEnemy(arr[i]))
                posArr.push(arr[i]);
        }
        return posArr;
    },
    canBeKilled: function () {
        var enemyPieceArr = this.board._getPieceArr(this._getEnemy());
        for (var i = 0; i < enemyPieceArr.length; i++)
            if (this.pos.isInArray(enemyPieceArr[i].canKill())) return true;
        return false;
    },
    moveTo: function (newPos) {
        if (this.pos.equals(newPos)) return false;
        if (!newPos.isInArray(this.canMove())
            && !newPos.isInArray(this.canKill()))
            return false;
        return (this.board.execute(this.pos, newPos));
    },
    calcVectors: function () { throw Error('must be overried'); },
    isRestrict: function (newPos, vector) { throw Error('must be overried'); }
};

