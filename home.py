#coding:utf-8
import web
from django.utils import simplejson
from google.appengine.ext import db

class GameStore(db.Model):
    name = db.StringProperty()
    wait = db.BooleanProperty()
    blackposA = db.StringProperty()
    blackposB = db.StringProperty()
    redposA = db.StringProperty()
    redposB = db.StringProperty()
    blackregretask = db.BooleanProperty()
    redregretask = db.BooleanProperty()
    blackregretans = db.BooleanProperty()
    redregretans = db.BooleanProperty()

class GameStoreMgr():
    def getGame(self, name):
        return GameStore.get_by_key_name(name) #db.get(db.Key.from_path('GameStore', name))

    def getGames(self):
        return map(lambda g:g.name, db.GqlQuery("SELECT * FROM GameStore WHERE wait = :1", True))

    def newGame(self, name):
        GameStore(key_name = name, name = name, wait = True).put()

    def reSet(self):
        db.delete(db.Query(GameStore, keys_only = True)) #db.delete([g.key() for g in GameStore.all()])

urls = ('/chessxhr', 'chessxhr' ,
        '/(.*)', 'other',
        )

class chessxhr:
    def setserver(self):
        self.data['ret'] = 'success'

    def getgames(self):
        self.data['ret'] = self.mgr.getGames()

    def newgame(self):
        if self.mgr.getGame(self.querys.name):
            self.data['ret'] = 'exist'
        else:
            self.mgr.newGame(self.querys.name)
            self.data['ret'] = 'ok'

    def joingame(self):
        game = self.mgr.getGame(self.querys.name)
        if not game:
            self.data["ret"] = 'nogame'
        elif game.wait == False:
            self.data["ret"] = 'occupy'
        else:
            self.data["ret"] = 'ok'
            game.wait = False
            game.put()

    def listenisbegin(self):
        game = self.mgr.getGame(self.querys.name)
        if game and game.wait == False:
            self.data["ret"] = 'ok'
        else:
            self.data["ret"] = 'wait'

    def move(self):
        game = self.mgr.getGame(self.querys.name)
        setattr(game, self.querys.camp + 'posA', self.querys.posA)
        setattr(game, self.querys.camp + 'posB', self.querys.posB)
        game.put()
        self.data["ret"] = 'ok'

    def regretask(self):
        game = self.mgr.getGame(self.querys.name)
        setattr(game, self.querys.camp + 'regretask', True)
        game.put()
        self.data["ret"] = 'ok'

    def regretans(self):
        game = self.mgr.getGame(self.querys.name)
        setattr(game, self.querys.camp + 'regretans', True if self.querys.ans == 'true' else False)
        game.put()
        self.data["ret"] = 'ok'

    def _enemyCamp(self, suffix):
        if self.querys.camp == 'black': return 'red' + suffix
        else:return 'black' + suffix

    def listencommand(self):
        game = self.mgr.getGame(self.querys.name)
        if not game:
            self.data['ret'] = 'nogame'
            return
        self.data['ret'] = 'ok'
        if getattr(game, self._enemyCamp('posA')) != None:
            self.data['cmd'] = 'move'
            self.data['posA'] = getattr(game, self._enemyCamp('posA'))
            self.data['posB'] = getattr(game, self._enemyCamp('posB'))
            setattr(game, self._enemyCamp('posA'), None)
            setattr(game, self._enemyCamp('posB'), None)
            game.put()
        elif getattr(game, self._enemyCamp('regretask')) != None:
            self.data['cmd'] = 'regretask'
            setattr(game, self._enemyCamp('regretask'), None)
            game.put()
        elif getattr(game, self._enemyCamp('regretans')) != None:
            self.data['cmd'] = 'regretans'
            self.data['ans'] = getattr(game, self._enemyCamp('regretans'))
            setattr(game, self._enemyCamp('regretans'), None)
            game.put()
        else:
            self.data['ret'] = 'wait'

    def gameover(self):
        game = self.mgr.getGame(self.querys.name)
        if game != None:
            game.delete()
            self.data['act'] = 'gameOver_true'
        else:
            self.data['act'] = 'gameOver_false'
        self.data["ret"] = 'ok'

    def reset(self):
        self.mgr.reSet()
        self.data["ret"] = 'ok'

    def GET(self):
        self.querys = web.input(callback = 'callback', action = '')
        self.mgr = GameStoreMgr()
        callback = self.querys.callback
        action = self.querys.action.lower()
        self.data = {'act':action}
        getattr(self, action)()#chessxhr.__dict__[action](self)
        web.header("Content-Type", "text/javascript; charset=UTF-8")
        return "%s(%s)" % (callback, simplejson.dumps(self.data))

class other:
    def GET(self, path):
        return 'hoho,not found!'

application = web.application(urls, globals())

if __name__ == "__main__":
    application.cgirun()
