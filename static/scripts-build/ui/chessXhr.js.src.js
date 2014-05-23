require.config({
    baseUrl: '../static/scripts-build',
    shim: {
        json2: {
            exports: 'JSON'
        }
    },
    paths: {
        jquery: '/static/scripts/vendor/jquery2.0.3',
        json2: '/static/scripts/vendor/json2',
        text: '/static/scripts/vendor/requirejs-text'
    }
});

require([
    'jquery',
    'lib/board',
    'ui/panel',
    'ui/comm'
], function ($, Board, Panel, Comm) {

    function ChessXhr() {
        var COMM_URL = "http://zyx-star.appsp0t.com/chessxhr";
        var COMM_INTERVAL = 2000;

        var board = null;
        var comm = null;
        var panel = null;
        var isAnimate = true;

        var boardSubscriber = {
            drawPiece: function (piece) {
                panel.drawPiece(piece);
            },
            clearPos: function (pos) {
                panel.clearPos(pos);
            },
            notifyIsFaced: function () {
                alert('老头不能见面');
            },
            notifyWinner: function (camp) {
                alert(camp == 'red' ? '红方胜' : '黑方胜');
            },
            notifyNoHistory: function () {
                $('#regret')[0].disabled = true;
            },
            notifyHasHistory: function () {
                $('#regret')[0].disabled = false;
            },
            notifyCurCamp: function (camp) {
                if (camp == 'red')
                    $('#curCamp').html('<label style="color:red">当前红方走</label>');
                else
                    $('#curCamp').html('<label style="color:black">当前黑方走</label>');
            },
            notifyExecute: function (info) {
                if (info.camp == comm.camp)
                    comm.move(info.posA.toString(), info.posB.toString());
                if (isAnimate)
                    panel.moveAnimate(info.posA, info.posB);
            }
        };

        var commSubscriber = {
            xhrError: function (action, XMLHttpRequest, textStatus, errorThrown) {
                action += "<br/>url:" + this.url;
                if (XMLHttpRequest.responseText)
                    action += "<br/>" + XMLHttpRequest.responseText;
                $('#err_details').html("action:" + action);
                $('#error').show();
            },
            notifyBegin: function () {
                alert("已有黑方加入，现在开始");
                $('#cfg').hide();
                panel.myCamp = comm.camp;
                panel.init();
                $('#myCamp').html('<label style="color:red">我是红方</label>');
                $('#container').show();
            },
            notifyMove: function (posA, posB) {
                board.execute(posA, posB);
            },
            notifyRegretAsk: function () {
                var agree = confirm("对方要求悔棋，你是否同意?");
                comm.regretAns(agree, function () {
                    if (agree === true) {
                        panel.resetCurrent();
                        board.undo();
                    }
                });
            },
            notifyRegretAns: function (ans) {
                if (ans === true) {
                    alert("对方同意悔棋!");
                    panel.resetCurrent();
                    board.undo();
                }
                else
                    alert("对方不同意悔棋!");
            },
            notifyGameOver: function () {
                $('#container').empty();
                $('#container').html("棋局已结束 <a href='javascript:void(0);' onclick='window.location.reload()'>重新开始</a>");
            }
        };

        this.init = function () {
            board = new Board(boardSubscriber);
            comm = new Comm();
            panel = new Panel($('#board'));

            boardSubscriber.panel = panel;
            boardSubscriber.comm = comm;

            comm.interval = COMM_INTERVAL;
            comm.subscriber = commSubscriber;
            commSubscriber.panel = panel;
            commSubscriber.board = board;
            commSubscriber.comm = comm;

            panel.board = board;
            panel.isMePlay = function () {
                return panel.myCamp == board.curCamp;
            };

            _init_ui();
        };

        function _init_ui() {
            $('#setServer').bind('click', function () {
                comm.setServer($('#url').val(), function () {
                    $('#setServer').val("连接成功");
                    $('#setServer')[0].disabled = true;
                    $('#newGame')[0].disabled = false;
                    $('#getGames')[0].disabled = false;
                    $('#joinGame')[0].disabled = false;
                });
            });

            $('#newGame').bind('click', function () {
                if (comm.camp) return;
                if ($('#newGameName').val() === "") {
                    alert("名字不能为空");
                    return;
                }
                comm.newGame($('#newGameName').val(), function () {
                    $('#newGame').val("等待黑方加入");
                    $('#newGame')[0].disabled = true;
                    $('#joinGame')[0].disabled = true;
                }, function () {
                    alert("该棋局已存在");
                });
            });

            $('#getGames').bind('click', function () {
                comm.getGames(function (arr) {
                    $('#games').empty();
                    if (arr.length === 0) {
                        alert("没有棋局可以加入，新建棋局或稍后再试");
                        return;
                    }
                    for (var i = 0; i < arr.length; i++) {
                        $('#games').append("<option>" + arr[i] + "</option>");
                    }
                });
            });

            $('#joinGame').bind('click', function () {
                if (comm.camp) return;
                if (!($('#games').val()) || $('#games').val() === "") {
                    alert("请载入并选择");
                }
                comm.joinGame($('#games').val(), function () {
                    alert("现在开始，等待红方先走");
                    $('#newGame')[0].disabled = true;
                    $('#joinGame')[0].disabled = true;
                    $('#cfg').hide();
                    panel.myCamp = comm.camp;
                    panel.init();
                    $('#myCamp').html('<label style="color:black">我是黑方</label>');
                    $('#container').show();
                }, function () {
                    alert("该棋局不存在或已结束，请另选");
                }, function () {
                    alert("该棋局已开始，请另选");
                });
            });

            $('#err_close').bind('click', function () {
                $('#error').hide();
            });

            $('#hint').bind('click', function () {
                panel.setHint(this.checked);
            });

            $('#animate').bind('click', function () {
                isAnimate = this.checked;
            });

            $('#regret').bind('click', function () {
                comm.regretAsk();
            });

            $('#gameOver').bind('click', function () {
                if (confirm("确认结束棋局?"))
                    comm.gameOver(function () {
                        commSubscriber.notifyGameOver();
                    });
            });

            $('#url').val(COMM_URL);
            $('#container').hide();
            $('#error').hide();
        }
    }
    new ChessXhr().init();

});
