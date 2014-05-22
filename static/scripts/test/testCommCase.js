  define(function(require){
    var $ = require('jquery'),
        Comm = require('ui/comm');

    module("Comm", {
        setup: function () {
        },
        teardown: function () {
        }
    });

    function _createComm(){
        var c = new Comm();
        c.url = 'http://zyx-star.appsp0t.com/chessxhr';
        c.interval = 500;
        return c;
    }

    asyncTest("reSet", function () {
        expect(1);
        var c = _createComm();
        c.reSet(function () {
            ok(true, "reSet_ok");
            start();
        });
    });

    asyncTest("setServer", function () {
        expect(1);
        var c = new Comm();
        c.setServer(comm_url, function () {
            equal(c.url, comm_url);
            start();
        });
    });

    asyncTest("newGame", function () {
        expect(4);
        var c = _createComm();
        c.newGame("newName", function () {
            equal(c.name, "newName");
            equal(c.camp, "red");
        });

        var c2 = _createComm();
        c2.newGame("newName", null, function () {
            equal(c2.name, null);
            equal(c2.camp, null);
            c.gameOver(function () {
                start();
            });

        });
    });

    asyncTest("getGames_empty", function () {
        expect(1);
        var c = _createComm();
        c.getGames(function (arr) {
            same(arr, []);
            start();
        });
    });

    asyncTest("getGames", function () {
        expect(1);
        var c = _createComm();
        c.newGame("game1");
        var c2 = _createComm();
        c2.newGame("game2");
        c.getGames(function (arr) {
            same(arr, ['game1', 'game2']);
            c.gameOver(function () {
                c2.gameOver(function () {
                    start();
                });
            });
        });
    });


    asyncTest("joinGame_ok", function () {
        expect(1);
        var c = _createComm();
        var c2 = _createComm();
        c.newGame("game3", function () {
            c2.joinGame("game3", function () {
                equal(c2.name, "game3");
                c.gameOver(function () {
                    c2.gameOver(function () {
                        start();
                    });
                });
            }, null, null);
        });
    });

    asyncTest("joinGame_nogame", function () {
        expect(1);
        var c = _createComm();
        c.joinGame("nogame", null, function () {
            equal(c.name, null);
            start();
        }, null);
    });

    asyncTest("joinGame_occupy", function () {
        expect(1);
        var c = _createComm();
        var c2 = _createComm();
        var c3 = _createComm();
        c.newGame("game4", function () {
            c2.joinGame("game4", function () {
                c3.joinGame("game4", null, null, function () {
                    equal(c3.name, null);
                    c.gameOver(function () {
                        c2.gameOver(function () {
                            start();
                        });
                    });
                });
            });
        });
    });

    asyncTest("startListenIsBegin", function () {
        expect(1);
        var c = _createComm();
        var c2 = _createComm();

        c.subscriber.notifyBegin = function () {
            ok(true, "notifyBegin_Call");
            c.gameOver(function () {
                c2.gameOver(function () {
                    start();
                });
            });
        };

        c.newGame("game5", function () {
            c2.joinGame("game5");
        });
    });

    asyncTest("regretAsk", function () {
        expect(2);
        var c = _createComm();
        var c2 = _createComm();

        c.subscriber.notifyRegretAsk = function () {
            ok(true, "notifyRegretAsk_Call");
            c.gameOver(function () {
                c2.gameOver(function () {
                    start();
                });
            });
        };

        c.newGame("game6", function () {
            c2.joinGame("game6", function () {
                c2.regretAsk(function () {
                    ok(true, "regretAsk_Call");
                });
            });
        });
    });

    asyncTest("regretAsk2", function () {
        expect(2);
        var c = _createComm();
        var c2 = _createComm();

        c.subscriber.notifyBegin = function () {
            c.regretAsk(function () {
                ok(true, "regretAsk_Call");
            });
        };

        c2.subscriber.notifyRegretAsk = function () {
            ok(true, "notifyRegretAsk_Call");
            c.gameOver(function () {
                c2.gameOver(function () {
                    start();
                });
            });
        };
        c.newGame("game7", function () {
            c2.joinGame("game7");
        });
    });

    asyncTest("regretAns", function () {
        expect(3);
        var c = _createComm();
        var c2 = _createComm();

        c.subscriber.notifyRegretAns = function (ans) {
            ok(true, "notifyRegretAns_Call");
            equal(ans, false);
            c.gameOver(function () {
                c2.gameOver(function () {
                    start();
                });
            });
        };

        c.newGame("game8", function () {
            c2.joinGame("game8", function () {
                c2.regretAns(false, function () {
                    ok(true, "regretAns_Call");
                });
            });
        });
    });

    asyncTest("regretAns2", function () {
        expect(3);
        var c = _createComm();
        var c2 = _createComm();

        c.subscriber.notifyBegin = function () {
            c.regretAns(true, function () {
                ok(true, "regretAns_Call");
            });
        };

        c2.subscriber.notifyRegretAns = function (ans) {
            ok(true, "notifyRegretAns_Call");
            equal(ans, true);
            c.gameOver(function () {
                c2.gameOver(function () {
                    start();
                });
            });
        };
        c.newGame("game9", function () {
            c2.joinGame("game9");
        });
    });

    asyncTest("move", function () {
        expect(4);
        var c = _createComm();
        var c2 = _createComm();

        c.subscriber.notifyMove = function (posA, posB) {

            ok(true, "notifyMove_Call");
            equal(posA, "11");
            equal(posB, "22");
            c.gameOver(function () {
                c2.gameOver(function () {
                    start();
                });
            });
        };

        c.newGame("game10", function () {
            c2.joinGame("game10", function () {
                c2.move("11", "22", function () {
                    ok(true, "move_Call");
                });
            });
        });
    });

    asyncTest("move2", function () {
        expect(4);
        var c = _createComm();
        var c2 = _createComm();

        c.subscriber.notifyBegin = function () {
            c.move("11", "22", function () {
                ok(true, "move_Call");
            });
        };

        c2.subscriber.notifyMove = function (posA, posB) {
            ok(true, "notifyMove_Call");
            equal(posA, "11");
            equal(posB, "22");
            c.gameOver(function () {
                c2.gameOver(function () {
                    start();
                });
            });
        };
        c.newGame("game11", function () {
            c2.joinGame("game11");
        });
    });

    asyncTest("move3", function () {
        expect(4);
        var c = _createComm();
        var c2 = _createComm();

        c.subscriber.notifyBegin = function () {
            c.move("11", "22");
        };

        c.subscriber.notifyMove = function (posA, posB) {
            equal(posA, "33");
            equal(posB, "44");
            c.gameOver(function () {
                c2.gameOver(function () {
                    start();
                });
            });
        };

        c2.subscriber.notifyMove = function (posA, posB) {
            equal(posA, "11");
            equal(posB, "22");
            c2.move("33", "44");
        };

        c.newGame("game12", function () {
            c2.joinGame("game12");
        });
    });

    asyncTest("gameOver", function () {
        expect(1);
        var c = _createComm();
        var c2 = _createComm();

        c.subscriber.notifyBegin = function () {
            c.gameOver();
        };

        c2.subscriber.notifyGameOver = function () {
            ok(true, "notifyGameOver_Call");
            c2.gameOver(function () {
                start();
            });
        };

        c.newGame("game12", function () {
            c2.joinGame("game12");
        });
    });

  });
