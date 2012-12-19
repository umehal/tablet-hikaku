# 中途半端です。cron使ってないです。 
# -*- coding: utf-8 -*-

import cgi
import os
import uuid
import json
import hashlib
import datetime
import os.path
import re

from google.appengine.api.labs import taskqueue
from google.appengine.ext import webapp
from google.appengine.ext.webapp import util
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext.webapp import template
from google.appengine.ext import db
from google.appengine.api import images
from google.appengine.api import memcache
from google.appengine.api import urlfetch

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

class dbReplace(webapp.RequestHandler):
  def get(self):
    tabs = Tablets()#newDB
    tab = Tablet()#oldDB
    tabData = Tablet()

    tabData = db.GqlQuery("SELECT * FROM Tablet WHERE bookmark = 0")
    for tab in tabData:
      r = re.compile("デュアルコア")
      r2 = re.compile("クアッドコア")
      m = r.search(tab.cpu)
      m2 = r2.search(tab.cpu)
      if m:
        tabs.core = 2
      elif m2:
        tabs.core = 4
      else:
        tabs.core = 1
      r3 = re.compile("[0-9].[0-9]{1,}GHz")
      m3 = r3.search(tab.cpu)
      if m3:
        ghz = float(m3.group(0).replace("GHz",""))
      else:
        ghz = 0.0;
      tabs.ghz = ghz
      if tab.weight:
        w = tab.weight.replace("k","000")
        r4 = re.compile(".")
        m4 = r4.search(w)
        if m4:
          w.replace(".","")
          w[:-2]
        else:
          w.replace("g","")
        weight = int(w)
      else:
        weight = 0
      tabs.weight = weight
      if tab.rate.isdigit():
        rate = int(tab.rate)
      else:
        rate = 0
      tabs.rate = rate
      if tab.resolutionShort.isdigit():
        rShort = int(tab.resolutionShort)
      else:
        rShort = 0
      tabs.resolutionShort = rShort
      if tab.displaySize:
        displaySize = tab.displaySize.encode('UTF-8').replace("インチ","")
        displaySize = float(displaySize.decode('UTF-8'))
      else:
        displaySize = 0.0
      tabs.displaySize = displaySize
      if tab.memory:
        memory = tab.memory.encode('UTF-8').replace("GB","")
        memory = memory.replace("MB","")
        memory = int(memory.decode('UTF-8'))
      else:
        memory = 0
      tabs.memory = memory
      if tab.storage:
        storage = tab.storage.encode('UTF-8').replace("GB","")
        storage = int(storage.decode('UTF-8'))
      else:
        storage = 0
      tabs.storage = storage
      tabs.os = tab.os
      tabs.osTag = tab.os[0:3]
      tabs.put()

application = webapp.WSGIApplication([('/cron/dbReplace', dbReplace)],debug=True)