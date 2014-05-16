function Panel($boardContainer) {
    var PIECE_DISTANCE = 50;

    var pos_div = {};
    var curPiece = null;
    var curCanMove = null;
    var curCanKill = null;
    var isHint = true;

    this.board = null;
    this.myCamp = null;
    var me = this;

    this.init = function () {
        for (x = 0; x < Board.COLS; x++) {
            for (y = 0; y < Board.ROWS; y++)
                _setDiv(x, y, _buildDiv(x, y));
        }
        _addPieces('red');
        _addPieces('black');
    };

    function _buildDiv(x, y) {
        var $div = $(document.createElement('DIV'));
        if (me.myCamp == "red")
            $div.css({ left: x * PIECE_DISTANCE, top: (Board.ROWS - 1 - y) * PIECE_DISTANCE });
        else
            $div.css({ left: (Board.COLS - 1 - x) * PIECE_DISTANCE, top: y * PIECE_DISTANCE });
        $div[0].id = x.toString() + y.toString();
        $div.appendTo($boardContainer);
        $div.bind('click', _divClick);
        return $div;
    }

    function _getDiv(x, y) {
        return pos_div[x.toString() + y.toString()];
    }

    function _setDiv(x, y, $div) {
        pos_div[x.toString() + y.toString()] = $div;
    }

    function _addPieces(camp) {
        var locs = Cfg.campLocation[camp]();
        for (var i = 0; i < locs.length; i++) {
            var piece = new (Cfg.pieceName[locs[i][1]].cls())(camp, Pos.parse(locs[i][0]));
            me.board.addPiece(piece);
        }
    }

    function _divClick() {
        if (!me.isMePlay()) return;
        var clickPiece = me.board.getPiece(Pos.parse(this.id));
        if (!curPiece) { //first click
            if (!clickPiece) return; //no piece be selected
            else {
                if (clickPiece.camp != me.board.curCamp) return; //not cur camp
                curPiece = clickPiece;
                curCanMove = clickPiece.canMove();
                curCanKill = clickPiece.canKill();
                $(this).addClass('selected');
                if (isHint) _showRoute(curCanMove, 'canmove');
                if (isHint) _showRoute(curCanKill, 'cankill');
                return;
            }
        }
        else {//second click
            if (!curPiece.moveTo(Pos.parse(this.id))) //try moving,if can not
                me.drawPiece(curPiece); //reset self
            curPiece = null;
            me.resetCurrent();
            return;
        }
    }

    function _showRoute(posArr, state) {
        for (var i = 0; i < posArr.length; i++) {
            var $div = _getDiv(posArr[i].x, posArr[i].y);
            $div.addClass(state);
        }
    }

    function _removeRoute(posArr, state) {
        for (var i = 0; i < posArr.length; i++) {
            var $div = _getDiv(posArr[i].x, posArr[i].y);
            $div.removeClass(state);
        }
    }

    this.isMePlay = function () {
        throw Error("must rewrite this method");
    };

    this.setHint = function (flag) {
        if (isHint != flag) {
            if (isHint) {
                if (curCanMove) _removeRoute(curCanMove, 'canmove');
                if (curCanKill) _removeRoute(curCanKill, 'cankill');
            }
            else {
                if (curCanMove) _showRoute(curCanMove, 'canmove');
                if (curCanKill) _showRoute(curCanKill, 'cankill');
            }
            isHint = flag;
        }
    };

    this.resetCurrent = function () {
        if (curPiece) me.drawPiece(curPiece);
        if (curCanMove) _removeRoute(curCanMove, 'canmove');
        if (curCanKill) _removeRoute(curCanKill, 'cankill');
        curPiece = null;
        curCanMove = null;
        curCanKill = null;
    };

    this.drawPiece = function (piece) {
        var $div = _getDiv(piece.pos.x, piece.pos.y);
        $div.text(Cfg.showName(piece));
        $div[0].className = 'noraml';
        $div.css({ color: piece.camp });
    };

    this.clearPos = function (pos) {
        var $div = _getDiv(pos.x, pos.y);
        $div.text('');
        $div[0].className = '';
    };

    this.moveAnimate = function (posA, posB) {//only view, not affect logic
        var $divA = $('#' + posA.toString());
        var $divB = $('#' + posB.toString());
        var $divPiece = $divB.clone(); //piece already in posB
        $divPiece.appendTo($boardContainer);
        $divPiece.css({ left: $divA.css('left'), top: $divA.css('top') });
        $divB.hide();

        var piece=me.board.getPiece(posB);
        if (piece.name == 'ma') {
            var leg = piece._calcLeg([posB.x - posA.x, posB.y - posA.y]);
            var $divLeg = $('#' + new Pos(posA.x+leg[0],posA.y+leg[1]).toString());
            $divPiece.animate({ left: $divLeg.css('left'), top: $divLeg.css('top') }, 100)
                .animate({ left: $divB.css('left'), top: $divB.css('top') }, 100, end);
        }
        else {
            $divPiece.animate({ left: $divB.css('left'), top: $divB.css('top') }, 200, end);
        }

        function end(){
            $divB.show();
            $divPiece.remove();
        }
    };
}
