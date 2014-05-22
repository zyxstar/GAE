define(function(require) {
    var Pos = require('lib/pos');

    module("Pos");
    test("ctor_Throw", function () {
        raises(function () {
            var p = new Pos('d', 1);
        }, "must throw error to pass");
    });

    test("toString", function () {
        var p = new Pos(1, 1);
        equal(p.toString(), "11");
        p = new Pos(8, 9);
        equal(p.toString(), "89");
    });

    test("equals", function () {
        var p = new Pos(1, 1);
        ok(p.equals(p));
        ok(p.equals(new Pos(1, 1)));
        ok(!p.equals(new Pos(2, 2)));
    });

    test("isInArray", function () {
        var data = [[1, 1], [2, 2], [3, 3], [4, 4]],
            arr = [],
            i, len;
        for ( i = 0, len = data.length; i < len; i++)
            arr.push(Pos.parse(data[i]));
        for ( i = 0, len = data.length; i < len; i++)
            ok(new Pos(data[i][0], data[i][1]).isInArray(arr));
        ok(!new Pos(5, 5).isInArray(arr));
    });

    test("Pos.equals", function () {
        var p = new Pos(1, 1);
        ok(Pos.equals(p, new Pos(1, 1)));
        ok(!Pos.equals(p, new Pos(2, 2)));
    });

    test("Pos.parse_str_Throw", function () {
        raises(function () {
            var str = "dd";
            var p = Pos.parse(str);
        }, "must throw error to pass");
    });

    test("Pos.parse_str", function () {
        ok((Pos.parse('23')).equals(new Pos(2, 3)));
        ok((Pos.parse('00')).equals(new Pos(0, 0)));
    });

    test("Pos.parse_arr", function () {
        ok((Pos.parse([2, 3])).equals(new Pos(2, 3)));
        ok((Pos.parse(['2', '3'])).equals(new Pos(2, 3)));
        ok((Pos.parse([0, 0])).equals(new Pos(0, 0)));
        ok((Pos.parse(['0', '0'])).equals(new Pos(0, 0)));
    });


});
