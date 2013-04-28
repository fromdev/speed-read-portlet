$(document).ready(function() {
	// addSelectSlider("wordsPerMinute");
	// addSelectSlider("wordsPerLine");
	// addSelectSlider("noOfLines");
	var feedCache = [];

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

	buildSelect({
		data : feedsList,
		containerSelector : '#feedSelectDiv',
		id : 'feedSelect'
	});

	addSpanSlider({
		min : 10,
		max : 1000,
		start : 150,
		fieldId : "#wordsPerMinute"
	});
	addSpanSlider({
		min : 1,
		max : 10,
		start : 2,
		fieldId : "#wordsPerLine"
	});

	$("#start").click(function() {
		// $('.content-source').wordSequencer({displayElementClass:'wsContentPanel',
		// wordsPerLine:$("#wordsPerLine").val(),
		// wordsPerMinute:$("#wordsPerMinute").val()});

		$('.content-source').wordSequencer({
			displayElementClass : 'wsContentPanel',
			wordsPerLine : parseInt($("#wordsPerLine").val(), 10),
			wordsPerMinute : parseInt($("#wordsPerMinute").val(), 10)
		});

	});
	$('.stop').click(function() {
		$('.content-source').wordSequencer('stop');
	});
	$('.pause').click(function() {
		$('.content-source').wordSequencer('pause');
	});
	$('.resume').click(function() {
		$('.content-source').wordSequencer('resume');
	});

	$('#feedSelect').change(function() {
		var feedUrl = $(this).val();
		$('#status').text('Loading...');
		var selectedFeedData = [];

		selectedFeedData = feedCache[feedUrl];
		if (selectedFeedData) {
			// reload from cache
			console.log('using cache');
			setupNewFeedPosts(selectedFeedData);
		} else {
			// fresh load
			var api = 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&q=' + encodeURIComponent(feedUrl) + "&num=" + "10";
			$.getJSON(api, function(data) {

				// Check for error
				if (data.responseStatus == 200) {

					// Process the feeds
					// _process(e, data.responseData, options);
					selectedFeedData = loadJsonFeed(data.responseData);
					console.log('load feed done');
					feedCache[feedUrl] = selectedFeedData;
					setupNewFeedPosts(selectedFeedData);
					console.log('setup posts done');

					// Optional user callback function
					if ($.isFunction(fn))
						fn.call(this, $e);

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
					// $(e).html('<div class="rssError"><p>' + msg +
					// '</p></div>');
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
		
		$('#status').empty();
	});
	$('#config-dialog').dialog({autoOpen: false, width:'auto', title:'Settings'});
	
	$('#settings').click(function(){
		$('#feedPostSelect').trigger('change');
		$('#config-dialog').dialog('open');
	});

});

function addSelectSlider(selectId) {
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

}

function addSpanSlider(options) {
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

}
function loadJsonFeed(data) {
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
}

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

function buildDefaultSelect(options) {
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
}

function buildSelect(options) {
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
}

function setupNewFeedPosts(selectedFeedData) {

	buildDefaultSelect({
		data : selectedFeedData,
		containerSelector : '#feedPostDiv',
		id : 'feedPostSelect'
	});
	console.log('build select done');
	// This is needed since
	// we need to bind
	// change event every
	// time we create a new
	// select.
	$('#feedPostSelect').bind('change', function() {
		var txt = selectedFeedData[$('#feedPostSelect option:selected').index()].description;
		console.log('Change is triggerred');
		try {
			// try to parse if good HTML
			var tmp = $(txt).text();
			txt = tmp;
		} catch (err) {
			console.log(err);
		}
		$('.content-source').html(txt);
		$('.content-source').wordSequencer('stop');
//		$('.content-source').wordSequencer({
//			displayElementClass : 'wsContentPanel',
//			wordsPerLine : parseInt($("#wordsPerLine").val(), 10),
//			wordsPerMinute : parseInt($("#wordsPerMinute").val(), 10)
//		});
	});
	$('#feedPostSelect').trigger('change');

}