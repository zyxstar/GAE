define(["require","exports","module","lib/utils","lib/piece","lib/board","lib/pos"],function(o){function t(o,s){t.superclass.constructor.call(this,"pao",o,s)}var s=o("lib/utils"),i=o("lib/piece"),e=o("lib/board"),p=o("lib/pos");return s.extend(t,i),t.prototype._calcRoute=function(){function o(o,t,s){var e=new p(o,t),r=i.board.getPiece(e);return r?i.scope[s]=r:i.canMoveArr.push(e),!!r}var t,s,i=this;for(this.scope={top:null,right:null,bottom:null,left:null},this.canMoveArr=[],s=this.pos.y+1;s<e.ROWS&&!o(this.pos.x,s,"top");s++);for(t=this.pos.x+1;t<e.COLS&&!o(t,this.pos.y,"right");t++);for(s=this.pos.y-1;s>=0&&!o(this.pos.x,s,"bottom");s--);for(t=this.pos.x-1;t>=0&&!o(t,this.pos.y,"left");t--);},t.prototype.canMove=function(){return this._calcRoute(),this.canMoveArr},t.prototype.canKill=function(){function o(o,t){var s=r.board.getPiece(new p(o,t));return s&&s.camp!==r.camp&&i.push(s.pos),!!s}var t,s,i=[],r=this;if(this._calcRoute(),this.scope.top)for(s=this.scope.top.pos.y+1;s<e.ROWS&&!o(this.pos.x,s);s++);if(this.scope.right)for(t=this.scope.right.pos.x+1;t<e.COLS&&!o(t,this.pos.y);t++);if(this.scope.bottom)for(s=this.scope.bottom.pos.y-1;s>=0&&!o(this.pos.x,s);s--);if(this.scope.left)for(t=this.scope.left.pos.x-1;t>=0&&!o(t,this.pos.y);t--);return i},t});
//# sourceMappingURL=piece_pao.js.map