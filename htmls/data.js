//JQM設定
$(document).bind("mobileinit", function(){
  $.mobile.page.prototype.options.backBtnText = "戻る";
  $.mobile.loader.prototype.options.text = "読み込み中...";
  $.mobile.loader.prototype.options.theme = "a";
  $.mobile.loader.prototype.options.textVisible = true;
  $.mobile.pageLoadErrorMessage = "ネットワークエラー";
  $.mobile.pageLoadErrorMessageTheme = "a";
  $.mobile.ajaxEnabled = true;
  $.mobile.defaultTransition = "none";
});

var global = {};
var ip = false;

global.loading = function(state, message){
  var fn;
  if(!message){message = '読み込み中…';}
  if(state){
    fn = $.mobile.loading('show',{
      text: message,
      textVisible: true,
      theme: 'a',
      html: ""
    });
  }
  else{
    fn = $.mobile.loading('hide');
  }
  return fn;
};

global.message = function(message, time){
  if(!time){time = 2000;}
  $.mobile.loading('show',{
    text: message,
    textVisible: true,
    textonly: true,
    theme: 'a',
    html: ""
  });
  setTimeout(function(){
    $.mobile.loading('hide');
  },time);
};

global.url = 'http://tablet-hikaku.appspot.com/';
global.requestURL = 'http://api.coneco.net/cws/v1/SearchProducts_json';
global.apikey = 'd3afb6e79955f93e232f1484456788f9';

//データ登録処理
$(function() {
  var flag = 0;
  $("#dataButton").click(function() {
    var text = $("#conecoURL").val();
    if(text === ""){
      global.message("URLを入力してください");
      return;
    }
    var comIdArray = text.split("=");
    var comId = comIdArray[1];
    if(comId === "" || text.substr(0, 4) != 'http'){
      global.message("URLが不正です");
      return;
    }
    conecoRequest(comId);
  });
  function conecoRequest(comId){
    url = global.requestURL;
    req = {
      "apikey": global.apikey,
      "comId": comId,
      "callback":"?"
    };
    global.loading(true, 'coneco.netから情報を取得中…');
    $.post(url, req, conecoCallback, "jsonp");
  }
  var conecoCallback = function(json){
    global.loading(false);
    var data = {};
    data.com_ID = json.Item[0].ComId;
    data.productName = json.Item[0].Name;
    //data.makeNo = json.Item[0].makeNo;
    data.manufacturer = json.Item[0].Manufacturer;
    data.img = json.Item[0].ImageUrl;
    data.rate = json.Item[0].Review.OverallRating;
    data.releaseDate = json.Item[0].ReleaseDate;
    //スペックの抜き出し
    specData = json.Item[0].Specifications;
    specLength = specData.length;
    var a = specLength;
    for(i = 0; i < specLength; i++){
      var specNo = specData[i].Id.slice(-1);
      switch(specNo){
        case "1":
          data.deviceKind = specData[i].Spec;
          break;
        case "2":
          data.os = specData[i].Spec;
          break;
        case "3":
          var s = specData[i].Spec;
          data.displaySize = s.replace(/インチ/,"");
          break;
        case "4":
          var w = specData[i].Spec;
          w = w.replace(/g/,"");
          if(w.match('k')){
            w = w.replace(/k/,"");
            w = w * 1000;
          }
          data.weight = w;
          break;
        case "6":
          data.resolutionShort = specData[i].Spec;
          break;
        case "7":
          data.touchPanel = specData[i].Spec;
          break;
        case "8":
          var core,ghz;
          var cpu = specData[i].Spec;
          if(cpu.match('デュアルコア')){
            core = "2";
          }
          else if(cpu.match('クアッドコア')){
            core = "4";
          }
          else{
            core = "1";
          }
          var ghz2 = cpu.match(/[0-9].[0-9]{1,}GHz/m);
          if(!ghz2){ghz = 'Unknown';}
          else{ghz = ghz2[0].replace(/GHz/i,"");}
          data.cpu = cpu;
          data.ghz = ghz;
          data.core = core;
          break;
        case "9":
          data.memory = specData[i].Spec.replace(/[G|M]B/i,"");
          break;
        case "0":
          data.storage = specData[i].Spec.replace(/GB/i,"");
          break;
      }
    }
    dataImport(data);
  };
  function dataImport(data){
    url = global.url +"postData";
    req = {
      "registerName": "admin",
      "makerNo" : "",
      "makerUrl" : "",
      "com_ID": data.com_ID,
      "productName": data.productName,
      "manufacturer": data.manufacturer,
      "img": data.img,
      "rate": data.rate,
      "releaseDate": data.releaseDate,
      "deviceKind": data.deviceKind,
      "os": data.os,
      "displaySize": data.displaySize,
      "weight": data.weight,
      "resolutionShort": data.resolutionShort,
      "touchPanel": data.touchPanel,
      "cpu": data.cpu,
      "core": data.core,
      "ghz": data.ghz,
      "memory": data.memory,
      "storage": data.storage,
      "callback": "?"
    };
    global.loading(true, 'データストアに登録中…');
    $.post(url, req, gaeCallback);
  }
  var gaeCallback = function(json){
    global.loading(false);
    document.getElementById("conecoURL").value ='';
    global.message(json, 1000);
  };
});





