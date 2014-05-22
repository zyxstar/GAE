define(function(require) {
    var Pos = require('lib/pos'),
        BasePiece = require('lib/piece'),
        Piece_ma = require('lib/piece_ma'),
        Board = require('lib/board');

    module("BasePiece");
    test("_calcPos", function () {
        var p = new BasePiece(null, null, new Pos(5, 5));
        same(p._calcPos([1, 1]), new Pos(6, 6));
        same(p._calcPos([1, -1]), new Pos(6, 4));
        same(p._calcPos([-1, 1]), new Pos(4, 6));
        same(p._calcPos([-1, -1]), new Pos(4, 4));
    });

    test("_isEnemy", function () {
        var p = new BasePiece('r1', 'red', new Pos(5, 5));
        //mock
        p.board = {};
        p.board._belong = function () { return 'black'; };
        ok(p._isEnemy());
        p.board._belong = function () { return 'none'; };
        ok(!p._isEnemy());
        p.board._belong = function () { return 'red'; };
        ok(!p._isEnemy());

        //real
        var p2 = new BasePiece('b1', 'black', new Pos(4, 4));
        var b = new Board();
        b.addPiece(p);
        b.addPiece(p2);
        ok(p._isEnemy(new Pos(4, 4)));
        ok(!p._isEnemy(new Pos(5, 5)));
        ok(!p._isEnemy(new Pos(0, 0)));
        ok(p2._isEnemy(new Pos(5, 5)));
        ok(!p2._isEnemy(new Pos(4, 4)));
        ok(!p2._isEnemy(new Pos(0, 0)));
    });

    test("_getEnemy", function () {
        var p = new BasePiece('r1', 'red', new Pos(5, 5));
        equal(p._getEnemy(), 'black');
        p.camp = 'black';
        equal(p._getEnemy(), 'red');
    });

    test("equals", function () {
        var p = new BasePiece('b1', 'black', new Pos(5, 5));
        ok(p.equals(p));
        var b = new Board();
        p.board = b;
        var p2 = new BasePiece('b1', 'black', new Pos(5, 5));
        p2.board = b;
        ok(p.equals(p2));
        var p3 = new BasePiece('b2', 'black', new Pos(5, 5));
        p3.board = b;
        ok(!p.equals(p3));
        var p4 = new BasePiece('b1', 'red', new Pos(5, 5));
        p4.board = b;
        ok(!p.equals(p4));
        var p5 = new BasePiece('b1', 'black', new Pos(4, 5));
        p5.board = b;
        ok(!p.equals(p5));
        var p6 = new BasePiece('b1', 'black', new Pos(5, 5));
        ok(!p.equals(p6));
    });

    test("isInArray", function () {
        var data = [];
        data.push(['r1', 'red', [1, 0]]);
        data.push(['r2', 'red', [2, 0]]);
        data.push(['r3', 'red', [3, 0]]);
        var arr = [];
        var b = new Board();
        for (var i = 0; i < data.length; i++) {
            var p = new BasePiece(data[i][0], data[i][1], Pos.parse(data[i][2]));
            p.board = b;
            arr.push(p);
        }
        ok(!(new BasePiece('r1', 'black', new Pos(1, 1)).isInArray(arr)));
    });

    test("canMove", function () {
        var p = new BasePiece('r1', 'red', new Pos(5, 5));
        var call_calcVectors = false;
        var call_calcPos = 0;
        var call_isOverBoard = 0;
        var call_isRestrict = 0;
        var call_belong = 0;
        //mock
        p.calcVectors = function () { call_calcVectors = true; return [[1, 1], [2, 2], [3, 3]]; };
        p._calcPos = function (vec) { call_calcPos++; return vec; };
        p.board = {
            _isOverBoard: function () { call_isOverBoard++; return false; },
            _belong: function () { call_belong++; return 'black'; }
        };
        p.isRestrict = function (pos, vec) { call_isRestrict++; return false; };
        var ret = p.canMove();
        ok(call_calcVectors);
        equal(call_calcPos, 3);
        equal(call_isOverBoard, 3);
        equal(call_isRestrict, 3);
        equal(call_belong, 3);
        equal(ret.length, 3);
    });

    test("canKill", function () {
        //mock
        var p = new BasePiece('r1', 'red', new Pos(5, 5));
        var data = [[0, 0], [1, 1], [2, 2]];
        var posArr = [];
        p.canMove = function () {
            var ret = [];
            for (var i = 0; i < data.length; i++)
                ret.push(Pos.parse(data[i]));
            return ret;
        };
        p._isEnemy = function (pos) { posArr.push(pos); return true; };
        var ret = p.canKill();
        same(ret, posArr);
        equal(ret.length, data.length);
        p._isEnemy = function (pos) { return false; };
        ret = p.canKill();
        equal(ret.length, 0);
    });

    test("canBeKilled", function () {
        var p = new BasePiece('r1', 'red', new Pos(5, 5));
        var call_canKill = 0;
        var call_isInArray = 0;
        var canKillfun = function () { call_canKill++; return []; };
        p.board = {
            _getPieceArr: function () {
                return [{ canKill: canKillfun }, { canKill: canKillfun }, { canKill: canKillfun}];
            }
        };
        var ret = [];
        p.pos.isInArray = function (arr) {
            ret.push(arr);
            call_isInArray++;
            return false;
        };
        ok(!p.canBeKilled());
        equal(ret.length, 3);
        equal(call_canKill, 3);
        equal(call_isInArray, 3);
        p.pos.isInArray = function () { return true; };
        ok(p.canBeKilled());
    });


    module("Piece_ma");
    test("_calcLeg", function () {
        var ma = new Piece_ma(null, null);
        same(ma._calcLeg([1, 2]), [0, 1]);
        same(ma._calcLeg([2, 1]), [1, 0]);
        same(ma._calcLeg([2, -1]), [1, 0]);
        same(ma._calcLeg([1, -2]), [0, -1]);
        same(ma._calcLeg([-1, -2]), [0, -1]);
        same(ma._calcLeg([-2, -1]), [-1, 0]);
        same(ma._calcLeg([-2, 1]), [-1, 0]);
        same(ma._calcLeg([-1, 2]), [0, 1]);
    });
});
