define(function(require) {
    var Pos = require('lib/pos'),
        BasePiece = require('lib/piece'),
        Board = require('lib/board');

    module("Board");
    test("_isOverBoard", function () {
        var data = [];
        data.push([[0, 0], false]);
        data.push([[8, 9], false]);
        data.push([[-1, 0], true]);
        data.push([[0, -1], true]);
        data.push([[9, 9], true]);
        data.push([[8, 10], true]);
        for (var i = 0; i < data.length; i++)
            equal(new Board()._isOverBoard(new Pos(data[i][0][0], data[i][0][1])), data[i][1]);
    });

    test("_belong", function () {
        var b = new Board();
        var p1 = new BasePiece(null, 'black', new Pos(5, 5));
        var p2 = new BasePiece(null, 'red', new Pos(6, 6));
        b.addPiece(p1);
        b.addPiece(p2);
        equal(b._belong(new Pos(5, 5)), 'black');
        equal(b._belong(new Pos(6, 6)), 'red');
        equal(b._belong(new Pos(0, 0)), 'none');
    });

    test("_changeCamp", function () {
        var b = new Board();
        equal(b.curCamp, 'red');
        b._changeCamp();
        equal(b.curCamp, 'black');
        b._changeCamp();
        equal(b.curCamp, 'red');
    });

    test("_getPieceArr", function () {
        var b = new Board();
        var data = [];
        data.push(['b1', 'black', [0, 0]]);
        data.push(['b2', 'black', [0, 1]]);
        data.push(['b3', 'black', [0, 2]]);
        data.push(['b4', 'black', [0, 3]]);
        data.push(['b5', 'black', [0, 4]]);
        for (var i = 0; i < data.length; i++) {
            b.addPiece(new BasePiece(data[i][0], data[i][1], Pos.parse(data[i][2])));
        }
        var blackArr = b._getPieceArr('black');
        equal(blackArr.length, 5);
        for (var i = 0; i < data.length; i++) {
            var p = new BasePiece(data[i][0], data[i][1], Pos.parse(data[i][2]));
            p.board = b;
            ok(p.isInArray(blackArr));
        }

        var data2 = [];
        data2.push(['r1', 'red', [1, 0]]);
        data2.push(['r2', 'red', [2, 0]]);
        data2.push(['r3', 'red', [3, 0]]);
        data2.push(['r4', 'red', [4, 0]]);
        data2.push(['r5', 'red', [5, 0]]);
        for (var i = 0; i < data2.length; i++) {
            b.addPiece(new BasePiece(data2[i][0], data2[i][1], Pos.parse(data2[i][2])));
        }

        blackArr = b._getPieceArr('black');
        equal(blackArr.length, 5);
        for (var i = 0; i < data.length; i++) {
            var p = new BasePiece(data[i][0], data[i][1], Pos.parse(data[i][2]));
            p.board = b;
            ok(p.isInArray(blackArr));
        }

        var redArr = b._getPieceArr('red');
        equal(redArr.length, 5);
        for (var i = 0; i < data2.length; i++) {
            var p = new BasePiece(data2[i][0], data2[i][1], Pos.parse(data2[i][2]));
            p.board = b;
            ok(p.isInArray(redArr));
        }

        b._pos_piece['40'] = null;
        redArr = b._getPieceArr('red');
        equal(redArr.length, 4);
        b._pos_piece['40'] = { camp: 'black' };
        blackArr = b._getPieceArr('black');
        equal(blackArr.length, 6);

    });

    test("_isNotFaced", function () {
        var b = new Board();
        b.redLeader = { pos: { x: 5, y: 2} };
        b.blackLeader = { pos: { x: 4, y: 8} };
        ok(b._isNotFaced());
        b.blackLeader = { pos: { x: 5, y: 8} };
        var posArr = [];
        b._belong = function (pos) {
            posArr.push(pos);
            return 'none';
        };
        ok(!b._isNotFaced());
        equal(posArr.length, b.blackLeader.pos.y - b.redLeader.pos.y - 1);
        b._belong = function () {
            return 'red';
        };
        ok(b._isNotFaced());
    });

    test("_isWinner", function () {

    });

    test("_move", function () {
        var b = new Board();
        var pos1 = new Pos(5, 5);
        var pos2 = new Pos(6, 6);
        b.addPiece(new BasePiece('b1', 'black', pos1));
        b.addPiece(new BasePiece('r1', 'red', pos2));
        b._move(pos1, pos2);
        equal(b.getPiece(pos2).name, 'b1');
        equal(b.getPiece(pos2).pos, pos2);
        ok(!b.getPiece(pos1));
    });

    test("addPiece_Throw", function () {
        var b = new Board();
        b._pos_piece['11'] = 'some';
        raises(function () {
            b.addPiece(new BasePiece(null, null, new Pos(1, 1)));
        }, "must throw error to pass");
    });

    test("addPiece", function () {
        var pos = new Pos(1, 1);
        var b = new Board();
        var p = new BasePiece(null, null, pos);
        b.addPiece(p);
        ok(b._pos_piece[pos.toString()] === p);
        ok(p.board === b);

        var r1 = new BasePiece('leader', 'red', new Pos(2, 3));
        b.addPiece(r1);
        ok(b.redLeader == r1);

        var b1 = new BasePiece('leader', 'black', new Pos(4, 3));
        b.addPiece(b1);
        ok(b.blackLeader == b1);
    });

    test("setPiece", function () {
        var pos = new Pos(1, 1);
        var b = new Board();
        var p = new BasePiece(null, null, null);
        var arg_piece = null;
        var call_drawPiece = false;
        var arg_pos = null;
        var call_clearPos = false;
        b.subscriber = {
            drawPiece: function (piece) { arg_piece = piece; call_drawPiece = true; },
            clearPos: function (pos) { arg_pos = pos; call_clearPos = true; }
        };
        b.setPiece(pos, p);

        ok(b._pos_piece[pos.toString()] == p);
        ok(p.pos == pos);
        ok(arg_piece == p);
        ok(call_drawPiece);
        ok(!call_clearPos);

        arg_piece = null;
        call_drawPiece = false;
        arg_pos = null;
        call_clearPos = false;

        b.setPiece(pos, null);
        equal(arg_piece, null);
        ok(!b._pos_piece[pos.toString()]);
        ok(call_clearPos);
        ok(pos == arg_pos);
        ok(!call_drawPiece);

    });

    test("getPiece", function () {
        var pos = new Pos(1, 1);
        var b = new Board();
        b._pos_piece['11'] = 'some';
        equal(b.getPiece(pos), 'some');
        ok(!b.getPiece(new Pos(0, 0)));
    });

    test("execute", function () {
        var b = new Board();
        var win_camp = null;
        //b._isWinner = function () { return true; };
        //b.subscriber.notifyWinner = function (camp) { win_camp = camp; };
        //b.execute();
        //equal(win_camp, 'red');

        var call_undo = false;
        b._isWinner = function () { return false; };
        b._isNotFaced = function () { return true; };
        b.undo = function () { call_undo = true; };
        var pos1 = new Pos(5, 5);
        var pos2 = new Pos(6, 6);
        var pos3 = new Pos(0, 0);
        var p1 = new BasePiece('b1', 'black', pos1);
        var p2 = new BasePiece('r1', 'red', pos2);
        b.addPiece(p1);
        b.addPiece(p2);
        b.execute(pos1, pos3);
        equal(b._commandHistory.length, 1);
        same(b._commandHistory[0], { camp: 'red', posA: pos1, posB: pos3, Death: undefined });
        equal(b.curCamp, 'black');
        ok(!call_undo);

        b.execute(pos3, pos2);
        equal(b._commandHistory.length, 2);
        equal(b._commandHistory[1].camp, 'black');
        equal(b._commandHistory[1].posA, pos3);
        equal(b._commandHistory[1].posB, pos2);
        ok(b._commandHistory[1].Death == p2);
    });

    test("undo", function () {
        var b = new Board();
        b._isWinner = function () { return false; };
        b._isNotFaced = function () { return true; };
        var pos1 = new Pos(5, 5);
        var pos2 = new Pos(6, 6);
        var pos3 = new Pos(0, 0);
        var p1 = new BasePiece('b1', 'black', pos1);
        var p2 = new BasePiece('r1', 'red', pos2);
        b.addPiece(p1);
        b.addPiece(p2);
        b.execute(pos1, pos3);
        equal(b.curCamp, 'black');
        b.execute(pos3, pos2);
        equal(b.curCamp, 'red');

        b.undo();
        equal(b.curCamp, 'black');
        equal(b.getPiece(pos3).name, 'b1');
        equal(b.getPiece(pos2).name, 'r1');
        b.undo();
        equal(b.curCamp, 'red');
        equal(b.getPiece(pos1).name, 'b1');
        equal(b.getPiece(pos2).name, 'r1');
        ok(!b.getPiece(pos3));
    });

});
