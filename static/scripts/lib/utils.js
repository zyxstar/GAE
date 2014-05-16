define (function (require, exports, module){

    exports.extend = function (subClass, superClass) {
        var F = function() {};
        F.prototype = superClass.prototype;
        subClass.prototype = new F();
        subClass.prototype.constructor = subClass;

        subClass.superclass = superClass.prototype;
        if(superClass.prototype.constructor == Object.prototype.constructor) {
            superClass.prototype.constructor = superClass;
        }
    };

    exports.range = function (start, end, step) {
        var ret = [], i;
        if(arguments.length === 1) {
            end = start;
            start = 0;
        }
        step = step || 1;
        for(i = start; (step > 0 && i < end) || (step < 0 && i > end); i += step)
            ret.push(i);
        return ret;
    };

    exports.takeWhile = function (list, predicate, context) {
        var ret = [];
        for(var i = 0, len = list.length; i < len; i++){
            if (predicate.call(context, list[i], i, list)) break;
            ret.push(list[i]);
        }
        return ret;
    };
});
