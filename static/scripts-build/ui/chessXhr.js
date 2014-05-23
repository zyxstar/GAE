require.config({baseUrl:"../static/scripts-build",shim:{json2:{exports:"JSON"}},paths:{jquery:"/static/scripts/vendor/jquery2.0.3",json2:"/static/scripts/vendor/json2",text:"/static/scripts/vendor/requirejs-text"}}),require(["jquery","lib/board","ui/panel","ui/comm"],function(e,n,i,t){function r(){function r(){e("#setServer").bind("click",function(){l.setServer(e("#url").val(),function(){e("#setServer").val("连接成功"),e("#setServer")[0].disabled=!0,e("#newGame")[0].disabled=!1,e("#getGames")[0].disabled=!1,e("#joinGame")[0].disabled=!1})}),e("#newGame").bind("click",function(){return l.camp?void 0:""===e("#newGameName").val()?void alert("名字不能为空"):void l.newGame(e("#newGameName").val(),function(){e("#newGame").val("等待黑方加入"),e("#newGame")[0].disabled=!0,e("#joinGame")[0].disabled=!0},function(){alert("该棋局已存在")})}),e("#getGames").bind("click",function(){l.getGames(function(n){if(e("#games").empty(),0===n.length)return void alert("没有棋局可以加入，新建棋局或稍后再试");for(var i=0;i<n.length;i++)e("#games").append("<option>"+n[i]+"</option>")})}),e("#joinGame").bind("click",function(){l.camp||(e("#games").val()&&""!==e("#games").val()||alert("请载入并选择"),l.joinGame(e("#games").val(),function(){alert("现在开始，等待红方先走"),e("#newGame")[0].disabled=!0,e("#joinGame")[0].disabled=!0,e("#cfg").hide(),s.myCamp=l.camp,s.init(),e("#myCamp").html('<label style="color:black">我是黑方</label>'),e("#container").show()},function(){alert("该棋局不存在或已结束，请另选")},function(){alert("该棋局已开始，请另选")}))}),e("#err_close").bind("click",function(){e("#error").hide()}),e("#hint").bind("click",function(){s.setHint(this.checked)}),e("#animate").bind("click",function(){m=this.checked}),e("#regret").bind("click",function(){l.regretAsk()}),e("#gameOver").bind("click",function(){confirm("确认结束棋局?")&&l.gameOver(function(){d.notifyGameOver()})}),e("#url").val(o),e("#container").hide(),e("#error").hide()}var o="http://zyx-star.appsp0t.com/chessxhr",a=2e3,c=null,l=null,s=null,m=!0,u={drawPiece:function(e){s.drawPiece(e)},clearPos:function(e){s.clearPos(e)},notifyIsFaced:function(){alert("老头不能见面")},notifyWinner:function(e){alert("red"==e?"红方胜":"黑方胜")},notifyNoHistory:function(){e("#regret")[0].disabled=!0},notifyHasHistory:function(){e("#regret")[0].disabled=!1},notifyCurCamp:function(n){e("#curCamp").html("red"==n?'<label style="color:red">当前红方走</label>':'<label style="color:black">当前黑方走</label>')},notifyExecute:function(e){e.camp==l.camp&&l.move(e.posA.toString(),e.posB.toString()),m&&s.moveAnimate(e.posA,e.posB)}},d={xhrError:function(n,i){n+="<br/>url:"+this.url,i.responseText&&(n+="<br/>"+i.responseText),e("#err_details").html("action:"+n),e("#error").show()},notifyBegin:function(){alert("已有黑方加入，现在开始"),e("#cfg").hide(),s.myCamp=l.camp,s.init(),e("#myCamp").html('<label style="color:red">我是红方</label>'),e("#container").show()},notifyMove:function(e,n){c.execute(e,n)},notifyRegretAsk:function(){var e=confirm("对方要求悔棋，你是否同意?");l.regretAns(e,function(){e===!0&&(s.resetCurrent(),c.undo())})},notifyRegretAns:function(e){e===!0?(alert("对方同意悔棋!"),s.resetCurrent(),c.undo()):alert("对方不同意悔棋!")},notifyGameOver:function(){e("#container").empty(),e("#container").html("棋局已结束 <a href='javascript:void(0);' onclick='window.location.reload()'>重新开始</a>")}};this.init=function(){c=new n(u),l=new t,s=new i(e("#board")),u.panel=s,u.comm=l,l.interval=a,l.subscriber=d,d.panel=s,d.board=c,d.comm=l,s.board=c,s.isMePlay=function(){return s.myCamp==c.curCamp},r()}}(new r).init()});
//# sourceMappingURL=chessXhr.js.map