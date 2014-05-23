define (['require','exports','module'],function (require, exports, module){

    function Pos(x, y) {
        if (typeof x != 'number' || typeof y != 'number') {
            throw new Error("x or y is not a integer");
        }
        this.x = x;
        this.y = y;
    }
    Pos.prototype = {
        toString: function () {
            return this.x.toString() + this.y.toString();
        },
        equals: function (pos) {
            if (!pos) return false;
            if (this == pos) return true;
            return (this.x === pos.x && this.y === pos.y);
        },
        isInArray: function (arr) {
            var me = this;
            return (arr.filter(function (item, index) {
                return me.equals(item);
            }).length > 0);
        }
    };
    Pos.parse = function (data) {//data can be string or array
        var x = data[0],
            y = data[1];
        if ((!x || !y) && typeof data == 'string') {
            x = data.substr(0, 1);
            y = data.substr(1, 1);
        }
        if (typeof x != 'number') x = parseInt(x,10);
        if (typeof y != 'number') y = parseInt(y,10);
        if (isNaN(x) || isNaN(y))
            throw new Error("can not convert x or y into integer");
        return new Pos(x, y);
    };
    Pos.equals = function (pos1, pos2) {
        if (pos1.x === pos2.x && pos1.y === pos2.y) return true;
        return false;
    };

    return Pos;
});
