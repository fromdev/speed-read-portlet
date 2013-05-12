/*
 * Custom Feed Plugin Developed by
 * Author: Sachin Joshi sachin@fromdev.com
 * Copyright (c) 2013 www.FromDev.com
 * MIT Licensed: http://www.opensource.org/licenses/mit-license.php
 */
(function($) {
	/*
	 * Turn this flag to true for debug logs.
	 */
	debug = true;
	/*
	 * Global settings for feed
	 */
	feedSettings = {
		cache : [],
		currentFeed : ''
	};

	var feedUtil = {
		load : function(options) {

			feedSettings.currentFeed = feedSettings.cache[options.url];
			if (feedSettings.currentFeed) {
				// reload from cache
				log('using cache');
				if(options.success) {
					var callbackOptions = $.extend({},options,{feed:feedSettings.currentFeed});
					options.success(callbackOptions);
				}
			} else {
				// fresh load
				var api = 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&q=' + encodeURIComponent(options.url) + "&num=" + "10";
				$.getJSON(api, function(data) {

					// Check for error
					if (data.responseStatus == 200) {
						feedSettings.currentFeed = data.responseData.feed;
						log('load feed done');
						log(feedSettings.currentFeed);
						/*
						 * cache the feed
						 */
						feedSettings.cache[options.url] = feedSettings.currentFeed;
						if(options.success) {
							var callbackOptions = $.extend({},options,{feed:feedSettings.currentFeed});
							options.success(callbackOptions);
						}
						log('setup posts done');

					} else {
						log('Error feed loading : ' + options.url);
						// Handle error if required
						var msg = '';
						if (options.showerror) {
							if (options.errormsg !== '') {
								msg = options.errormsg;
							} else {
								msg = data.responseDetails;
							}
						}
						if(options.error) {
							options.error(msg);
						}
					}
				});
			}
		}
	};

	$.loadFeed = function(options) {
		// log($(this).text());
		feedUtil.load(options);
	};
	$.currentFeed = function() {
		// log($(this).text());
		return feedSettings.currentFeed;
	};
	$.addToCache = function(options) {
		if(options.url) {
			feedSettings.cache[options.url] = options.feed;
		}
	};
	function log(msg) {
		if (debug) {
			console.log(msg);
		}
	}

})(jQuery);