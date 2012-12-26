#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
#Import Section
import cgi
import os
import uuid
import json
import hashlib
import datetime
import os.path
import gqljson
import webapp2
import urllib2

from google.appengine.api.labs import taskqueue
from google.appengine.ext import webapp
from google.appengine.ext.webapp import util
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext.webapp import template
from google.appengine.ext import db
from google.appengine.api import images
from google.appengine.api import memcache
from google.appengine.api import taskqueue
from google.appengine.api import images
from webapp2_extras import sessions
import logging
from google.appengine.api import search
from gaesessions import get_current_session

#Basic Auth
from base64 import b64decode
from google.appengine.ext import webapp

#Import Section END

#Auth Section
class BaseSessionRequestHandler(webapp2.RequestHandler):
    def dispatch(self):
        self.session_store = sessions.get_store(request=self.request)
        try:
            webapp2.RequestHandler.dispatch(self)
        finally:
            self.session_store.save_sessions(self.response)

    @webapp2.cached_property
    def session(self):
        backend = self.session_store.config.get('default_backend','securecookie')
        return self.session_store.get_session(backend=backend)

class BasicAuthentication(BaseSessionRequestHandler):
  def get(self):
    
    if self.session.get('username',0):
      username = self.session.get('username',0)
      self.session['username'] = username
      path = os.path.join(os.path.dirname(__file__), 'index.html')
      template_values = {'username':username}
    else:
      path = os.path.join(os.path.dirname(__file__), 'index.html')
      template_values = {}
    
    self.response.out.write(template.render(path, template_values))

class admin(BaseSessionRequestHandler):
  def get(self):
    if self.__basicAuth():
    
        if self.session.get('username',0):
          username = self.session.get('username',0)
          self.session['username'] = username
          path = os.path.join(os.path.dirname(__file__), 'admin/data.html')
          template_values = {'username':username}
        else:
          path = os.path.join(os.path.dirname(__file__), 'admin/data.html')
          template_values = {}
    
        self.response.out.write(template.render(path, template_values))
    else:
      code = 401
      self.error(code)
      self.response.out.write(self.response.http_status_message(code))

  def __basicAuth(self):
    auth_header = self.request.headers.get('Authorization')
    if auth_header:
      try:
        (scheme, base64) = auth_header.split(' ')
        if scheme != 'Basic':
          return False
        (username, password) = b64decode(base64).split(':')
        if username == 'tullys' and password == 'coffee':
          return True
      except (ValueError, TypeError), err:
        logging.warn(type(err))
        return False

class sencha(BaseSessionRequestHandler):
  def get(self):
    if self.__basicAuth():
    
        if self.session.get('username',0):
          username = self.session.get('username',0)
          self.session['username'] = username
          path = os.path.join(os.path.dirname(__file__), 'sencha/index.html')
          template_values = {'username':username}
        else:
          path = os.path.join(os.path.dirname(__file__), 'sencha/index.html')
          template_values = {}
    
        self.response.out.write(template.render(path, template_values))
    else:
      code = 401
      self.error(code)
      self.response.out.write(self.response.http_status_message(code))

  def __basicAuth(self):
    auth_header = self.request.headers.get('Authorization')
    if auth_header:
      try:
        (scheme, base64) = auth_header.split(' ')
        if scheme != 'Basic':
          return False
        (username, password) = b64decode(base64).split(':')
        if username == 'tullys' and password == 'coffee':
          return True
      except (ValueError, TypeError), err:
        logging.warn(type(err))
        return False

    self.response.set_status(401)
    self.response.headers['WWW-Authenticate'] = 'Basic realm="tablet-hikaku"'
#Auth Section END

#Data Store Section
class Secret(db.Model):
  User_ID = db.StringProperty(multiline=False)
  name = db.StringProperty(multiline=False)
  pw = db.StringProperty(multiline=False)
  answer = db.StringProperty(multiline=False)
  wrong = db.IntegerProperty()
  admin = db.StringProperty(multiline=False)

class Member(db.Model):
  name = db.StringProperty(multiline=False)
  displayName = db.StringProperty(multiline=False)
  URL = db.StringProperty(multiline=False)
  introduction = db.TextProperty()
  commentsNum = db.StringProperty()
  img = db.StringProperty(multiline=False)
  question = db.StringProperty(multiline=False)
  date = db.DateTimeProperty(auto_now_add=True)
  delDate = db.DateTimeProperty(auto_now_add=False)

class Tablets(db.Model):
  product_ID = db.StringProperty(multiline=False)
  com_ID = db.StringProperty(multiline=False)
  registerName = db.StringProperty(multiline=True)
  productName = db.StringProperty(multiline=True)
  makerNo = db.StringProperty(multiline=False)
  manufacturer = db.StringProperty(multiline=True)
  productUrl = db.StringProperty(multiline=False)
  img = db.StringProperty(multiline=False)
  rate = db.IntegerProperty()
  releaseDate = db.StringProperty(multiline=False)
  deviceKind = db.StringProperty(multiline=True)
  os = db.StringProperty(multiline=True)
  osTag = db.StringProperty(multiline=False)
  displaySize = db.FloatProperty()
  displayCategory = db.StringProperty(multiline=False)
  weight = db.IntegerProperty()
  resolutionShort = db.IntegerProperty()
  resolutionCategory = db.StringProperty(multiline=False)
  touchPanel = db.StringProperty(multiline=True)
  cpu = db.StringProperty(multiline=True)
  cpuCategory = db.StringProperty(multiline=False)
  core = db.IntegerProperty()
  ghz = db.FloatProperty()
  memory = db.IntegerProperty()
  storage = db.IntegerProperty()
  views = db.IntegerProperty()
  rankingViews = db.IntegerProperty()
  bookmark = db.IntegerProperty()
  rankingBookmark = db.IntegerProperty()
  date = db.DateTimeProperty(auto_now_add=True)
#Data Store Section END

#API Section
class checkSession(BaseSessionRequestHandler):
  def post(self):  
    
    if self.session.get('username',0):
      username = self.session.get('username',0)
      self.session['username'] = username
      res = username
    else:
      res = "0"
    self.response.out.write(res)

class register(BaseSessionRequestHandler):
  def post(self):
  
    name = self.request.get('name').encode('UTF-8')
    displayName = self.request.get('displayName').encode('UTF-8')
    pw = self.request.get('pw').encode('UTF-8')
    introduction = self.request.get('introduction').encode('UTF-8')
    question = self.request.get('question').encode('UTF-8')
    answer = self.request.get('answer').encode('UTF-8')
    member = Member()
    user = Secret()
    users = db.GqlQuery("SELECT __key__ FROM Secret WHERE name = :1",name)
    if users.count() == 0:
      ID = str(uuid.uuid1())
      user.User_ID = ID
      user.name = name
      user.pw = hashlib.sha256(ID + pw).hexdigest()
      user.answer = hashlib.sha256(ID + answer).hexdigest()
      user.wrong = 0
      user.admin = "0"
      user.put()
      member.name = name
      member.displayName = displayName.decode('UTF-8')
      if displayName == "":
        member.displayName = name
      member.introduction = introduction.decode('UTF-8')
      member.commentsNum = "0"
      member.question = question.decode('UTF-8')
      member.put()
      res = "SUCCEEDED"
      self.session['username'] = name
    else:
      res = "0"
    self.response.out.write(res)
    
class login(BaseSessionRequestHandler):
  def post(self):

    name = self.request.get('name').encode('UTF-8')
    pw = self.request.get('pw').encode('UTF-8')
    users = db.GqlQuery("SELECT * FROM Secret WHERE name = :1 LIMIT 1",name)
    if users.count() != 0:
      user = users.get()
      shapw = hashlib.sha256(user.User_ID + pw).hexdigest()
      if shapw == user.pw:
        res = "1"
        self.session['username'] = name
      else:
        res = "2"
    else:
      res = "0"
    self.response.out.write(cgi.escape(unicode(res, 'UTF-8')))

class logout(BaseSessionRequestHandler):
  def post(self):

    if self.session.get('username',0):
      self.session['username'] = None
      self.response.out.write("0")

class existUserCheck(webapp.RequestHandler):
  def post(self):

    name = self.request.get('name').encode('UTF-8')
    users = db.GqlQuery("SELECT __key__ FROM Member WHERE name = :1",name)
    if users.count() == 0:
      res = "0"
    elif users.count() == 1:
      res = "1"                            
    self.response.out.write(cgi.escape(unicode(res, 'UTF-8')))

class deleteUser(BaseSessionRequestHandler):
  def post(self):
  
    name = self.request.get('name').encode('UTF-8')
    if name == "":
      
      name = self.session.get('username',0)
    if name == None:
      res = "NOSESSION"
    else:
      pw = self.request.get('pw').encode('UTF-8')
      
      users = db.GqlQuery("SELECT * FROM Secret WHERE name = :1 LIMIT 1",name)
      user = users.get()
      
      shapw = hashlib.sha256(user.User_ID + pw).hexdigest()
      
      if users.count() != 0:
        if user.wrong < 3:
          if user.pw == shapw:
            user.answer = "0"
            user.pw = "0"   
            user.put()
            members = db.GqlQuery("SELECT * FROM Member WHERE name = :1 LIMIT 1",name)
            if members.count() != 0:
              member = members.get()
              member.URL = ""
              member.introduction = ""
              member.img = "DELETED"
              member.question = ""
              member.delDate = datetime.datetime.today()
              member.put()
              bookmarks = db.GqlQuery("SELECT __key__ FROM Bookmark WHERE name = :1",name)
              if bookmarks.count != 0:
                db.delete(bookmarks)
              
              if self.session.get('username',0):
                self.session['username'] = None
              
              res = "DELETED"
              
            else:
              res = "MEMBERNOTFOUND"
          else:
            user.wrong = user.wrong + 1
            user.put()
            res = "0"
        else:
          res = "WRONG"
      else:
        res = "NOTFOUND"
        
        #novel = db.GqlQuery("SELECT * FROM Novel WHERE name = :1 LIMIT 1",name)
        #db.delete(novel)
      
    self.response.out.write(res)

class postData(BaseSessionRequestHandler):
  def post(self):
  
    tab = Tablets()
    product_ID = str(uuid.uuid1())
    registerName = self.request.get('registerName').encode('UTF-8')
    com_ID = self.request.get('com_ID').encode('UTF-8')
    comid = db.GqlQuery("SELECT __key__ FROM Tablets WHERE com_ID = :1",com_ID)
    if registerName == None or registerName == "":
      res = "NONAME"
    elif comid.count() == 0:
      productName = self.request.get('productName').encode('UTF-8')
      makerNo = self.request.get('makerNo').encode('UTF-8')
      manufacturer =  self.request.get('manufacturer').encode('UTF-8')
      productUrl =  self.request.get('productUrl').encode('UTF-8')
      img = self.request.get('img').encode('UTF-8')
      rate = self.request.get('rate').encode('UTF-8')
      if rate.isdigit():
        rate = int(rate)
      else:
        rate = 0
      releaseDate = self.request.get('releaseDate').encode('UTF-8')
      displaySize = self.request.get('displaySize').encode('UTF-8')
      if displaySize.replace(".","").isdigit():
        displaySize = float(displaySize)
        if displaySize >= 10:
          displayCategory = 'over10'
        elif displaySize >= 7.1:
          displayCategory = '7.1-9.9'
        else:
          displayCategory = 'under7.1'
      else:
        displaySize = 0
        displayCategory = 'unknown'
      weight = self.request.get('weight').encode('UTF-8')
      if weight.isdigit():
        weight = int(weight)
      else:
        weight = 0
      resolutionShort = self.request.get('resolutionShort').encode('UTF-8')
      if resolutionShort.isdigit():
        resolutionShort = int(resolutionShort)
        if resolutionShort >= 1200:
          resolutionCategory = 'over1200'
        elif resolutionShort >= 800:
          resolutionCategory = '800-1199'
        elif resolutionShort >= 600:
          resolutionCategory = '600-799'
        else:
          resolutionCategory = 'under600'
      else:
        resolutionShort = 0
        resolutionCategory = 'unknown'
      deviceKind = self.request.get('deviceKind').encode('UTF-8')
      os = self.request.get('os').encode('UTF-8')
      touchPanel = self.request.get('touchPanel').encode('UTF-8')
      cpu = self.request.get('cpu').encode('UTF-8')
      core = self.request.get('core').encode('UTF-8')
      if core.isdigit():
        core = int(core)
      else:
        core = 0
      ghz = self.request.get('ghz').encode('UTF-8')
      if ghz.replace(".","").isdigit():
        ghz = float(ghz)
        if ghz >= 1.5:
          cpuCategory = 'over1.5'
        elif ghz >= 1.2:
          cpuCategory = '1.2-1.49'
        elif ghz >= 1.0:
          cpuCategory = '1.0-1.19'
        else:
          if ghz == 0.0:
            cpuCategory = 'unknown'
          else:
            cpuCategory = 'under1.0'
      else:
        ghz = 0.0
        cpuCategory = 'unknown'
      memory = self.request.get('memory').encode('UTF-8')
      if memory.isdigit():
        memory = int(memory)
      else:
        memory = 0
      storage = self.request.get('storage').encode('UTF-8')
      if storage.isdigit():
        storage = int(storage)
      else:
        storage = 0
      tab.product_ID = product_ID.decode('UTF-8')
      tab.com_ID = com_ID.decode('UTF-8')
      tab.registerName = registerName.decode('UTF-8')
      tab.productName = productName.decode('UTF-8')
      tab.makerNo = makerNo.decode('UTF-8')
      tab.manufacturer = manufacturer.decode('UTF-8')
      tab.productUrl = productUrl.decode('UTF-8')
      tab.img = img.decode('UTF-8')
      tab.rate = rate
      tab.releaseDate = releaseDate.decode('UTF-8')
      tab.deviceKind = deviceKind.decode('UTF-8')
      tab.os = os.decode('UTF-8')
      tab.osTag = os[0:3].decode('UTF-8')
      tab.displaySize = displaySize
      tab.displayCategory = displayCategory
      tab.weight = weight
      tab.resolutionShort = resolutionShort
      tab.resolutionCategory = resolutionCategory
      tab.touchPanel = touchPanel.decode('UTF-8')
      tab.cpu = cpu.decode('UTF-8')
      tab.core = core
      tab.ghz = ghz
      tab.cpuCategory = cpuCategory
      tab.memory = memory
      tab.storage = storage
      tab.views = 0
      tab.rankingViews = 0
      tab.bookmark = 0
      tab.rankingBookmark = 0
      tab.put()
      res = 'SUCCEEDED'
    else:
      res = 'ALREADY REGISTERED'
    json_results = gqljson.encode(res)
    self.response.out.write(cgi.escape(unicode(res, 'UTF-8')))

"""
class searchTablet(BaseSessionRequestHandler):
  def post(self):

    tab = Tablet()
  
    username = seclf.request.get('name').encode('UTF-8')
    limit = self.request.get('limit').encode('UTF-8')
    offset = self.request.get('offset').encode('UTF-8')
    
    if username == "":
      
      username = self.session.get('username',0)
    if username == None:
      res = "NOSESSION"
    else:
      username = username.decode('UTF-8')
      if limit:
        if offset:
          tab = db.GqlQuery("SELECT * FROM Tablet WHERE name = :1 AND publish = '0' ORDER BY lastDate DESC",username).fetch(limit=int(limit),offset=int(offset))
        else:
          tab = db.GqlQuery("SELECT * FROM Tablet WHERE name = :1 AND publish = '0' ORDER BY lastDate DESC",username)
      else:
        tab = db.GqlQuery("SELECT * FROM Tablet WHERE name = :1 AND publish = '0' ORDER BY lastDate DESC",username) 
      if tab:
        res = gqljson.GqlEncoder(ensure_ascii=False).encode(tab)
      else:
          res = "0"
    self.response.out.write(res)


class getCategoryCommentList(BaseSessionRequestHandler):
  def post(self):

    comment = Comments()
    username = self.request.get('name').encode('UTF-8')
    category = self.request.get('category').encode('UTF-8')
    limit = self.request.get('limit').encode('UTF-8')
    offset = self.request.get('offset').encode('UTF-8')
    if username == "":
      username = self.session.get('username',0)
    if username == None:
      res = "NOSESSION"
    else:
      username = username.decode('UTF-8')
      if limit:
        if offset:
          comment = db.GqlQuery("SELECT * FROM Comments WHERE category = :1 ORDER BY date DESC",category).fetch(limit=int(limit),offset=int(offset))
        else:
          comment = db.GqlQuery("SELECT * FROM Comments WHERE category = :1 ORDER BY date DESC",category).fetch(limit=int(limit),offset=0)
      else:
        comment = db.GqlQuery("SELECT * FROM Comments WHERE category = :1 ORDER BY date DESC",category) 
      if comment:
        res = gqljson.GqlEncoder(ensure_ascii=False).encode(comment)
      else:
          res = "0"
    self.response.out.write(res)

class getUserCommentList(BaseSessionRequestHandler):
  def post(self):

    comment = Comments()
    username = self.request.get('name').encode('UTF-8')
    limit = self.request.get('limit').encode('UTF-8')
    offset = self.request.get('offset').encode('UTF-8')
    if username == "":
      username = self.session.get('username',0)
    if username == None:
      res = "NOSESSION"
    else:
      username = username.decode('UTF-8')
      if limit:
        if offset:
          comment = db.GqlQuery("SELECT * FROM Comments WHERE name = :1 ORDER BY date DESC",username).fetch(limit=int(limit),offset=int(offset))
        else:
          comment = db.GqlQuery("SELECT * FROM Comments WHERE name = :1 ORDER BY date DESC",username)
      else:
        comment = db.GqlQuery("SELECT * FROM Comments WHERE name = :1 ORDER BY date DESC",username)
      if comment:
        res = gqljson.GqlEncoder(ensure_ascii=False).encode(comment)
      else:
          res = "0"
    self.response.out.write(res)

class addView(webapp.RequestHandler):
  def post(self):

    com_ID = self.request.get('com_ID').encode('UTF-8')
    com_ID = com_ID.decode('UTF-8')
    taskqueue.add(url='/incrementView', params={'com_ID': com_ID})

class incrementView(webapp.RequestHandler):
  def post(self):

    comment = Comments()
    com_ID = self.request.get('com_ID').encode('UTF-8')
    comment = db.GqlQuery("SELECT * FROM Comments WHERE com_ID = :1",com_ID)

    commentData = comment.get()

    if commentData:
      if commentData.views > 0:
        viewNum = commentData.views
        viewNumInt = int(viewNum) + 1
        commentData.views = viewNumInt
        
        #viewNum = commentData.rankingViews
        #viewNumInt = int(viewNum) + 1
        #commentData.rankingViews = viewNumInt
        
        rankNum = commentData.rankingViews
        rankNumInt = int(rankNum) + 1
        commentData.rankingViews = viewNumInt
        commentData.put()
      else:
        commentData.views = 1
        commentData.rankingViews = 1
        commentData.put()

class addBookmark(BaseSessionRequestHandler):
  def post(self):
  
    bookmark = Bookmark()
    name = self.request.get('name').encode('UTF-8')
    if name == "":
      name = self.session.get('username',0)
    if name == None:
      res = "NOSESSION"
    else:
      com_ID = self.request.get('com_ID').encode('UTF-8')
      bookmark.name = name.decode('UTF-8')        
      bookmark.com_ID = com_ID.decode('UTF-8')
      bookmarks = db.GqlQuery("SELECT __key__ FROM Bookmark WHERE name = :1 AND com_ID = :2",name,com_ID)
      if bookmarks.count():
        res = 'REGISTERED'
      else:
        bookmark.name = name.decode('UTF-8')        
        bookmark.com_ID = com_ID.decode('UTF-8')
        bookmark.put()
        taskqueue.add(url='/incrementBookmark', params={'com_ID': com_ID})
        res = 'SUCCEEDED'
    json_results = gqljson.encode(res)
    self.response.out.write(cgi.escape(unicode(res, 'UTF-8')))

class incrementBookmark(webapp.RequestHandler):
  def post(self):
  
    commentData = Comments()
    com_ID = self.request.get('com_ID').encode('UTF-8')
    comment = db.GqlQuery("SELECT * FROM Comments WHERE com_ID = :1 LIMIT 1",com_ID)
    commentData = comment.get()
    commentData.bookmark = commentData.bookmark + 1
    commentData.rankingBookmark = commentData.rankingBookmark + 1
    commentData.put()

class getViewRanking(webapp.RequestHandler):
  def post(self):

    try:
      referer = self.response.headers['Referer']
    except:
      referer = ''

    try:
      origin = self.response.headers['Origin']
    except:
      origin = ''

    comment = Comments()#memcache.get('dailyViewRanking')
    limit = self.request.get('limit').encode('UTF-8')
    offset = self.request.get('offset').encode('UTF-8')

    comments = db.GqlQuery("SELECT * FROM Comments WHERE rankingViews != 0 ORDER BY rankingViews DESC LIMIT 50")
    comment = comments
    if limit:
      if offset:
        comment = comment.fetch(limit=int(limit),offset=int(offset))
      else:
        comment = comment.fetch(limit=int(limit),offset=0)
    else:
      comment = comment.fetch(limit=50,offset=0)
    if comment:
      res = gqljson.GqlEncoder(ensure_ascii=False).encode(comment)
    else:
      res = "0"
    self.response.headers['Access-Control-Allow-Origin'] = '*'
    self.response.headers['Access-Control-Allow-Headers'] = '*'
    self.response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    self.response.headers['Content-Type'] = 'text/plain;charset=UTF-8'
    self.response.out.write(res)


class getBookmarkRanking(webapp.RequestHandler):
  def post(self):
  
    comment = Comments()
    limit = self.request.get('limit').encode('UTF-8')
    offset = self.request.get('offset').encode('UTF-8')
    if limit:
      if offset:
        comment = db.GqlQuery("SELECT * FROM Comments WHERE rankingBookmark > 0 ORDER BY rankingBookmark DESC").fetch(limit=int(limit),offset=int(offset))
      else:
        comment = db.GqlQuery("SELECT * FROM Comments WHERE rankingBookmark > 0 ORDER BY rankingBookmark DESC LIMIT 3")
    else:
      comment = memcache.get('bookmarkRankingNovels')
      if comment is None:
        comment = db.GqlQuery("SELECT * FROM Comments WHERE rankingBookmark > 0 ORDER BY rankingBookmark DESC LIMIT 3")
        memcache.add(key='bookmarkRankingNovels', value=comment, time=600)
    if comment:   
      res = gqljson.GqlEncoder(ensure_ascii=False).encode(comment)
    else:
        res = "0"
    self.response.out.write(res)
"""

class getIpAdress(webapp.RequestHandler):
  def post(self):
    ip = os.environ['REMOTE_ADDR']
    self.response.out.write(ip)
	
class search(BaseSessionRequestHandler):
	def post(self):
	
		osTag = self.request.get('osTag')
		displayCategory = self.request.get('displayCategory')
		resolutionCategory = self.request.get('resolutionCategory')
		weightMin = self.request.get('weightMin').encode('UTF-8')
		weightMax = self.request.get('weightMax').encode('UTF-8')
		cpuCategory = self.request.get('cpuCategory')
		core = self.request.get('core')
		
		osList = []
		displayList = []
		coreList = []
		List = []
		
		osList = osTag.split(",")
		displayList = displayCategory.split(",")
		coreList = core.split(",")
		
		for x in coreList:
			List.append(int(x))
		
		tabData = Tablets.all()
		if len(osList) <3:
			tabData.filter("osTag IN",osList)
		if len(displayList) <3:
			tabData.filter("displayCategory IN",displayList)
		if len(coreList) < 3:
			tabData.filter("core IN",List)
		
		if weightMin:
			tabData.filter("weight >=",int(weightMin))
		if weightMax:
			tabData.filter("weight <=",int(weightMax))
		if resolutionCategory:
			tabData.filter("resolutionCategory =",resolutionCategory)
		if cpuCategory:
			tabData.filter("cpuCategory =",cpuCategory)
			
		self.response.out.write(gqljson.encode(tabData))

#API Section END

#Handler Section
application = webapp.WSGIApplication([('/', BasicAuthentication),
  ('/admin', admin),
  ('/sencha', sencha),
  ('/checkSession', checkSession),
  ('/register', register),
  ('/login', login),
  ('/logout', logout),
  ('/existUserCheck', existUserCheck),
  ('/deleteUser', deleteUser),
  ('/postData', postData),
  ('/search', search),
  #('/getCategoryCommentList', getCategoryCommentList),
  #('/getUserCommentList', getUserCommentList),
  #('/addView', addView),
  #('/incrementView', incrementView),
  #('/addBookmark', addBookmark),
  #('/incrementBookmark', incrementBookmark),
  #('/deleteBookmark', deleteBookmark),
  #('/decrementBookmark', decrementBookmark),
  #('/getViewRanking', getViewRanking),
  #('/getBookmarkRanking', getBookmarkRanking),
  ('/getIpAdress', getIpAdress),
  #('/updateAll', updateAll)
  ],
  debug=True,
  config={'webapp2_extras.sessions':{
    'secret_key':'0miyg9r4n3achza5s9jkdwa9t3khwu97',
    'cookie_name':'tabletSession',
    'session_max_age':2678400,#31Days
    'cookie_args':{
      'max_age':2678400,
      'domain':None,
      'path':'/',
      'secure':None,
      'httponly':None,
    }
  },})

#Handler Section END
