$(document).ready(function() {

	/*
	 * Turn this flag to true for debug logs.
	 */
	debug = false;
	/*
	 * Settings
	 */
	var appSettings = {
		currentFeedId : 2,
		currentPostId : 1,
		wordsPerMinute : 150,
		wordsPerLine : 2,
		fontSize : 11,
		userFeedsList : []
	};

	if (typeof userPrefs === 'undefined') {
		// Reload the page if any of these vars not accessible
		log('userPrefs undefined');
		//location.reload();
	} else {
		log('found user prefs' + userPrefs);
		appSettings = $.extend({}, appSettings, userPrefs);
	}
	$('#reload').hide();
	$('.speed-read-portlet-wrapper').show();

	var saveSettingsOnServer = function() {
		$.ajax({
			url : saveSettingsActionUrl,
			data : {
				"SPEED.READ.PORTLET.USER.SETTINGS" : JSON.stringify(appSettings)
			},
			success : function(data) {
				showSuccess('Successfully saved settings');
			},
			error : function(data) {
				log("Settings save error" + data);
			}
		});
	};

	$.addToCache({
		url : popularFeedsList[0].url,
		feed : welcomeFeed
	});

	var feedListUrl = "http://fromdevstatic.googlecode.com/svn/trunk/src/js/feed.list.json";

	$.ajax({
		url : feedListUrl,
		dataType : "jsonp",
		jsonpCallback : "feedListJsonLoader",
		success : function(data) {
			log('loaded remote feeds list from ' + feedListUrl);
			if (data) {
				if (popularFeedsList.length < data.length) {
					popularFeedsList = data;
				}
				$('#feedSelect').buildOptions({
					data : popularFeedsList
				});
			}

		},
		error : function(data) {
			log("Feed List error");
			log(data);
		}
	});
	var feedsList = popularFeedsList;

	if (appSettings.userFeedsList && (appSettings.userFeedsList.length > 0)) {
		feedsList = $.merge(popularFeedsList, appSettings.userFeedsList);
		// eliminate duplicates
		feedsList = removeDuplicates(feedsList);
	}

	$('#feedSelect').buildOptions({
		data : feedsList
	});
	$.spanSlider({
		min : 10,
		max : 1500,
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
		var fontSizeEm = $.getEmFontSize($(this).val());
		$('.preview').css('font-size', fontSizeEm + 'em');
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
			// applyContentSettings();
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

	var nextFeedOrPost = function() {

		var feed = $.currentFeed();

		if (feed && (appSettings.currentPostId < (feed.entries.length - 1))) {
			appSettings.currentPostId = appSettings.currentPostId + 1;
			applyContentSettings();
			log('feed.entries.len - ' + feed.entries.length + ' : ' + appSettings.currentPostId);
		} else {
			appSettings.currentPostId = 0;
			log('feed list is ' + feedsList.length);
			if (appSettings.currentFeedId < (feedsList.length - 1)) {
				appSettings.currentFeedId = appSettings.currentFeedId + 1;
				log('jumping to next feed' + appSettings.currentFeedId);
			} else {
				appSettings.currentFeedId = 0;
				log('jumping to first feed' + appSettings.currentFeedId);
			}
			processFeedChange({
				url : feedsList[appSettings.currentFeedId].url,
				id : appSettings.currentFeedId,
				postElementSelector : '#feedPostSelect'
			});

		}

	};

	$("#forward").button({
		text : false,
		icons : {
			primary : "ui-icon-seek-next"
		}
	}).click(function() {
		nextFeedOrPost();
		saveSettingsOnServer();
	});

	var displaySettings = function() {
		hideStatus('');
		log('feedId: ' + appSettings.currentFeedId + ' postid:' + appSettings.currentPostId);

		$("#feedSelect option:selected").prop("selected", false);
		$('#feedSelect option:eq(' + appSettings.currentFeedId + ')').prop('selected', true);
		$("#feedPostSelect option:selected").prop("selected", false);
		$('#feedPostSelect option:eq(' + appSettings.currentPostId + ')').prop('selected', true);

		$.spanSliderSetValue({
			value : appSettings.wordsPerMinute,
			fieldId : "#wordsPerMinute"
		});
		$.spanSliderSetValue({
			value : appSettings.wordsPerLine,
			fieldId : "#wordsPerLine"
		});
		$.spanSliderSetValue({
			value : appSettings.fontSize,
			fieldId : "#fontSize"
		});
		var fontSizeEm = $.getEmFontSize(appSettings.fontSize);
		$('.preview').css('font-size', fontSizeEm + 'em');
		$('.wsContentPanel').css('font-size', fontSizeEm + 'em');

		log('display settings applied');

	};
	$("#settings").button({
		text : false,
		icons : {
			primary : "ui-icon-gear"
		}
	}).click(function() {		
		displaySettings();
		if ($("#play").text() === "pause") {
			$("#play").trigger('click');
		}
		$('#config-dialog').dialog('open');
	});

	$("#addUserFeed").button({
		text : false,
		icons : {
			primary : "ui-icon-plusthick"
		}
	}).click(function() {
		var newUrl = $('#userFeedInput').val().trim();
		if ($.validateUrl(newUrl)) {
			if (isUniqueUrl({
				list : feedsList,
				url : newUrl
			})) {
				processUserFeedChange({
					url : newUrl,
					feedElementSelector : '#feedSelect',
					postElementSelector : '#feedPostSelect'
				});

			} else {
				showError('This Feed is already in the list');
			}
		} else {
			showError('Please provide a valid feed URL');
		}
	});
	$('#config').submit(function() {
		return false;
	});
	var hideStatus = function(msg) {
		$('#status').hide();
	};

	var showInfo = function(msg) {
		$('#status').text(msg).removeClass().addClass('info-message');
		$('#status').show();
	};
	var showSuccess = function(msg) {
		
		$('#status').text(msg).removeClass().addClass('success-message');
		$('#status').show();
	};
	var showError = function(msg) {
		$('#status').text(msg).removeClass().addClass('error-message');
		$('#status').show();
	};
	
	var processFeedData = function(options) {
		log('callback called');
		$(options.postElementSelector).buildPostOptions({
			data : options.feed
		});

		log('build select done');
		// This is needed since
		// we need to bind
		// change event every
		// time we create a new
		// select.
		$(options.postElementSelector).trigger('change');
		appSettings.currentPostId = $(options.postElementSelector + " option:selected").index();
	};

	var processUserFeedData = function(options) {
		log('user feed callback called');

		appSettings.userFeedsList.push({
			title : options.feed.title,
			url : options.feed.feedUrl
		});

		$(options.feedElementSelector).addOption({
			value : options.feed.title,
			key : options.feed.feedUrl,
			selected : true
		});

		processFeedData(options);
	};
	var processUserFeedChange = function(options) {
		showInfo('Loading...');
		$.extend(options, {
			success : processUserFeedData,
			error : function() {
				showError('Error adding this feed. Please enter a valid RSS/ATOM feed url.');
			}
		});
		$.loadFeed(options);
		appSettings.currentFeedId = options.id;
	};

	var processFeedChange = function(options) {
		showInfo('Loading...');
		$.extend(options, {
			success : processFeedData
		});
		$.loadFeed(options);
		appSettings.currentFeedId = options.id;
	};

	var applyContentSettings = function() {
		var selectedFeedData = $.currentFeed();
		if (selectedFeedData) {
			var txt = selectedFeedData.entries[appSettings.currentPostId].content;
			log('applyContentSettings is called');

			$('.content-source').html(txt);
			$('.wsContentHeader').html(selectedFeedData.title + ': ' + selectedFeedData.entries[appSettings.currentPostId].title);
			$('.wsContentPanel').html('');
			$('.content-source').wordSequencer('stop');
		} else {
			log('current feed is not available yet' + selectedFeedData);
		}
	};

	var processPostChange = function(options) {

		appSettings.currentPostId = options.id;
		applyContentSettings();
		showSuccess('Successfully loaded the feed data!');
		log('processPostChange completed');

	};

	$('#feedSelect').change(function() {
		processFeedChange({
			url : $('#feedSelect option:selected').val(),
			id : $('#feedSelect option:selected').index(),
			postElementSelector : '#feedPostSelect'
		});
	});
	$('#feedPostSelect').change(function() {
		processPostChange({
			id : $('#feedPostSelect option:selected').index()
		});
	});

	$('#feedSelect option:eq(' + appSettings.currentFeedId + ')').attr('selected', true);
	$('#feedPostSelect option:eq(' + appSettings.currentPostId + ')').attr('selected', true);
	$('#feedSelect').trigger('change');
	$('#fontSize').trigger('change');
	displaySettings();

	$('#config-dialog').bind('dialogclose', function(event) {
		appSettings.wordsPerLine = parseInt($("#wordsPerLine").val(), 10);
		appSettings.wordsPerMinute = parseInt($("#wordsPerMinute").val(), 10);

		appSettings.fontSize = $('#fontSize').val();
		$('.wsContentPanel').css('font-size', $.getEmFontSize(appSettings.fontSize) + 'em');
		log('save url' + saveSettingsActionUrl);
		saveSettingsOnServer();
	});

});

function removeDuplicates(arr) {
	var existing = [];
	return $.grep(arr, function(v) {
		if ($.inArray(v.url, existing) !== -1) {
			return false;
		} else {
			existing.push(v.url);
			return true;
		}
	});
}

function isUniqueUrl(options) {
	if (options.list) {
		for ( var i = 0; i < options.list.length; i++) {
			if (options.list[i].url === options.url) {
				return false;
			}
		}
		return true;
	}
}
function log(msg) {
	if (debug) {
		if (console.log) {
			console.log(msg);
		}
	}
}
