define(["require","exports","module","lib/utils","lib/piece"],function(t){function e(t,r){e.superclass.constructor.call(this,"ma",t,r)}var r=t("lib/utils"),c=t("lib/piece");return r.extend(e,c),e.prototype._calcLeg=function(t){var e=Math.abs(t[0]),r=Math.abs(t[1]);return e>r?t[0]>0?[1,0]:[-1,0]:t[1]>0?[0,1]:[0,-1]},e.prototype.calcVectors=function(){return[[1,2],[2,1],[2,-1],[1,-2],[-1,-2],[-2,-1],[-2,1],[-1,2]]},e.prototype.isRestrict=function(t,e){var r=this._calcPos(this._calcLeg(e));return!!this.board.getPiece(r)},e});
//# sourceMappingURL=piece_ma.js.map