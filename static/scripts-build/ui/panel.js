define(["require","exports","module","lib/utils","lib/board","lib/pos","lib/cfg","jquery"],function(t){function e(t){function e(e,i){var o=r(document.createElement("DIV"));return o.css("red"==g.myCamp?{left:e*d,top:(n.ROWS-1-i)*d}:{left:(n.COLS-1-e)*d,top:i*d}),o[0].id=e.toString()+i.toString(),o.appendTo(t),o.bind("click",c),o}function a(t,e){return m[t.toString()+e.toString()]}function l(t,e,n){m[t.toString()+e.toString()]=n}function s(t){for(var e=o.campLocation[t](),n=0;n<e.length;n++){var r=new(o.pieceName[e[n][1]].cls())(t,i.parse(e[n][0]));g.board.addPiece(r)}}function c(){if(g.isMePlay()){var t=g.board.getPiece(i.parse(this.id));if(p)return p.moveTo(i.parse(this.id))||g.drawPiece(p),p=null,void g.resetCurrent();if(t){if(t.camp!=g.board.curCamp)return;return p=t,v=t.canMove(),h=t.canKill(),r(this).addClass("selected"),b&&u(v,"canmove"),void(b&&u(h,"cankill"))}}}function u(t,e){for(var n=0;n<t.length;n++){var i=a(t[n].x,t[n].y);i.addClass(e)}}function f(t,e){for(var n=0;n<t.length;n++){var i=a(t[n].x,t[n].y);i.removeClass(e)}}var d=50,m={},p=null,v=null,h=null,b=!0;this.board=null,this.myCamp=null;var g=this;this.init=function(){for(x=0;x<n.COLS;x++)for(y=0;y<n.ROWS;y++)l(x,y,e(x,y));s("red"),s("black")},this.isMePlay=function(){throw new Error("must rewrite this method")},this.setHint=function(t){b!=t&&(b?(v&&f(v,"canmove"),h&&f(h,"cankill")):(v&&u(v,"canmove"),h&&u(h,"cankill")),b=t)},this.resetCurrent=function(){p&&g.drawPiece(p),v&&f(v,"canmove"),h&&f(h,"cankill"),p=null,v=null,h=null},this.drawPiece=function(t){var e=a(t.pos.x,t.pos.y);e.text(o.showName(t)),e[0].className="noraml",e.css({color:t.camp})},this.clearPos=function(t){var e=a(t.x,t.y);e.text(""),e[0].className=""},this.moveAnimate=function(e,n){function o(){l.show(),s.remove()}var a=r("#"+e.toString()),l=r("#"+n.toString()),s=l.clone();s.appendTo(t),s.css({left:a.css("left"),top:a.css("top")}),l.hide();var c=g.board.getPiece(n);if("ma"==c.name){var u=c._calcLeg([n.x-e.x,n.y-e.y]),f=r("#"+new i(e.x+u[0],e.y+u[1]).toString());s.animate({left:f.css("left"),top:f.css("top")},100).animate({left:l.css("left"),top:l.css("top")},100,o)}else s.animate({left:l.css("left"),top:l.css("top")},200,o)}}var n=(t("lib/utils"),t("lib/board")),i=t("lib/pos"),o=t("lib/cfg"),r=t("jquery");return e});
//# sourceMappingURL=panel.js.map