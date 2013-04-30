$(document).ready(function() {
	// addSelectSlider("wordsPerMinute");
	// addSelectSlider("wordsPerLine");
	// addSelectSlider("noOfLines");
	var feedCache = [];
	var selectedFeedData = [];

	var feedsList = [ {
		url : 'http://feeds.feedburner.com/Quicksprout',
		title : 'Quicksprout'
	}, {
		url : 'http://feeds.feedburner.com/Fromdev',
		title : 'FromDev'
	}, {
		url : 'http://feeds.feedburner.com/TechCrunch/',
		title : 'TechCrunch'
	}, {
		url : 'http://rss.cnn.com/rss/cnn_topstories.rss',
		title : 'CNN'
	} ];
	
	//START uiUtil
	var uiUtil = {
			addSelectSlider: function(selectId) {
				var select = $("#" + selectId);
				var optionCount = $('#' + selectId + ' option').size();
				var selectSlider = $("<div id= '" + selectId + "Slider' style='width:70%;float:right;'></div>").insertAfter(select).slider({
					min : 1,
					max : optionCount,
					range : "min",
					value : select[0].selectedIndex + 1,
					slide : function(event, ui) {
						select[0].selectedIndex = ui.value - 1;
					}
				});
				$("#" + selectId).change(function() {
					selectSlider.slider("value", this.selectedIndex + 1);
				});

			},
			addSpanSlider : function(options) {
				var config = {
					min : 0,
					max : 100,
					start : 10,
					fieldId : "#hiddenField"
				};
				$.extend(config, options);
				var derivedConfig = {
					spanId : (config.fieldId + "Span"),
					sliderId : (config.fieldId + "Slider")
				};
				$.extend(config, derivedConfig);

				$(config.sliderId).slider({
					range : "min",
					min : config.min,
					max : config.max,
					value : config.start,
					slide : function(event, ui) {
						$(config.spanId).text(ui.value);
						$(config.fieldId).val(ui.value);
					}
				});
				$(config.spanId).text($(config.sliderId).slider("value"));
				$(config.fieldId).val($(config.sliderId).slider("value"));

			},
			buildDefaultSelect: function(options) {
				if (options) {
					$(options.containerSelector).empty();
					var html = [];
					var len = options.data.length;
					html[html.length] = '<select id="' + options.id + '">';
					for ( var i = 0; i < len; i++) {
						html[html.length] = '<option>' + options.data[i].title + '</option>';
					}
					html[html.length] = '</select>';
					$(options.containerSelector).append(html.join(''));

				}
			},
			buildDefaultOptions: function(options) {
				if (options) {
					$(options.containerSelector).empty();
					var html = [];
					var len = options.data.length;
					html[html.length] = '';
					for ( var i = 0; i < len; i++) {
						html[html.length] = '<option>' + options.data[i].title + '</option>';
					}
					$(options.containerSelector).append(html.join(''));

				}
			},
			buildSelect: function(options) {
				if (options) {
					$(options.containerSelector).empty();
					var html = [];
					var len = options.data.length;
					html[html.length] = '<select id="' + options.id + '">';
					for ( var i = 0; i < len; i++) {
						html[html.length] = '<option value="' + options.data[i].url + '">' + options.data[i].title + '</option>';
					}
					html[html.length] = '</select>';
					$(options.containerSelector).append(html.join(''));
				}
			},
			buildOptions: function(options) {
				if (options) {
					$(options.containerSelector).empty();
					var html = [];
					var len = options.data.length;
					html[html.length] = '';
					for ( var i = 0; i < len; i++) {
						html[html.length] = '<option value="' + options.data[i].url + '">' + options.data[i].title + '</option>';
					}
					$(options.containerSelector).append(html.join(''));
				}
			}


	};
	//END uiUtil

	//SATRT feedUtil
	var feedUtil = {
			setup: function(feedUrl) {

				selectedFeedData = feedCache[feedUrl];
				if (selectedFeedData) {
					// reload from cache
					console.log('using cache');
					feedUtil.setupNewFeedPosts(selectedFeedData);
				} else {
					// fresh load
					var api = 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&q=' + encodeURIComponent(feedUrl) + "&num=" + "10";
					$.getJSON(api, function(data) {

						// Check for error
						if (data.responseStatus == 200) {

							// Process the feeds
							// _process(e, data.responseData, options);
							selectedFeedData = feedUtil.load(data.responseData);
							console.log('load feed done');
							feedCache[feedUrl] = selectedFeedData;
							feedUtil.setupNewFeedPosts(selectedFeedData);
							console.log('setup posts done');

						} else {
							console.log('Error api ');
							// Handle error if required
							if (options.showerror)
								if (options.errormsg != '') {
									var msg = options.errormsg;
								} else {
									var msg = data.responseDetails;
								}
							;
						}
						;
					});
					/*
					 * $.ajax({ url : actionUrl, data : { FEED_URL : feedUrl }, success :
					 * function(data) { console.log("Feed Success - " + feedUrl);
					 * 
					 * selectedFeedData = loadFeed(data); feedCache[feedUrl] =
					 * selectedFeedData; setupNewFeedPosts(selectedFeedData); }, error :
					 * function(data) { console.log("Feed error" + data); } });
					 */
				}
			},
			load: function(data) {
				console.log(data);
				var selectedFeedData = [];
				var feedSet = [];
				var entries = data.feed.entries;
				console.log(entries);
				console.log(entries.length);
				for ( var i = 0; i < entries.length; i++) {
					var title = entries[i].title;
					// grab the post's URL
					var link = entries[i].link;
					// next, the description
					var description = entries[i].content;
					/*
					 * Add only unique titles
					 */
					if (title) {
						if (description.trim().length == 0) {
							return;
						}
						if (title.length > 100) {
							title = title.substring(0, 100);
						}
						if (!feedSet[title]) {
							var feedData = {
								title : title,
								description : description,
								url : link
							};
							console.log("Title:" + title);

							selectedFeedData.push(feedData);
							feedSet[title] = true;
						}
					}
				}
				return selectedFeedData;
			},
			setupNewFeedPosts:function(selectedFeedData) {
/*
				uiUtil.buildDefaultSelect({
					data : selectedFeedData,
					containerSelector : '#feedPostDiv',
					id : 'feedPostSelect'
				});
*/	
				uiUtil.buildDefaultOptions({
					data : selectedFeedData,
					containerSelector : '#feedPostSelect'					
				});
				console.log('build select done');
				// This is needed since
				// we need to bind
				// change event every
				// time we create a new
				// select.
				$('#feedPostSelect').trigger('change');

			}
	};
	//END feedUtil
	

	uiUtil.buildOptions({
		data : feedsList,
		containerSelector : '#feedSelect'
	});

	uiUtil.addSpanSlider({
		min : 10,
		max : 1000,
		start : 150,
		fieldId : "#wordsPerMinute"
	});
	uiUtil.addSpanSlider({
		min : 1,
		max : 10,
		start : 2,
		fieldId : "#wordsPerLine"
	});

	$('#config-dialog').dialog({
		autoOpen : false,
		width : 'auto',
		title : 'Settings'
	});

/*	
	$( "#backward" ).button({
	      text: false,
	      icons: {
	        primary: "ui-icon-seek-prev"
	      }
	    }).click(function() {
			//
	    	var nextIdx = $('#feedPostSelect option:selected').index() - 1;
	    	console.log('backward - ' + nextIdx);

	    	if(nextIdx >= 0) {
	    		console.log('prev post in same site');
	    		$('#feedPostSelect option:eq(' + nextIdx + ')').attr('selected', true);
				$('#feedPostSelect').trigger('change');
	    	} else {
	    		//jump to next site.
	    		var nextFeedIdx = $('#feedSelect option:selected').index() - 1;
	    		var lastPost = $('#feedPostSelect option').length - 1;
	    		if(nextFeedIdx < 0) {
	    			nextFeedIdx = 0;
	    		}
	    		$('#feedSelect option:eq(' + nextFeedIdx + ')').attr('selected', true);
	    		$('#feedPostSelect option:eq(' + lastPost + ')').attr('selected', true);
				$('#feedSelect').trigger('change');
				$('#feedPostSelect').trigger('change');

	    		console.log('first post in new site');
	    	}
		});
*/
	$("#play").button({
		text : false,
		icons : {
			primary : "ui-icon-play"
		}
	}).click(function() {
		var options;
		if ($(this).text() === "play") {
			options = {
				label : "pause",
				icons : {
					primary : "ui-icon-pause"
				}
			};
			$('.content-source').wordSequencer({
				displayElementClass : 'wsContentPanel',
				wordsPerLine : parseInt($("#wordsPerLine").val(), 10),
				wordsPerMinute : parseInt($("#wordsPerMinute").val(), 10),
				finish : function() {
					$("#play").button("option", {
						label : "play",
						icons : {
							primary : "ui-icon-play"
						}
					});
				}
			});
		} else {
			options = {
				label : "play",
				icons : {
					primary : "ui-icon-play"
				}
			};
			$('.content-source').wordSequencer('pause');
		}
		$(this).button("option", options);

	});

	$("#stop").button({
		text : false,
		icons : {
			primary : "ui-icon-stop"
		}
	}).click(function() {
		$('.content-source').wordSequencer('stop');
	});
	
	$( "#forward" ).button({
	      text: false,
	      icons: {
	        primary: "ui-icon-seek-next"
	      }
	    }).click(function() {
			//
	    	var nextIdx = $('#feedPostSelect option:selected').index() + 1;
	    	console.log('forwarding - ' + nextIdx);

	    	var len = $('#feedPostSelect option').length;
	    	if(nextIdx < len) {
	    		console.log('next post in same site');
	    		$('#feedPostSelect option:eq(' + nextIdx + ')').attr('selected', true);
				$('#feedPostSelect').trigger('change');
	    	} else {
	    		//jump to next site.
	    		var nextFeedIdx = $('#feedSelect option:selected').index() + 1;
	    		var feedLen = $('#feedSelect option').length;
	    		if(nextFeedIdx >= feedLen) {
	    			nextFeedIdx = 0;
	    		}
	    		$('#feedSelect option:eq(' + nextFeedIdx + ')').attr('selected', true);
				$('#feedSelect').trigger('change');

	    		console.log('next post in new site');
	    	}
		});

	$("#settings").button({
		text : false,
		icons : {
			primary : "ui-icon-gear"
		}
	}).click(function() {
		$('#feedPostSelect').trigger('change');
		$('#config-dialog').dialog('open');

	});
	/*
	 * $("#start").click(function() { //
	 * $('.content-source').wordSequencer({displayElementClass:'wsContentPanel', //
	 * wordsPerLine:$("#wordsPerLine").val(), //
	 * wordsPerMinute:$("#wordsPerMinute").val()});
	 * $('.content-source').wordSequencer({ displayElementClass :
	 * 'wsContentPanel', wordsPerLine : parseInt($("#wordsPerLine").val(), 10),
	 * wordsPerMinute : parseInt($("#wordsPerMinute").val(), 10) }); });
	 * 
	 * 
	 * $('.stop').click(function() { $('.content-source').wordSequencer('stop');
	 * }); $('.pause').click(function() {
	 * $('.content-source').wordSequencer('pause'); });
	 * $('.resume').click(function() {
	 * $('.content-source').wordSequencer('resume'); });
	 * 
	 * $('#settings').click(function() { $('#feedPostSelect').trigger('change');
	 * $('#config-dialog').dialog('open'); });
	 * 
	 * 
	 */

	$('#feedSelect').change(function() {
		var feedUrl = $(this).val();
		$('#status').text('Loading...');
		feedUtil.setup(feedUrl);
		$('#status').text('');
	});
	
	$('#feedPostSelect').bind('change', function() {

		var selected = $('#feedPostSelect option:selected').index();

		if (!selected) {
			if($('#feedPostSelect option').length > 0) {
				selected = 0;
			} else {
				console.log('No options to make progress');
				return;
			}
		}
		var txt = selectedFeedData[selected].description;
		console.log('Change is triggerred');
		try {
			// try to parse if good HTML
			var tmp = $(txt).text();
			txt = tmp;
		} catch (err) {
			console.log(err);
		}
		$('.content-source').html(txt);
		$('.wsContentHeader').html(selectedFeedData[selected].title)
		$('.content-source').wordSequencer('stop');
		// $('.content-source').wordSequencer({
		// displayElementClass : 'wsContentPanel',
		// wordsPerLine : parseInt($("#wordsPerLine").val(), 10),
		// wordsPerMinute : parseInt($("#wordsPerMinute").val(), 10)
		// });

	});


	$('#feedPostSelect option:first').attr('selected',true);
	
	feedUtil.setup($('#feedSelect option:first').val());


});





function loadFeed(d) {

	console.log(d);
	var selectedFeedData = [];
	var feedSet = [];
	// find each 'item' in the file and parse it
	$('item', d).each(function() {

		if (selectedFeedData.length > 9) {
			return;
		}
		// name the current found item this for this particular loop run
		var $item = $(this);
		// grab the post title
		var title = $item.find('title').eq(0).text().trim();
		// grab the post's URL
		var link = $item.find('link').eq(0).text();
		// next, the description
		var description = $item.find('description').text();
		// don't forget the pubdate
		var pubDate = $item.find('pubDate').eq(0).text();

		/*
		 * Add only unique titles
		 */
		if (title) {
			if (description.trim().length == 0) {
				return;
			}
			if (title.length > 100) {
				title = title.substring(0, 100);
			}
			if (!feedSet[title]) {
				var feedData = {
					title : title,
					description : description,
					url : link
				};
				console.log("Title:" + title);

				selectedFeedData.push(feedData);
				feedSet[title] = true;
			}
		}

	});
	return selectedFeedData;

}




