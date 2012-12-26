/* Information
----------------------------------------------
File Name : jquery.twitter.search.js
URL : http://www.atokala.com/
Copyright : (C)atokala
Author : Masahiro Abe
--------------------------------------------*/
(function($){
	$.fn.ATTwitterSearch = function(config) {

		var defaults = {
			tweets : '.attweets',
			loading : '.atloading',
			view : 5,
			page : 1
		}

		var options = $.extend(defaults, config);
		var LOADFLAG = false;		//tweetを読み込み中の時はtrue

		//Stringクラスに全置換え追加
		String.prototype.replaceAll = function (org, dest) {
			return this.split(org).join(dest);
		}

		return this.each(function(){
			var _self = $(this);

			function getTwitter() {
				var encode = urlEncode(options.q);
				var url = 'http://search.twitter.com/search.json?q=' + encode + '&callback=?&rpp=' + options.view + '&page=' + options.page;
				$.getJSON(url, function(json){twitterLoad(json.results)});
			}

			function urlEncode(data) {
				data = data.replaceAll('!', escape('!'));
				data = data.replaceAll('(', escape('('));
				data = data.replaceAll(')', escape(')'));
				data = data.replaceAll('_', escape('_'));
				data = data.replaceAll('*', escape('*'));

				//!'()*-._~は変換されない
				var encode = encodeURIComponent(data);
				return encode;
			}

			function twitterLoad(json) {
				if (json) {
					loadingView();
					setTimeout(function() {
						var twitterContents = '';
						if(json.length === 0){
							twitterContents += '<div class="attweet"><p>結果が見つかりませんでした</p></div>';
						}
						else{
							for (var i = 0; i < json.length; i++) {
								twitterContents += tweetHTML(json[i]);
							}
						}
						
						$(options.tweets, _self).append(twitterContents);
						loadingHidden();
						options.page ++;
					}, 500);
				}
			}

			// ツイート一件分作成
			function tweetHTML(jsonData) {
				var template = '';
				template += '<a href="' + 'https://twitter.com/#!/' + jsonData.screen_name + '/status/' + jsonData.id_str + '" target="_blank" " class="tweetlink"><div class="attweet">';
				template += '<p class="atphoto"><a href="http://twitter.com/#!/' + jsonData.from_user + '" target="_blank"><img src="' + jsonData.profile_image_url + '" /></a></p>';
				template += '<p class="attext">' + formatTwitterString(jsonData.text) + '</p>';
				template += '<p class="atstatus"><a href="https://twitter.com/#!/' + jsonData.screen_name + '/status/' + jsonData.id_str + '" target="_blank">' + elapsedDate(jsonData.created_at) + '</a>　' + linkSetting(jsonData.source) + 'から</p>';
				template += '</div></a>';
				return template;
			}

			// リンク作成
			function formatTwitterString(str) {
				str = str.replace(/((ftp|http|https?):\/\/([-\w\.]+)+(:\d+)?(\/([\w/_\.]*(\?\S+)?)?)?)/gm,'<a href="$1" target="_blank">$1</a>');
				str = str.replace(/@(\w+)/gm,'<a href="http://twitter.com/$1" target="_blank">@$1</a>');
				str = str.replace(/#(\w+)/gm,'<a href="http://search.twitter.com/search?q=$1" target="_blank">#$1</a>');
				return str;
			}

			// リンク作成
			function linkSetting(str) {
				str = str.replaceAll('&lt;', '<');
				str = str.replaceAll('&gt;', '>');
				str = str.replaceAll('&quot;', '"');
				return str;
			}

			// ローディング表示
			function loadingView() {
				LOADFLAG = true;
				$(options.loading, _self).css('display', 'block');
			}

			// ローディング非表示
			function loadingHidden() {
				LOADFLAG = false;
				$(options.loading, _self).css('display', 'none');
			}

			// 時間の変換
			function elapsedDate(datetime) {
				var date1 = new Date(datetime.replace("+", "UTC+")),
				date2 = new Date(),
				diff = date2 - date1;

				if (diff < 3600000) {
					if (diff < 0) {
						return '0分前';
					} else {
						return parseInt(diff / 60000) + '分前';
					}
				}
				else if (diff < 86400000) {
					return parseInt(diff / 3600000) + '時間前';
				}
				else if (diff > 2592000000) {
					return parseInt(diff / 2592000000) + 'ヶ月前';
				}
				else {
					return parseInt(diff / 86400000) + '日前';
				}
			}

			getTwitter();
			$(this).scroll(function(){
				var scrollHeight = $(this)[0].scrollHeight;
				var scrollPosition = $(this).height() + $(this).scrollTop();

				//IE7以下にてスクロールが最下部に行く前に複数回発動されるので、100sec遅延
				//LOADFLAG : true=読み込み false=読み込み終了
				setTimeout(function(){
					if ((scrollHeight - scrollPosition) <= 0 && !LOADFLAG) {
						getTwitter();
					}
				}, 100);
			});
		});
	};
})(jQuery);

