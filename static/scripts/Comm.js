function Comm(subscriber, interval) {
    this.camp = null;
    this.name = null;
    this.url = null;
    this.interval = interval || 1000;
    this.subscriber = subscriber || {
        xhrError: function (action, XMLHttpRequest, textStatus, errorThrown) { },
        notifyBegin: function () { },
        notifyMove: function (posA, posB) { },
        notifyRegretAsk: function () { },
        notifyRegretAns: function (ans) { },
        notifyGameOver: function () { }
    };

    var listenIsBeginHander = null;
    var listenCommandHander = null;
    var me = this;
    
    this.setServer = function (url, fn_ok) {
        xhr(url, { action: "setServer" },
            xhrError("setServer"),
            function (msg) {
                me.url = url;
                log(msg);
                if (fn_ok) fn_ok();
            }
        );
    };

    this.reSet = function (fn_ok) {
        xhr(me.url, { action: "reSet" },
            xhrError("reSet"),
            function (msg) {
                log(msg);
                if (msg.ret == "ok") {
                    if (fn_ok) fn_ok();
                }
            }
        );
    };

    this.newGame = function (name, fn_ok, fn_exist) {
        xhr(me.url, { action: "newGame", name: name },
            xhrError("newGame"),
            function (msg) {
                log(msg);
                if (msg.ret == "ok") {
                    me.name = name;
                    me.camp = "red";
                    startListenIsBegin();
                    if (fn_ok) fn_ok();
                }
                else {
                    if (fn_exist) fn_exist();
                }
            }
        );
    };

    this.getGames = function (fn_ok) {
        xhr(me.url, { action: "getGames" },
            xhrError("getGames"),
            function (msg) {
                log(msg);
                if (fn_ok) fn_ok(msg.ret);
            }
        );
    };

    this.joinGame = function (name, fn_ok, fn_no, fn_occ) {
        xhr(me.url, { action: "joinGame", name: name },
            xhrError("joinGame"),
            function (msg) {
                log(msg);
                if (msg.ret == "ok") {
                    me.name = name;
                    me.camp = "black";
                    startListenCommand();
                    if (fn_ok) fn_ok();
                }
                else if (msg.ret == "nogame") {
                    if (fn_no) fn_no();
                }
                else if (msg.ret == "occupy") {
                    if (fn_occ) fn_occ();
                }
            }
        );
    };

    function startListenIsBegin() {
        function notify() {
            xhr(me.url, { action: "listenIsBegin", name: me.name },
            xhrError("listenIsBegin"),
            function (msg) {
                log(msg);
                if (msg.ret == "ok") {
                    startListenCommand();
                    stopListenIsBegin();
                    me.subscriber.notifyBegin();
                }
                else
                    listenIsBeginHander = setTimeout(notify, me.interval);
            });
        }
        listenIsBeginHander = setTimeout(notify, me.interval);
    };

    function stopListenIsBegin() {
        clearTimeout(listenIsBeginHander);
    };

    this.regretAsk = function (fn_ok) {
        xhr(me.url, { action: "regretAsk", name: me.name, camp: me.camp },
            xhrError("regretAsk"),
            function (msg) {
                log(msg);
                if (msg.ret == "ok") {
                    if (fn_ok) fn_ok();
                }
            }
        );
    };

    this.regretAns = function (ans, fn_ok) {
        xhr(me.url, { action: "regretAns", name: me.name, camp: me.camp, ans: ans },
            xhrError("regretAns"),
            function (msg) {
                log(msg);
                if (msg.ret == "ok") {
                    if (fn_ok) fn_ok();
                }
            }
        );
    };

    this.move = function (posA, posB, fn_ok) {
        xhr(me.url, { action: "move", name: me.name, camp: me.camp, posA: posA, posB: posB },
            xhrError("move"),
            function (msg) {
                log(msg);
                if (msg.ret == "ok") {
                    if (fn_ok) fn_ok();
                }
            }
        );
    };

    function startListenCommand() {
        function notify() {
            xhr(me.url, { action: "listenCommand", name: me.name, camp: me.camp },
                xhrError("listenCommand"),
                function (msg) {
                    log(msg);
                    if (msg.ret == "ok") {
                        if (msg.cmd == "move")
                            me.subscriber.notifyMove(msg.posA, msg.posB);
                        else if (msg.cmd == "regretask")
                            me.subscriber.notifyRegretAsk();
                        else if (msg.cmd == "regretans")
                            me.subscriber.notifyRegretAns(msg.ans);
                    }
                    else if (msg.ret == "nogame") {
                        stopListenIsBegin();
                        stopListenCommand();
                        me.subscriber.notifyGameOver();
                    }
                }
            );
        }
        listenCommandHander = setInterval(notify, me.interval);
    };

    function stopListenCommand() {
        clearInterval(listenCommandHander);
    };

    this.gameOver = function (fn_ok) {
        xhr(me.url, { action: "gameOver", name: me.name },
            xhrError("gameOver"),
            function (msg) {
                log(msg);
                if (msg.ret == "ok") {
                    stopListenIsBegin();
                    stopListenCommand();
                    if (fn_ok) fn_ok();
                }
            }
        );
    };

    function xhr(url, data, error, success) {
        $.ajax({
            type: "GET",
            url: url,
            data: data,
            dataType: "jsonp",
            jsonp: "callback",
            error: error,
            success: success
        });
    }

    function log(obj) {
        if (typeof console != "undefined" && console && console.log) console.log(obj);
    }

    function xhrError(action) {
        return function (XMLHttpRequest, textStatus, errorThrown) {
            //debugger;
            me.subscriber.xhrError.call(this, action, XMLHttpRequest, textStatus, errorThrown);
        };
    }
}