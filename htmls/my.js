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
global.url = 'http://tablet-hikaku.appspot.com/';


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

//検索画面の処理
$(function() {
  //検索処理
  $("#searchButton").click(function() {
    $("#result").html('<center><h4 class="Loading">読み込み中…</h4></center>');
    var androidCheck = $("#Android").attr("checked");
    var iosCheck = $("#iOS").attr("checked");
    var windowsCheck = $("#Windows").attr("checked");
    var osTag = [];
    if(androidCheck){
      osTag.push("And");
    }
    if(iosCheck){
      osTag.push("iOS");
    }
    if(windowsCheck){
      osTag.push("Win");
    }
    if(!androidCheck && !iosCheck && !windowsCheck){
      osTag.push("And");
      osTag.push("iOS");
      osTag.push("Win");
    }

    var sizeCheck1 = $("#under71").attr("checked");
    var sizeCheck2 = $("#71-99").attr("checked");
    var sizeCheck3 = $("#over10").attr("checked");
    var displayCategory = [];
    if(sizeCheck1){
      displayCategory.push("under7.1");
    }
    if(sizeCheck2){
      displayCategory.push("7.1-9.9");
    }
    if(sizeCheck3){
      displayCategory.push("over10");
    }
    if(!sizeCheck1 && !sizeCheck2 && !sizeCheck3){
      displayCategory.push("under7.1");
      displayCategory.push("7.1-9.9");
      displayCategory.push("over10");
      displayCategory.push("unknown");
    }

    var resolutionCategory = $("#resolutionSelect").val();
    if(resolutionCategory == "none"){
      resolutionCategory = "";
    }
    var weightMin = $("#weightMin").val();
    var weightMax = $("#weightMax").val();
    if(weightMin === "0"){
      weightMin = "1";
    }
    if(weightMax === "0"){
      weightMax = "1";
    }
    if(weightMax && !weightMin){
      weightMin = "1";
    }

    var cpuCategory = $("#cpuSelect1").val();
    if(cpuCategory == "none"){
      cpuCategory = "";
    }
    var coreCheck1 = $("#1core").attr("checked");
    var coreCheck2 = $("#2core").attr("checked");
    var coreCheck3 = $("#4core").attr("checked");
    var core = [];
    if(coreCheck1){
      core.push("1");
    }
    if(coreCheck2){
      core.push("2");
    }
    if(coreCheck3){
      core.push("4");
    }
    if(!coreCheck1 && !coreCheck2 && !coreCheck3) {
      core.push("1");
      core.push("2");
      core.push("4");
    }

    osTag = arrayToText(osTag);
    displayCategory = arrayToText(displayCategory);
    core = arrayToText(core);
    if(osTag === "And,iOS,Win" && displayCategory === "under7.1,7.1-9.9,over10,unknown" && core === "1,2,4" && resolutionCategory === "" && weightMax === "" && weightMin === "" && cpuCategory === ""){
      $('#result').html('<p class="noData">条件を指定してください</p>');
      return;
    }
    else if(!isFinite(weightMax) || !isFinite(weightMin) || weightMin < 0 || weightMax < 0){
      alert('重さには半角数字の自然数のみ使用できます');
      $('#result').html('<p class="noData">条件を修正してください</p>');
      return;
    }
    var param = {
      "osTag" : osTag,
      "displayCategory" : displayCategory,
      "resolutionCategory" : resolutionCategory,
      "weightMin" : weightMin,
      "weightMax" : weightMax,
      "cpuCategory" : cpuCategory,
      "core" : core,
      "callback" : "?"
    };
    //alert(JSON.stringify(param));
    searchRequest(param);
  });

  function arrayToText(Array){
    var res = '';
    for (var i = 0; i < Array.length; i++) {
      res += Array[i];
      if(i !== Array.length - 1){
        res += ',';
      }
    }
    return res;
  }
  
  function searchRequest(param){
    url = global.url + 'search';
    req = param;
    global.loading(true, '検索中…');
    $.post(url, req, callback, "json");
  }
  var callback = function(json){
    global.loading(false);
    $("#result").html('<center><h4 class="Loading">検索結果 : ' + json.length +'件</h4></center>');
    //alert(JSON.stringify(json));
    if(json === 0){
      $('#result').html('<p class="noData">該当のタブレットが見つかりませんでした</p>');
      return;
    }
    $.each(json, function(i, item) {
      var img = this.img;
      if(this.img === '' || this.img === 'http://www.coneco.net/images/noimg.gif'){
        img = 'htmls/img/noimage.jpg';
      }
      var weight = this.weight;
      if(weight === 0){
        weight = 'データなし';
      }
      else{
        weight += 'グラム';
      }
      var tempKey = this.productName.split('　');
      var key = tempKey[0];
      var urlKeyword = this.productName.replace(/\s/g," ");
      urlKeyword = urlKeyword.replace(/\(\D+\)/g,"");
      urlKeyword = urlKeyword.replace(/[\(\)\-\_\*]/g,"");
      urlKeyword = encodeURIComponent(urlKeyword);
      message = '<a href="#" class="resultLink" data-transition="pop" data-rel="popup" target="new"><table class="resultInfo"><tr><td><div id="resultImg"><img src="' + img +'" /></div></td><td><p class="productName"><span>'
      + this.productName
      + '</span><p class="os">OS:'
      + this.os
      + '</p><p class="cpu">CPU:'
      + this.cpu
      + '　<br>重さ:'
      + weight
      + '<br><span class="displaySize">ディスプレイ:'
      + this.displaySize
      + 'インチ</span></p></td></tr></table></a><div class="amazonP"><a href="http://www.amazon.co.jp/s/ref=nb_sb_noss_2?__mk_ja_JP=' + urlKeyword + '&url=search-alias%3Daps&field-keywords=' + urlKeyword +'&x=0&Ay=0" id="amazon" target="new" rel=”external”><img src="htmls/img/amazon_so.png" />アマゾンで検索する</a></div><div class="twitterP"><a href="#" id="twitterOpen" name="' + key + '" className="' + i + '"><img src="htmls/img/twitter_so.png" />ツイッターでの評判を見る</a></div><div id="twitterContent' + i + '" style="display: none"><p class="keywordP"><span class="keywordInfo' + i + '">読み込み中…</span></p><div id="twitter_search' + i + '"><div class="attweets"></div></div><div class="moreReadButton"><a href="#" id="moreRead' + i + '">More...</a></div></div>';
      //str = str + message;
      $('<li>').html(message).appendTo('#result');
      html = "";
    });
  };
  $("#twitterOpen").live("click", function() {
    var i = $(this).attr("className");
    var key = this.name;
    var id = "#twitterContent" + i;
    var id2 = "#twitter_search"  + i;
    var keyInfo = ".keywordInfo" + i;
    var a = $(this).html();
    var read = "#moreRead" + i;
    if(a == '<img src="htmls/img/twitter_so.png">ツイッターでの評判を見る'){
      $(this).html('<img src="htmls/img/twitter_so.png" />閉じる');
      $(id2 + ' div').html('');
      $(id2).ATTwitterSearch({
        q : key,
        view : 5
      }, read);
      $(keyInfo).html(key + ' の検索結果');
    }
    else{
      $(this).html('<img src="htmls/img/twitter_so.png" />ツイッターでの評判を見る');
    }
    $(id).toggle();
  });
});
//検索処理おわり

//TOPへ戻る処理
$(function() {
  var topBtn = $('#backToTop');
  topBtn.hide();
  $(window).scroll(function () {
    if ($(this).scrollTop() > 500) {
      topBtn.fadeIn();
    } else {
      topBtn.fadeOut();
    }
  });
  topBtn.click(function () {
    $('body,html').animate({
      scrollTop: 0
    }, 500);
    return false;
  });
});


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
