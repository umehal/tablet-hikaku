// JavaScript Document　これはいらないかも
jQuery.postJSON = function(url, data, callback) {
　　jQuery.post(url, data, callback, "json");
};

/*
//GoogleAnalytics設定
//set
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-28887867-3']);//自分のトラッキング IDを入れる

//async
(function () {
  var ga = document.createElement('script'); ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

//data-role='page'が表示されたらトラッキングする
$('[data-role="page"]').live('pageshow', function(){
  var u = location.hash.replace('#', '');
  if(u !== 'list'){//listは重複するので除く
    u ? _gaq.push(['_trackPageview', u]) : _gaq.push(['_trackPageview']);
  }
  else{
    return;
  }
});
//GoogleAnalitics設定おわり
*/

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

global.loading = function(state){
  var fn;
  if(state){
    fn = $.mobile.loading('show',{
      text: '読み込み中…',
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

global.message = function(message,time){
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



/*
//セッションチェック
$(function() {
  url = "http://em-home.appspot.com/checkSession";
  req = {
    "callback":"?"
  };
  $.post(url, req, checkCallback);
});
var checkCallback = function(json){
  if(json == "0"){
    $(".userInfo").html('未ログインです');
  }
  else{
    global.userName = json;
    $(".userInfo").html(json + 'としてログイン中です');
  }
  var url = location.hash;
  if(url.substr(0,5) === "#list"){
    location.href = "#home";
    location.reload(true);
  }
};

//IPアドレスチェック
$(function() {
  url = "http://em-home.appspot.com/getIpAdress";
  req = {
    "callback":"?"
  };
  if(!ip){
    $.post(url, req, ipCallback);
  }
  else{
    return;
  }
});
var ipCallback = function(json){
  global.ipAdress = json;
  ip = true;
};
*/

//ホーム画面の処理
$(function() {
  var viewsJson,bookJson;
  var bookmarkClick = 0;
  var bookmarkCount;
  $(document).ready(function(){
    $("#viewsListView").html('');
    $("#bookListView").html('');
    var viewsMs = '<li id="liHead" data-role="list-divider" role="heading">アクセスランキング(Weekly)</li>';
    //var bookMs = '<li id="liHead" data-role="list-divider" role="heading">いいねランキング</li>';
    $('<li>').html(viewsMs).appendTo('#viewsListView');
    //$('<li>').html(bookMs).appendTo('#bookListView');
    loadRankingList(3,0);
    //loadBookmarkRankingList(3,0);
  });
  function loadRankingList(lim,off){
    url = "http://em-home.appspot.com/getViewRanking";
    req = {
      "limit":lim,
      "offset":off,
      "callback":"?"
    };
    global.loading(true);
    $.post(url, req, VWcallback,"json");
  }
  var VWcallback = function(json){
    if(json === 0){
      $('#viewsListView').html('<p class="noData">まだコメントはありません</p>');
      return;
    }
    $.each(json, function(i, item) {
      viewsJson = json;
      imgName = 'crown' + (i + 1) + '.png';
      bodyText = this.body.replace(/\r\n/g,"\n");
      bodyText = bodyText.replace(/\r/g,"\n");
      bodyText = bodyText.replace(/\n/g,"");
      if(bodyText.length > 40){
        bodyText = bodyText.substr(0,40) + "...<span class='moreBody'>　続きあり</span>";
      }
      catImg = this.category + '.png';
      /*
      bodyText = bodyText.replace(/。/g,"。\n");
      bodyText = bodyText.replace(/\n\n/g,"\n");
      caption = bodyText.split("\n");
      if(caption.length < 3){
        bodyText = bodyText.replace(/\n/g,"<br>");
      }
      else{
        bodyText = caption[0] + "<br>" + caption[1] + "<span class='moreBody'>　...続きあり</span>";
      }
      */
      message = '<a href="#" class="rankingLink" data-transition="pop" data-rel="popup"><table class="comInfoRank"><tr><td><div id="rankingImg"><img src="htmls/img/' + imgName +'" /></div><div id="rankingCrownNum">' + (i + 1) +'</div></td><td><p class="comTitleRank"><img src="htmls/img/' + catImg +'" /><span>'
      + this.title
      + '</span><p class="comBodyRank">'
      + bodyText//this.body
      + '</p><p class="comDataRank">アクセス数:'
      + this.views
      + '　★'
      + this.bookmark
      + '<span class="comTimeRank">日時:'
      + formatDate(this.date.isoformat)
      + '</span></p></td></tr></table></a> ';
      //str = str + message;
      $('<li>').html(message).appendTo('#viewsListView');
      message = "";
    });
    var more = '<a href="#" class="rankingMore"><div class="moreRank">もっと見る</div></a>';
    $('<li>').html(more).appendTo('#viewsListView');
    global.loading(false);
  };
  function loadBookmarkRankingList(lim,off){
    url = "http://em-home.appspot.com/getBookmarkRanking";
    req = {
      "limit":lim,
      "offset":off,
      "callback":"?"
    };
    $.post(url, req, BKcallback,"json");
  }
  var BKcallback = function(json){
    $("#viewBRank1").html('');
    $("#viewBRank2").html('');
    $("#viewBRank3").html('');
    $("#viewBRank1").html(json[0].title + '(' + json[0].rankingBookmark + ')');
    $("#viewBRank2").html(json[1].title + '(' + json[1].rankingBookmark + ')');
    $("#viewBRank3").html(json[2].title + '(' + json[2].rankingBookmark + ')');
  };
  //ランキングの各ラベルクリック時の処理
  $(".rankingLink").live("click", function(){
    var index = $(".rankingLink").index(this);
    var json = viewsJson[index];
    var bodyText = json.body.replace(/\r\n/g,"\n");
    bodyText = bodyText.replace(/\r/g,"\n");
    bodyText = bodyText.replace(/\n/g,"<br>");
    viewCountup(json.com_ID);
    json.views++;
    //GoogleAnalitics
    var u = "#comInfoRanking&" + json.title;
    u ? _gaq.push(['_trackPageview', u]) : _gaq.push(['_trackPageview']);
    //$("#commentHeaderLabel").html('');
    $("#commentNameRank").html('');
    $("#commentTitleRank").html('');
    $("#commentDateRank").html('');
    $("#commentBodyTextRank").html('');
    $("#commentViewsRank").html('');
    $("#commentBookmarksRank").html('');
    //$("#commentHeaderLabel").html(json.title);
    $("#commentNameRank").html("@" + json.name);
    $("#commentDateRank").html(formatDate(json.date.isoformat));
    $("#commentTitleRank").html(json.title);
    $("#commentBodyTextRank").html(bodyText);
    $("#commentViewsRank").html("アクセス数: " + json.views);
    $("#commentBookmarksRank").html("いいね: " + json.bookmark);
    $("#commentPageRank").popup("open");
    $("#likeButtonRank").attr("name",json.com_ID);
    bookmarkCount = json.bookmark;
  });
  $("#closeButtonRank").live("click", function(){
    $( "#commentPageRank" ).popup( "close" );
  });
  $("#likeButtonRank").live("click", function(){
    var name;
    if(global.userName){
      name = global.userName;
    }
    else{
      name = navigator.userAgent + ' /' + global.ipAdress;
    }
    if(bookmarkClick === 0){
      bookmarkClick++;
      bookmarkCountup(name,this.name);
    }
    else{
      return;
    }
  });
  function viewCountup(state){
    url = "http://em-home.appspot.com/addView";
    req = {
      "com_ID":state,
      "callback":"?"
    };
    $.post(url, req, callbackView);
  }
  var callbackView = function(){
    //カウント完了のコールバックは特にしない
  };
  function bookmarkCountup(name,state){
    url = "http://em-home.appspot.com/addBookmark";
    req = {
      "name":name,
      "com_ID":state,
      "callback":"?"
    };
    global.loading(true);
    $.post(url, req, callbackBookmark);
  }
  var callbackBookmark = function(res){
    global.loading(false);
    if(res == "SUCCEEDED"){
      $("#commentBookmarks").html("いいね: " + (bookmarkCount+1));
    }
    else{
      global.message('「いいね！」は、ひとつの記事に対して一度だけです');
    }
    bookmarkClick = 0;
  };

  //もっと見るボタン(view)の処理
  $(".rankingMore").live("click", function(){
    global.tempCategory = 'ranking';
    var u = "#list&" + 'rankingMore';
    u ? _gaq.push(['_trackPageview', u]) : _gaq.push(['_trackPageview']);
    $.mobile.changePage("#list",{
      showLoadMsg: true,
      transition: "none"
    });
  });

  //カテゴリボタンクリック時の処理
  $("#homeListButton").live("click", function(){
    /*
    var next = $("#list");
    location.href = "#list?&" + this.name;
    localStorage['tempDB'] = this.name;
    */
    global.tempCategory = this.name;
    global.tempCategoryName = this.text;
    //GoogleAnalitics
    var u = "#list&" + this.name;
    u ? _gaq.push(['_trackPageview', u]) : _gaq.push(['_trackPageview']);
    $.mobile.changePage("#list",{
      transition: "none"
    });
  });

  //ログアウト中に投稿ボタンをクリックした時の処理
  $("#homeSubmitButtonLogout").live("click", function(){
    global.message("投稿するにはログインが必要です");
    /*
    $.mobile.changePage("#signinPanel",{
      transition: "slideup"
    });
    */
  });

  //ログインボタンクリック時の処理
  var flag = 0;
  $("#signinButton").live("click", function(){
    if($("#signinUserID").val() !== "" && $("#signinPass").val() !== ""){
      if(flag === 0){
        flag++;
        setTimeout(function(){
          flag = 0;
        },5000);
        url = "http://em-home.appspot.com/login";
        req = {
          "name":$("#signinUserID").val(),
          "pw":$("#signinPass").val(),
          "callback":"?"
        };
        $.post(url, req, callback,"json");
      }
    }
    else{
      global.message("未入力の項目があります");
      flag = 0;
    }
  });
  var callback = function(json){
    if(json === 0){
      global.message("存在しないユーザー名です");
      flag = 0;
    }
    else if(json === 2){
      global.message("確認用パスワードが一致しません");
      flag = 0;
    }
    else{
      document.getElementById("signinUserID").value ='';
      document.getElementById("signinPass").value ='';
      flag = 0;
      location.href = "#home";
      location.reload(true);
    }
  };

  //ログアウトボタンクリック時の処理
  var outFlag = 0;
  $("#homeSignoutButton").live("click", function(){
    if(outFlag === 0){
      outFlag++;
      setTimeout(function(){
        outFlag = 0;
      },3000);
      url = "http://em-home.appspot.com/logout";
      req = {
        "callback":"?"
      };
      $.post(url, req, outCallback,"json");
    }
  });
  var outCallback = function(json){
    if(json === 0){
      location.href = "http://em-home.appspot.com/";
      outFlag = 0;
    }
  };
});
//ホーム画面の処理おわり

//新規登録処理
$(function() {
  var flag = 0;
  $("#signupButton").click(function() {
    var cbCheck = $("#agree").attr("checked");
    if($("#signupUserID").val() !== "" && $("#signupPass").val() !== "" && $("#signupPass2").val() !== ""){
      if( $("#signupUserID").val().length < 4 || $("#signupUserID").val().length > 30){
        global.message("ユーザー名は4文字以上、30文字以下でお願いします");
      }
      else if($("#signupPass").val().length < 4 || $("#signupPass").val().length > 20){
        global.message("パスワードは4文字以上、20文字以下でお願いします");
      }
      else if($("#signupPass").val() == $("#signupPass2").val()){
        if(!cbCheck){
          global.message("利用規約に同意が必要です");
        }
        else if(flag === 0){
          flag++;
          setTimeout(function(){
            flag = 0;
          },5000);
          url = "http://em-home.appspot.com/register";
          req = {
            "name":$("#signupUserID").val(),
            "pw":$("#signupPass").val(),
            "displayName":"",
            "question":"",
            "answer":"",
            "introduction":"",
            "callback":"?"
          };
          global.loading(true);
          $.post(url, req, callback);
        }
      }
      else{
        global.message("パスワードが一致しません");
      }
    }
    else{
      global.message("未入力の項目があります");
    }
  });
  var callback = function(json){
    global.loading(false);
    if(json == "0"){
      global.message("そのユーザー名はすでに使用されています",3000);
      flag = 0;
    }else{
      global.message("ユーザー登録が完了しました");
      document.getElementById("signupUserID").value ='';
      document.getElementById("signupPass").value ='';
      document.getElementById("signupPass2").value ='';
      flag = 0;
      setTimeout(function(){
        location.href = "#home";
        location.reload(true);
      },1000);
    }
  };
});
//新規登録処理おわり

//新規投稿処理
$(function() {
  var flag = 0;
  var countMax = 600;
  $("#body").bind('keydown keyup keypress change', function(){
    var bodyLength = $(this).val().length;
    //var countDown = (countMax) - (bodyLength);
    $(".count").html(bodyLength);

    if(countMax < bodyLength){
      $(".count").css({color: 'red', fontWeight: 'bold'});
    }
    else{
      $(".count").css({color: '#000', fontWeight: 'normal'});
    }
  });
  /*
  $(document).delegate("#toukou", "pagebeforeshow", function(){
    $(".count").html(countMax);
  });
  */

  //投稿ボタンクリック時
  $("#postButton").click(function() {
    if($("#title").val() !== "" && $("#body").val() !== ""){
      if($("#title").val().length > 20){
        global.message("タイトルは20文字までです");
      }
      else if($("#body").val().length > 600){
        global.message("本文は600文字までです");
      }
      else if(flag === 0){
        flag++;
        setTimeout(function(){
          flag = 0;
        },5000);
        url = "http://em-home.appspot.com/postComment";
        req = {
          "displayName":"",
          "name":"",
          "ua":navigator.userAgent,
          "title":$("#title").val(),
          "body":$("#body").val(),
          "category":$("#select").val(),
          "callback":"?"
        };
        global.loading(true);
        $.post(url, req, callback);
      }
    }
    else{
      global.message("未入力の項目があります");
    }
  });
  var callback = function(json){
    global.loading(false);
    if(json == "0"){
      global.message("投稿に失敗しました\nやり直してください");
      flag = 0;
    }else{
      document.getElementById("title").value ='';
      document.getElementById("body").value ='';
      flag = 0;
      global.tempCategory = $("#select").val();
      $.mobile.changePage("#list", "none", false, false);
      //location.reload(true);
      global.message("投稿が完了しました");
    }
  };
});
//新規投稿処理おわり

//list処理
$(function() {
  var resJson;
  var bookmarkClick = 0;
  var bookmarkCount;
  var lim, off, cat;
  $(document).delegate("#list", "pagebeforeshow", function(){
    $("#catListView").html('<center><h4 class="listLoading">読み込み中…</h4></center>');//画像入れるならこれを追加 <img class="ajaxLoading" src="htmls/img/ajax-loader.gif"/ >
    if($('#listPostButton').size()){
      document.getElementById('listPostButton').style.display = "block";
    }
    lim = 10;
    off = 0;
    cat = global.tempCategory;
    if(cat !== 'ranking'){
      loadCategoryList(cat, lim, off);
    }
    else{
      loadRankingList(20, 0);
      if($('#listPostButton').size()){
        document.getElementById('listPostButton').style.display = "none";
      }
    }
    switch(cat){
      case "ochi":
        $("#listHeaderLabel").html('オチのある話');
        break;
      case "fukaii":
        $("#listHeaderLabel").html('じーんとくる話');
        break;
      case "renai":
        $("#listHeaderLabel").html('惚れた腫れた物語');
        break;
      case "jiman":
        $("#listHeaderLabel").html('ここだけの自慢話');
        break;
      case "kuchikomi":
        $("#listHeaderLabel").html('口コミ情報');
        break;
      case "2013":
        $("#listHeaderLabel").html('2013年の抱負！');
        break;
      case "ranking":
        $("#listHeaderLabel").html('ランキング');
        break;
    }
  });
  $("#moreRead").live("click", function(){
    loadCategoryList(cat, lim, off);
  });

  function loadCategoryList(cat, lim, off){
    url = "http://em-home.appspot.com/getCategoryCommentList";
    req = {
      "name":"test",
      "category":cat,
      "limit":lim,
      "offset":off,
      "callback":"?"
    };
    global.loading(true);
    $.post(url, req, callback,"json");
  }
  function loadRankingList(lim, off){
    url = "http://em-home.appspot.com/getViewRanking";
    req = {
      "limit":lim,
      "offset":off,
      "callback":"?"
    };
    global.loading(true);
    $.post(url, req, callback,"json");
  }
  var callback = function(json){
     $("#catListView").html('');
    global.loading(false);
    off = off + json.length;
    resJson = json;
    if(json === 0){
      if(off === 0){
        $('#catListView').html('<p class="noData">まだコメントはありません</p>');
        return;
      }
      else{return;}
    }
    var icount = json.length;
    if(icount < 9 || icount === null || global.tempCategory === 'ranking'){
      document.getElementById('moreRead').style.display = "none";
    }else{
      document.getElementById('moreRead').style.display = "block";
    }
    $.each(json, function(i, item) {
      bodyText = this.body.replace(/\r\n/g,"\n");
      bodyText = bodyText.replace(/\r/g,"\n");
      bodyText = bodyText.replace(/\n/g,"");
      if(bodyText.length > 40){
        bodyText = bodyText.substr(0,40) + "...<span class='moreBody'>　続きあり</span>";
      }
      var rank = '';
      var cat = '';
      var spanEnd = '';
      var titleClass = 'comTitle';
      var n = i + 1;
      if(global.tempCategory === 'ranking'){
        cat = '<img src="htmls/img/' + this.category +'.png" /><span>';
        spanEnd = '</span>';
        titleClass = 'comTitleRank';
        if(i < 3){
          rank = '<td><div id="rankingImg"><img src="htmls/img/crown' + n +'.png" /></div><div id="rankingCrownNum">' + n +'</div></td>';
        }
        else{
          rank = '<td><div id="rankingRound">　</div><div id="rankingNum">' + n +'</div></td>';
        }
      }
      /*
      bodyText = bodyText.replace(/。/g,"。\n");
      bodyText = bodyText.replace(/\n\n/g,"\n");
      caption = bodyText.split("\n");
      if(caption.length < 3){
        bodyText = bodyText.replace(/\n/g,"<br>");
      }
      else{
        bodyText = caption[0] + "<br>" + caption[1] + "<span class='moreBody'>　...続きあり</span>";
      }
      */
      message = '<a href="#" data-transition="pop" data-rel="popup"><table class="comInfo"><tr>' + rank + '<td><p class="' + titleClass + '">'
      + cat
      + this.title
      + spanEnd
      + '<p class="comBody">'
      + bodyText
      + '</p><p class="comData">アクセス数:'
      + this.views
      + '　★'
      + this.bookmark
      + '<span class="comTime">日時:'
      + formatDate(this.date.isoformat)
      + '</span></p></td></tr></table></a> ';
      $('<li>').html(message).appendTo('#catListView');
      message = "";
    });
  };
  $(".comInfo").live("click", function(){
    var index = $(".comInfo").index(this);
    var json = resJson[index];
    var bodyText = json.body.replace(/\r\n/g,"\n");
    bodyText = bodyText.replace(/\r/g,"\n");
    bodyText = bodyText.replace(/\n/g,"<br>");
    viewCountup(json.com_ID);
    json.views++;
    //GoogleAnalitics
    var u = "#comInfo&" + json.title;
    u ? _gaq.push(['_trackPageview', u]) : _gaq.push(['_trackPageview']);
    //$("#commentHeaderLabel").html('');
    $("#commentName").html('');
    $("#commentDate").html('');
    $("#commentTitle").html('');
    $("#commentBodyText").html('');
    $("#commentViews").html('');
    $("#commentBookmarks").html('');
    //$("#commentHeaderLabel").html(json.title);
    $("#commentName").html("@" + json.name);
    $("#commentDate").html(formatDate(json.date.isoformat));
    $("#commentTitle").html(json.title);
    $("#commentBodyText").html(bodyText);
    $("#commentViews").html("アクセス数: " + json.views);
    $("#commentBookmarks").html("いいね: " + json.bookmark);
    $("#commentPage").popup("open");
    $("#likeButton").attr("name",json.com_ID);
    bookmarkCount = json.bookmark;
  });
  $("#closeButton").live("click", function(){
    $( "#commentPage" ).popup( "close" );
  });
  $("#likeButton").live("click", function(){
    var name;
    if(global.userName){
      name = global.userName;
    }
    else{
      name = navigator.userAgent + ' /' + global.ipAdress;
    }
    if(bookmarkClick === 0){
      bookmarkClick++;
      bookmarkCountup(name,this.name);
    }
    else{
      return;
    }
  });
  function viewCountup(state){
    url = "http://em-home.appspot.com/addView";
    req = {
      "com_ID":state,
      "callback":"?"
    };
    $.post(url, req, callbackView);
  }
  var callbackView = function(){
    //カウント完了のコールバックは特にしない
  };
  function bookmarkCountup(name,state){
    url = "http://em-home.appspot.com/addBookmark";
    req = {
      "name":name,
      "com_ID":state,
      "callback":"?"
    };
    global.loading(true);
    $.post(url, req, callbackBookmark);
  }
  var callbackBookmark = function(res){
    global.loading(false);
    if(res == "SUCCEEDED"){
      $("#commentBookmarks").html("いいね: " + (bookmarkCount+1));
    }
    else{
      global.message('「いいね！」は、ひとつの記事に対して一度だけです');
    }
    bookmarkClick = 0;
  };
});
//list処理終わり

//投稿画面表示の処理
$(function() {
  $(document).delegate("#toukou", "pagebeforeshow", function(){
    if(!global.tempCategory){global.tempCategory = "ochi";}
    $("#select").val(global.tempCategory);
    $("#select").selectmenu('refresh',true);
  });
});
//投稿画面表示の処理おわり

//退会画面の処理
$(function() {
  var flag = 0;
  $("#deleteButton").click(function() {
    var cbCheck = $("#agree").attr("checked");
    if($("#deletePass").val() !== "" && $("#deletePass2").val() !== ""){
      if($("#deletePass").val().length < 4 || $("#deletePass").val().length > 20){
        global.message("正しいパスワードを入力してください");
      }
      else if($("#deletePass").val() == $("#deletePass2").val()){
        if(flag === 0){
          if(confirm("本当によろしいですか？\n退会後はデータの復旧はできません")){
            flag++;
            setTimeout(function(){
              flag = 0;
            },5000);
            url = "http://em-home.appspot.com/deleteUser";
            req = {
              "name":"",
              "pw":$("#deletePass").val(),
              "callback":"?"
            };
            global.loading(true);
            $.post(url, req, callback);
          }
        }
      }
      else{
        global.message("確認用パスワードが一致しません");
        flag = 0;
      }
    }
    else{
      global.message("未入力の項目があります");
      flag = 0;
    }
  });
  var callback = function(json){
    global.loading(false);
    if(json == "0"){
      global.message("退会に失敗しました\n内容を確認してやり直してください",3000);
      flag = 0;
    }
    else if(json == "NOTFOUND" || json == "MEMBERNOTFOUND"){
      global.message("すでに退会済か存在しないユーザーです");
      flag = 0;
    }
    else if(json == "DELETED"){
      global.message("退会が完了しました");
      document.getElementById("deletePass").value ='';
      document.getElementById("deletePass2").value ='';
      flag = 0;
      setTimeout(function(){
        location.href = "#home";
        location.reload(true);
      },1000);
    }
    else{
      global.message("退会に失敗しました\n時間を置いてやり直してください");
      flag = 0;
    }
  };
});
//退会画面の処理

//時間変換のファンクション
function utc2jst(utc) {
  return new Date(utc.getTime() + 9*60*60*1000);
}
function W3CDTFtoDate(w3cdtf) {
  var m = w3cdtf.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
  var date = new Date(m[1], m[2] - 1, m[3], m[4], m[5], m[6]);
  date.setTime(date.getTime() + 9 * 60 * 60 * 1000);
  return date;
}
function formatDate(date){
  var userAgent = window.navigator.userAgent.toLowerCase();
  var appVersion = window.navigator.appVersion.toLowerCase();
  jst = date;
  date = W3CDTFtoDate(jst);
  if (userAgent.indexOf("firefox") > -1) {
    jst = utc2jst(date);
  }
  var create = date.toString().replace(/:/g, " ");
  var created_at = create.split(" ");
  
  if(created_at[1] == "Jan") created_at[1] = "01";
  if(created_at[1] == "Feb") created_at[1] = "02";
  if(created_at[1] == "Mar") created_at[1] = "03";
  if(created_at[1] == "Apr") created_at[1] = "04";
  if(created_at[1] == "May") created_at[1] = "05";
  if(created_at[1] == "Jun") created_at[1] = "06";
  if(created_at[1] == "Jul") created_at[1] = "07";
  if(created_at[1] == "Aug") created_at[1] = "08";
  if(created_at[1] == "Sep") created_at[1] = "09";
  if(created_at[1] == "Oct") created_at[1] = "10";
  if(created_at[1] == "Nov") created_at[1] = "11";
  if(created_at[1] == "Dec") created_at[1] = "12";
  
  var post_date  = String(created_at[3]) + "/"
           + String(created_at[1]) + "/"
           + String(created_at[2]) + " "
           + String(created_at[4]) + ":"
           + String(created_at[5]);

  return String(post_date);
}
//時間変換のファンクションおわり

$.widget('mobile.tabbar', $.mobile.navbar, {
  _create: function() {
    // Set the theme before we call the prototype, which will
    // ensure buttonMarkup() correctly grabs the inheritied theme.
    // We default to the "a" swatch if none is found
    var theme = this.element.jqmData('theme') || "a";
    this.element.addClass('ui-footer ui-footer-fixed ui-bar-' + theme);

    // Make sure the page has padding added to it to account for the fixed bar
    this.element.closest('[data-role="page"]').addClass('ui-page-footer-fixed');


    // Call the NavBar _create prototype
    $.mobile.navbar.prototype._create.call(this);
  },

  // Set the active URL for the Tab Bar, and highlight that button on the bar
  setActive: function(url) {
    // Sometimes the active state isn't properly cleared, so we reset it ourselves
    this.element.find('a').removeClass('ui-btn-active ui-state-persist');
    this.element.find('a[href="' + url + '"]').addClass('ui-btn-active ui-state-persist');
  }
});

$(document).bind('pagecreate create', function(e) {
  return $(e.target).find(":jqmData(role='tabbar')").tabbar();
});

$(":jqmData(role='page')").live('pageshow', function(e) {
  // Grab the id of the page that's showing, and select it on the Tab Bar on the page
  var tabBar, id = $(e.target).attr('id');

  tabBar = $.mobile.activePage.find(':jqmData(role="tabbar")');
  if(tabBar.length) {
    tabBar.tabbar('setActive', '#' + id);
  }
});

var attachEvents = function() {
var hoverDelay = $.mobile.buttonMarkup.hoverDelay, hov, foc;

$( document ).bind( {
	"vmousedown vmousecancel vmouseup vmouseover vmouseout focus blur scrollstart": function( event ) {
		var theme,
			$btn = $( closestEnabledButton( event.target ) ),
			evt = event.type;
	
		if ( $btn.length ) {
			theme = $btn.attr( "data-" + $.mobile.ns + "theme" );
	
			if ( evt === "vmousedown" ) {
				if ( $.support.touch ) {
					hov = setTimeout(function() {
						$btn.removeClass( "ui-btn-up-" + theme ).addClass( "ui-btn-down-" + theme );
					}, hoverDelay );
				} else {
					$btn.removeClass( "ui-btn-up-" + theme ).addClass( "ui-btn-down-" + theme );
				}
			} else if ( evt === "vmousecancel" || evt === "vmouseup" ) {
				$btn.removeClass( "ui-btn-down-" + theme ).addClass( "ui-btn-up-" + theme );
			} else if ( evt === "vmouseover" || evt === "focus" ) {
				if ( $.support.touch ) {
					foc = setTimeout(function() {
						$btn.removeClass( "ui-btn-up-" + theme ).addClass( "ui-btn-hover-" + theme );
					}, hoverDelay );
				} else {
					$btn.removeClass( "ui-btn-up-" + theme ).addClass( "ui-btn-hover-" + theme );
				}
			} else if ( evt === "vmouseout" || evt === "blur" || evt === "scrollstart" ) {
				$btn.removeClass( "ui-btn-hover-" + theme  + " ui-btn-down-" + theme ).addClass( "ui-btn-up-" + theme );
				if ( hov ) {
					clearTimeout( hov );
				}
				if ( foc ) {
					clearTimeout( foc );
				}
			}
		}
	},
	"focusin focus": function( event ){
		$( closestEnabledButton( event.target ) ).addClass( $.mobile.focusClass );
	},
	"focusout blur": function( event ){
		$( closestEnabledButton( event.target ) ).removeClass( $.mobile.focusClass );
	}
});

attachEvents = null;
};

$.fn.buttonMarkup = function( options ) {
var $workingSet = this;

// Enforce options to be of type string
options = ( options && ( $.type( options ) == "object" ) )? options : {};
for ( var i = 0; i < $workingSet.length; i++ ) {
	var el = $workingSet.eq( i ),
		e = el[ 0 ],
		o = $.extend( {}, $.fn.buttonMarkup.defaults, {
			icon:       options.icon       !== undefined ? options.icon       : el.jqmData( "icon" ),
			iconpos:    options.iconpos    !== undefined ? options.iconpos    : el.jqmData( "iconpos" ),
			theme:      options.theme      !== undefined ? options.theme      : el.jqmData( "theme" ) || $.mobile.getInheritedTheme( el, "c" ),
			inline:     options.inline     !== undefined ? options.inline     : el.jqmData( "inline" ),
			shadow:     options.shadow     !== undefined ? options.shadow     : el.jqmData( "shadow" ),
			corners:    options.corners    !== undefined ? options.corners    : el.jqmData( "corners" ),
			iconshadow: options.iconshadow !== undefined ? options.iconshadow : el.jqmData( "iconshadow" ),
			iconsize:   options.iconsize   !== undefined ? options.iconsize   : el.jqmData( "iconsize" ),
			mini:       options.mini       !== undefined ? options.mini       : el.jqmData( "mini" )
		}, options ),

		// Classes Defined
		innerClass = "ui-btn-inner",
		textClass = "ui-btn-text",
		buttonClass, iconClass,
		// Button inner markup
		buttonInner,
		buttonText,
		buttonIcon,
		buttonElements;

	$.each(o, function(key, value) {
		e.setAttribute( "data-" + $.mobile.ns + key, value );
		el.jqmData(key, value);
	});

	// Check if this element is already enhanced
	buttonElements = $.data(((e.tagName === "INPUT" || e.tagName === "BUTTON") ? e.parentNode : e), "buttonElements");

	if (buttonElements) {
		e = buttonElements.outer;
		el = $(e);
		buttonInner = buttonElements.inner;
		buttonText = buttonElements.text;
		// We will recreate this icon below
		$(buttonElements.icon).remove();
		buttonElements.icon = null;
	}
	else {
		buttonInner = document.createElement( o.wrapperEls );
		buttonText = document.createElement( o.wrapperEls );
	}
	buttonIcon = o.icon ? document.createElement( "span" ) : null;

	if ( attachEvents && !buttonElements) {
		attachEvents();
	}
	
	// if not, try to find closest theme container	
	if ( !o.theme ) {
		o.theme = $.mobile.getInheritedTheme( el, "c" );	
	}		

	buttonClass = "ui-btn ui-btn-up-" + o.theme;
	buttonClass += o.inline ? " ui-btn-inline" : "";
	buttonClass += o.shadow ? " ui-shadow" : "";
	buttonClass += o.corners ? " ui-btn-corner-all" : "";

	if ( o.mini !== undefined ) {
		// Used to control styling in headers/footers, where buttons default to `mini` style.
		buttonClass += o.mini ? " ui-mini" : " ui-fullsize";
	}
	
	if ( o.inline !== undefined ) {			
		// Used to control styling in headers/footers, where buttons default to `mini` style.
		buttonClass += o.inline === false ? " ui-btn-block" : " ui-btn-inline";
	}
	
	
	if ( o.icon ) {
		o.icon = "ui-icon-" + o.icon;
		o.iconpos = o.iconpos || "left";

		iconClass = "ui-icon " + o.icon;

		if ( o.iconshadow ) {
			iconClass += " ui-icon-shadow";
		}

		if ( o.iconsize ) {
			iconClass += " ui-iconsize-" + o.iconsize;
		}
	}

	if ( o.iconpos ) {
		buttonClass += " ui-btn-icon-" + o.iconpos;

		if ( o.iconpos == "notext" && !el.attr( "title" ) ) {
			el.attr( "title", el.getEncodedText() );
		}
	}
  
	innerClass += o.corners ? " ui-btn-corner-all" : "";

	if ( o.iconpos && o.iconpos === "notext" && !el.attr( "title" ) ) {
		el.attr( "title", el.getEncodedText() );
	}

	if ( buttonElements ) {
		el.removeClass( buttonElements.bcls || "" );
	}
	el.removeClass( "ui-link" ).addClass( buttonClass );

	buttonInner.className = innerClass;

	buttonText.className = textClass;
	if ( !buttonElements ) {
		buttonInner.appendChild( buttonText );
	}
	if ( buttonIcon ) {
		buttonIcon.className = iconClass;
		if ( !(buttonElements && buttonElements.icon) ) {
			buttonIcon.appendChild( document.createTextNode("\u00a0") );
			buttonInner.appendChild( buttonIcon );
		}
	}

	while ( e.firstChild && !buttonElements) {
		buttonText.appendChild( e.firstChild );
	}

	if ( !buttonElements ) {
		e.appendChild( buttonInner );
	}

	// Assign a structure containing the elements of this button to the elements of this button. This
	// will allow us to recognize this as an already-enhanced button in future calls to buttonMarkup().
	buttonElements = {
		bcls  : buttonClass,
		outer : e,
		inner : buttonInner,
		text  : buttonText,
		icon  : buttonIcon
	};

	$.data(e,           'buttonElements', buttonElements);
	$.data(buttonInner, 'buttonElements', buttonElements);
	$.data(buttonText,  'buttonElements', buttonElements);
	if (buttonIcon) {
		$.data(buttonIcon, 'buttonElements', buttonElements);
	}
}

return this;
};

$.fn.buttonMarkup.defaults = {
corners: true,
shadow: true,
iconshadow: true,
iconsize: 18,
wrapperEls: "span"
};

function closestEnabledButton( element ) {
  var cname;

  while ( element ) {
	// Note that we check for typeof className below because the element we
	// handed could be in an SVG DOM where className on SVG elements is defined to
	// be of a different type (SVGAnimatedString). We only operate on HTML DOM
	// elements, so we look for plain "string".
      cname = ( typeof element.className === 'string' ) && (element.className + ' ');
      if ( cname && cname.indexOf("ui-btn ") > -1 && cname.indexOf("ui-disabled ") < 0 ) {
          break;
      }

      element = element.parentNode;
  }

  return element;
}
