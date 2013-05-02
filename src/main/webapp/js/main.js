$(document).ready(function() {
	/*
	 * Turn this flag to true for debug logs.
	 */
	debug = true;
	/*
	 * Settings
	 */
	var appSettings = {
		currentFeedId : 0,
		currentPostId : 0,
		wordsPerMinute : 150,
		wordsPerLine : 2,
		fontSize : 11
	};

	var getEmFontSize = function(fontSize) {
		return (1 + (fontSize - 1) * 0.1);
	};
	/*
	 * Initial/default feed list that can be overridden by jsonp call
	 */
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

	var feedListUrl = "http://fromdevstatic.googlecode.com/svn/trunk/src/js/feed.list.json";

	$.ajax({
		url : feedListUrl,
		dataType : "jsonp",
		jsonpCallback : "feedListJsonLoader",
		success : function(data) {
			log('loaded feeds list');
			if (data) {
				if (feedsList.length < data.length) {
					feedsList = data;
					$('#feedSelect').buildOptions({
						data : feedsList
					});
				}
			}

		},
		error : function(data) {
			log("Feed List error");
			log(data);
		}
	});

	$('#feedSelect').buildOptions({
		data : feedsList
	});

	$.spanSlider({
		min : 10,
		max : 1000,
		start : appSettings.wordsPerMinute,
		fieldId : "#wordsPerMinute"
	});
	$.spanSlider({
		min : 1,
		max : 10,
		start : appSettings.wordsPerLine,
		fieldId : "#wordsPerLine"
	});
	$.spanSlider({
		min : 1,
		max : 50,
		start : appSettings.fontSize,
		fieldId : "#fontSize"
	});
	$('#fontSize').change(function() {
		log('Font change triggered');
		var fontSizeEm = getEmFontSize($(this).val());
		$('.preview').css('font-size', fontSizeEm + 'em');
		// $('.wsContentPanel').css('font-size',fontSizeEm + 'em');
	});

	$('#config-dialog').dialog({
		autoOpen : false,
		width : 'auto',
		title : 'Settings'
	});

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
			//applyContentSettings();
			$('.content-source').wordSequencer({
				displayElementClass : 'wsContentPanel',
				wordsPerLine : appSettings.wordsPerLine,
				wordsPerMinute : appSettings.wordsPerMinute,
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

	$("#forward").button({
		text : false,
		icons : {
			primary : "ui-icon-seek-next"
		}
	}).click(function() {
		//
		var nextIdx = $('#feedPostSelect option:selected').index() + 1;
		log('forwarding - ' + nextIdx);

		var len = $('#feedPostSelect option').length;
		if (nextIdx < len) {
			log('next post in same site');
			$('#feedPostSelect option:eq(' + nextIdx + ')').attr('selected', true);
			$('#feedPostSelect').trigger('change');
		} else {
			// jump to next site.
			var nextFeedIdx = $('#feedSelect option:selected').index() + 1;
			var feedLen = $('#feedSelect option').length;
			if (nextFeedIdx >= feedLen) {
				log('We have hit the last feed');
				nextFeedIdx = 0;
			}
			$('#feedSelect option:eq(' + nextFeedIdx + ')').attr('selected', true);
			$('#feedSelect').trigger('change');

			log('next post in new site ' + nextFeedIdx + ', ' + feedLen);
		}
	});

	$("#settings").button({
		text : false,
		icons : {
			primary : "ui-icon-gear"
		}
	}).click(function() {
		if ($("#play").text() === "pause") {
			$("#play").trigger('click');
		}
		$('#config-dialog').dialog('open');
	});

	var processFeedData = function(feed) {
		log('callback called');
		$('#feedPostSelect').buildPostOptions({
			data : feed
		});

		log('build select done');
		// This is needed since
		// we need to bind
		// change event every
		// time we create a new
		// select.
		$('#feedPostSelect').trigger('change');
		appSettings.currentPostId = $('#feedPostSelect option:selected').index();

		updateStatus('');
	};
	var updateStatus = function(msg) {
		$('#status').text(msg);
	};

	var processFeedChange = function() {

		var feedUrl = $('#feedSelect option:selected').val();
		updateStatus('Loading...');
		$.loadFeed({
			url : feedUrl,
			callback : processFeedData
		});
		appSettings.currentFeedId = $('#feedSelect option:selected').index();
	};

	var applyContentSettings = function() {
		var selectedFeedData = $.currentFeed();
		if (selectedFeedData) {
			var txt = selectedFeedData.entries[appSettings.currentPostId].content;
			log('applyContentSettings is called');
			try {
				// try to parse if good HTML
				var tmp = $(txt).text();
				txt = tmp;
			} catch (err) {
				log(err);
			}
			$('.content-source').html(txt);
			$('.wsContentHeader').html(selectedFeedData.title + ': ' + selectedFeedData.entries[appSettings.currentPostId].title);
			$('.wsContentPanel').html('');
			$('.content-source').wordSequencer('stop');
		}
	};

	var processPostChange = function() {

		var selected = $('#feedPostSelect option:selected').index();
		log('index: ' + selected);
		if (!selected) {
			if ($('#feedPostSelect option').length > 0) {
				selected = 0;
			} else {
				log('No options to make progress');
				return;
			}
		}
		appSettings.currentPostId = selected;
		applyContentSettings();

		log('processPostChange completed');

	};

	$('#feedSelect').change(processFeedChange);
	$('#feedPostSelect').change(processPostChange);

	$('#feedSelect option:first').attr('selected', true);
	$('#feedPostSelect option:first').attr('selected', true);
	$('#feedSelect').trigger('change');
	$('#fontSize').trigger('change');

	/*
	 * $.loadFeed({ url : $('#feedSelect option:first').val(), callback :
	 * processFeedData });
	 */

	$('#config-dialog').bind('dialogclose', function(event) {
		appSettings.wordsPerLine = parseInt($("#wordsPerLine").val(), 10);
		appSettings.wordsPerMinute = parseInt($("#wordsPerMinute").val(), 10);

		appSettings.fontSize = $('#fontSize').val();
		$('.wsContentPanel').css('font-size', getEmFontSize(appSettings.fontSize) + 'em');

		updateStatus('');
	});

});

function log(msg) {
	if (debug) {
		console.log(msg);
	}
}
