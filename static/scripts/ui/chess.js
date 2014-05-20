require.config({
    baseUrl: '../static/scripts',
    shim: {
        json2: {
            exports: 'JSON'
        }
    },
    paths: {
        jquery: 'vendor/jquery2.0.3',
        json2: 'vendor/json2',
        text: 'vendor/requirejs-text'
    }
});

require([
    'jquery',
    'lib/board',
    'ui/panel'
], function ($, Board, Panel) {

    function Chess() {
        var board = null;
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
                if(isAnimate)
                    panel.moveAnimate(info.posA, info.posB);
            }
        };

        this.init = function () {
            board = new Board(boardSubscriber);
            panel = new Panel($('#board'));

            boardSubscriber.panel = panel;

            panel.board = board;
            panel.isMePlay = function () {
                return true;
            };
            panel.myCamp = 'red';
            panel.init();

            _init_ui();
        };

        function _init_ui() {
            $('#hint').bind('click', function () {
                panel.setHint(this.checked);
            });

            $('#animate').bind('click', function () {
                isAnimate = this.checked;
            });

            $('#regret').bind('click', function () {
                panel.resetCurrent();
                board.undo();
            });
        }
    }

    new Chess().init();

});



