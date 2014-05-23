# -*- coding: UTF-8 -*-
import web
import os.path

app_root = os.path.dirname(__file__)

urls = ('/', 'Index',
        '/app/(.*?)', 'Htmhandler'
        )

def renderfile(filtpath):
    web.header('Content-Type', 'text/html; charset=utf-8')
    return open(app_root + filtpath, 'r').read()

class Index:
    def GET(self):
        return renderfile('/index.htm')

class Htmhandler:
    def GET(self, htmfile):
        return renderfile('/app/'+htmfile)


app = web.application(urls, globals())

if __name__ == "__main__":
    import sys
    if len(sys.argv) == 1:
        sys.argv.append('6272')
    app.run()
