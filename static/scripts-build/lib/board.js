define(["require","exports","module","lib/pos"],function(e){function i(e){this._pos_piece={},this._commandHistory=[],this.subscriber=e||{drawPiece:function(){},clearPos:function(){},notifyIsFaced:function(){},notifyWinner:function(){},notifyNoHistory:function(){},notifyHasHistory:function(){},notifyCurCamp:function(){},notifyExecute:function(){}},this.curCamp="red",this.subscriber.notifyCurCamp(this.curCamp),this.redLeader=null,this.blackLeader=null}var t=e("lib/pos");return i.COLS=9,i.ROWS=10,i.prototype={_isOverBoard:function(e){return e.x<0||e.x>=i.COLS||e.y<0||e.y>=i.ROWS},_belong:function(e){return this.getPiece(e)?this.getPiece(e).camp:"none"},_changeCamp:function(){this.curCamp="red"==this.curCamp?"black":"red",this.subscriber.notifyCurCamp(this.curCamp)},_getPieceArr:function(e){var i,t=[];for(i in this._pos_piece)this._pos_piece.hasOwnProperty(i)&&this._pos_piece[i]&&this._pos_piece[i].camp==e&&t.push(this._pos_piece[i]);return t},_isNotFaced:function(){if(this.redLeader.pos.x!=this.blackLeader.pos.x)return!0;var e,i=this.redLeader.pos.x,s=this.redLeader.pos.y,r=this.blackLeader.pos.y;for(e=s+1;r>e;e++)if("none"!=this._belong(new t(i,e)))return!0;return!1},_isWinner:function(){return"red"==this.curCamp&&this.blackLeader.canBeKilled()?!0:"black"==this.curCamp&&this.redLeader.canBeKilled()?!0:!1},_move:function(e,i){this.setPiece(i,this.getPiece(e)),this.setPiece(e,null)},addPiece:function(e){var i=e.pos;if(this.getPiece(i))throw new Error("already exist "+i.toString());"leader"==e.name&&("red"==e.camp?this.redLeader=e:this.blackLeader=e),this.setPiece(i,e),e.board=this},setPiece:function(e,i){i&&(i.pos=e),this._pos_piece[e.toString()]=i,i?this.subscriber.drawPiece(i):this.subscriber.clearPos(e)},getPiece:function(e){return this._pos_piece[e.toString()]},execute:function(e,i){e instanceof t||(e=t.parse(e)),i instanceof t||(i=t.parse(i));var s={camp:this.curCamp,posA:e,posB:i,Death:this.getPiece(i)};return this._commandHistory.push(s),1==this._commandHistory.length&&this.subscriber.notifyHasHistory(),this._move(e,i),this._changeCamp(),this._isNotFaced()?(this.subscriber.notifyExecute(s),this._isWinner()&&this.subscriber.notifyWinner(this.curCamp),!0):(this.subscriber.notifyIsFaced(),this.undo(),!1)},undo:function(){if(0!==this._commandHistory.length){var e=this._commandHistory.pop();this._move(e.posB,e.posA),e.Death&&this.setPiece(e.posB,e.Death),this.curCamp=e.camp,this.subscriber.notifyCurCamp(this.curCamp),0===this._commandHistory.length&&this.subscriber.notifyNoHistory()}},newGame:function(){},loadGame:function(){},saveGame:function(){}},i});
//# sourceMappingURL=board.js.map