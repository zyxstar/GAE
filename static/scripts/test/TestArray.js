function TestArray() {
    module("Array");
    test("lastIndexOf", function () {
        var arr = [1, 2, 3, 4, 2, 5];
        var ret = Array.lastIndexOf(arr, 2);
        equal(ret, 4);
        var ret = Array.lastIndexOf(arr, 2, -3);
        equal(ret, 1);
        var ret = Array.lastIndexOf(arr, 2, 1);
        equal(ret, 1);
    });

    test("unique", function () {
        var arr = [5, 2, 3, 4, 2, 5, 4];
        var ret = Array.unique(arr);
        same(ret, [5, 2, 3, 4]);
    });


    test("filter", function () {
        var arr = [1, 2, 3, 4];
        var ret = Array.filter(arr, function (item, index) {
            if ((item % 2) == 0) return true;
            return false;
        });
        same(ret, [2, 4]);
    });

    test("reject", function () {
        var arr = [1, 2, 3, 4];
        var ret = Array.reject(arr, function (item, index) {
            if ((item % 2) == 0) return true;
            return false;
        });
        same(ret, [1, 3]);
    });

    test("every", function () {
        var arr = [1, 2, 3, 4];
        var ret = Array.every(arr, function (item, index) {
            if ((item % 2) == 0) return true;
            return false;
        });
        ok(!ret);
        arr = [8, 2, 6, 4];
        ret = Array.every(arr, function (item, index) {
            if ((item % 2) == 0) return true;
            return false;
        });
        ok(ret);
    });

    test("map", function () {
        var arr = [1, 2, 3, 4];
        var ret = Array.map(arr, function (item, index) {
            return item * 2;
        });
        same(ret, [2, 4, 6, 8]);
        var arr2 = [[0, 3], [2, 3], [4, 3], [6, 3], [8, 3]];
        var ret2 = Array.map(arr2, function (item, index) {
            return [item[0] * 60, item[1] * 60];
        });
        same(ret2, [[0, 180], [120, 180], [240, 180], [360, 180], [480, 180]]);
    });

    test("reduce", function () {
        var arr = [1, 2, 3, 4];
        var ret = Array.reduce(arr, 10, function (result, item, index) {
            return result + item;
        });
        equal(ret, 10 + 1 + 2 + 3 + 4);
    });

    test("find", function () {
        var arr = [1, 2, 3, 4];
        var ret = Array.find(arr, function (item, index) {
            if (item % 2 == 0) return true;
            return false;
        });
        ok(ret === arr[1]);
    });

    test("grep", function () {
        var arr = ['abc', 'efd', 'dd', 'ha'];
        var ret = Array.grep(arr, /a/);
        same(ret, ['abc', 'ha']);
    });

    test("partition", function () {
        var arr = [1, 2, 3, 4];
        var ret = Array.partition(arr, function (item, index) {
            if (item % 2 == 0) return true;
            return false;
        });
        same(ret.matches, [2, 4]);
        same(ret.rejects, [1, 3]);
    });

    test("zip", function () {
        var arr = [1, 2, 3, 4];
        var arr2 = [5, 6, 7, 8];
        var ret = Array.zip(arr, arr2);
        same(ret, [[1, 5], [2, 6], [3, 7], [4, 8]]);

        arr = [1, 2, 3];
        ret = Array.zip(arr, arr2);
        same(ret, [[1, 5], [2, 6], [3, 7]]);

        arr2 = [5, 6];
        ret = Array.zip(arr, arr2);
        same(ret, [[1, 5], [2, 6], [3, undefined]]);

    });

    test("each", function () {
        var arr = [1, 2, 3, 4];
        var ret = [];
        Array.each(arr, function (item, index) {
            ret.push(item);
        });
        same(arr, ret);
    });

    test("range", function () {
        same(Array.range(5), [0, 1, 2, 3, 4]);
        same(Array.range(0, 5), [0, 1, 2, 3, 4]);
        same(Array.range(1, 5), [1, 2, 3, 4]);
        same(Array.range(1, 5, 1), [1, 2, 3, 4]);
        same(Array.range(1, 5, 2), [1, 3]);
        same(Array.range(6, 5), []);
        same(Array.range(6, 1, -1), [6, 5, 4, 3, 2]);
        same(Array.range(6, 1, -2), [6, 4, 2]);
        same(Array.range(5, 5), []);
    });

    test("hash", function () {
        var keys = ['a', 'b', 'c'];
        var vals = [1, 2, 3];
        var ret = Array.hash(keys, vals);
        same(ret, { a: 1, b: 2, c: 3 });
        vals = [1, 2];
        var ret = Array.hash(keys, vals);
        same(ret, { a: 1, b: 2, c: true });
        vals = [];
        var ret = Array.hash(keys, vals);
        same(ret, { a: true, b: true, c: true });
    });

    test("indexOf", function () {
        var arr = ['a', 'b', 'c'];
        var ret = Array.indexOf(arr, 'a');
        equal(ret, 0);
        ret = Array.indexOf(arr, 'c');
        equal(ret, 2);
    });

}
