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
          if(!ghz2){ghz = '0.0';}
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

//データ整形
$(function() {
  var dataArray = ["core","cpuCategory","displayCategory","osTag","resolutionCategory"];
  var outputResult = '';
  $("#mathButton").click(function() {
    //alert(combination(5, 3));
    outputData(dataArray);
  });
  function outputData(state){
    var output = '';
    for(n = 5; n > 0; n--) {
      outputDataArray(dataArray, 5, n);
      /*
      for(j = combination(5, n); j > 0; j--){
        output += '- kind: Tablets\n  properties:\n';
          for(i = 0; i < n; i++) {
            var x = (i + j) - 1;
            if(i <= n){i++;}
            output += '  - name: ' + slice(state,i) + '\n';
          }
        output += '  - name: weight\n\n';
      }
      */
    }
    global.message('ループ完了');
    document.getElementById("matharea").value = outputResult;
  }

  function permutation(n, r){
    for(i = 0, res = 1; i < r; i++){
      res *= n - i;
    }
    return res;
  }
  function combination(n, r){
    return permutation(n, r) / permutation(r, r);
  }

  function next_perm(p, n, r)
  {
    var i, j, k, tmp;
    if(r <= 0 || n < r) return(false);
    for(i = r + 1; i <= n-1; i++)
      for(j = i; j >= r + 1 && p[j-1] < p[j]; j--)
        tmp = p[j], p[j] = p[j-1], p[j-1] = tmp;
    for(i = n - 1; i > 0 && p[i-1] >= p[i]; i--);
    if(!i) return(false);
    for(j = n - 1; j > i && p[i-1] >= p[j]; j--);
    tmp = p[i-1], p[i-1] = p[j], p[j] = tmp;
    for(k = 0; k <= (n-i-1)/2; k++)
      tmp = p[i+k], p[i+k] = p[n-k-1], p[n-k-1] = tmp;
    return(true);
  }

  // xがaの何番目にあるか調べる関数
  function get_pos(a, x)
  {
    var i;
    for(var i=0; i< a.length; i++)
      if(a[i]==x) return(i);  // あるときは、0～a.length-1を返す
    return(-1);               // ないときは、-1を返す
  }

  // 組合せ生成
  function next_comb(c, n, r)
  {
    var i,j,k;
    if(r <= 0 || n < r) return(false);
    var o=new Array(n+1);
    var p=new Array(n+1);
    o=c.slice(0).sort();
    for(i=0; i< n; i++) p[i]='1';
    for(i=0; i< r; i++)
      p[get_pos(o,c[i])]='0';
    var res=next_perm(p, n, n);
    if(!res) n=0;
    for(i=j=0,k=r; i< n; i++)
      if(p[i]=='0') c[j++]=o[i]; else c[k++]=o[i];
    delete o,p;
    return(res);
  }
  function outputDataArray(Array, N, R){
    p=Array.slice(0,N).sort();

    var tm=(new Date()).getTime();  // Timer start
    do{
      var dText = '';
      var d = p.slice(0,R);
      for (i=0; i<d.length; i++) {
        dText += '  - name: ' + d[i] + '\n';
      }
      outputResult += '- kind: Tablets\n  properties:\n' + dText + '  - name: weight\n\n';//  - name: \n
    }while(next_comb(p,N,R));

    tm=(new Date()).getTime()-tm;  // Timer stop
  }

});


