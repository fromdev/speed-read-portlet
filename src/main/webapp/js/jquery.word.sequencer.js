/*
 * jQuery Word Sequencer Plugin
 * Author: Sachin Joshi sachin@fromdev.com
 * Copyright (c) 2013 www.FromDev.com
 * MIT Licensed: http://www.opensource.org/licenses/mit-license.php
 */
(function($) {
	/*
	 * Turn this flag to true for debug logs.
	 */
	debug = false;

	pluginStatus = {
		running : 0,
		stopped : 1,
		paused : 2
	};

	settings = {
		wordsPerLine : 2,
		wordsPerMinute : 150,
		displayElementClass : 'wsContentPanel',
		currentIndex : 0,
		showHide : 0,
		status : pluginStatus.stopped
	};

	var methods = {
		start : function(userSettings) {
			if (settings.status != pluginStatus.running) {
				$.extend(settings, userSettings);

				var calculatedSettings = {
					fadeInTime : ((settings.wordsPerLine * 60 * 100) / settings.wordsPerMinute) - 10,
					fadeOutTime : ((settings.wordsPerLine * 60 * 100) / settings.wordsPerMinute) - 10,
					delayTime : ((settings.wordsPerLine * 60 * 800) / settings.wordsPerMinute) - 80,
					words : $(settings.currentElement).text().split(' '),
					totalTime : (settings.wordsPerLine * 60 * 1000) / settings.wordsPerMinute
				};
				$.extend(settings, calculatedSettings);
				// prepare(settings);
				// play(settings);
				log("settings[ fadeIn:" + settings.fadeInTime + ", fadeOut:" + settings.fadeOutTime + ", delayTime:" + settings.delayTime + ", totalTime:"
						+ settings.totalTime + "] text:[" + $(this).text() + "]");

				settings.status = pluginStatus.running;

				settings.showHide = setInterval(function() {
					var displayWords = "";

					var mx = settings.currentIndex + settings.wordsPerLine;
					if (mx > settings.words.length)
						mx = settings.words.length;
					for ( var i = settings.currentIndex; i < mx; i++) {
						displayWords += settings.words[i] + " ";
					}

					$("." + settings.displayElementClass).fadeIn(settings.fadeInTime).text(displayWords);
					if (settings.status == pluginStatus.running) {
						$("." + settings.displayElementClass).delay(settings.delayTime).fadeOut(settings.fadeOutTime);
					}
					log("running " + settings.currentIndex + " wl: " + settings.words.length + ", mx: " + mx);
					settings.currentIndex = mx;
					if (settings.currentIndex >= settings.words.length) {
						methods.stop();
					}
				}, settings.totalTime);

			} else {
				log("Already running - " + settings.status);
			}
		},
		stop : function() {
			if (settings.status == pluginStatus.running) {
				clearInterval(settings.showHide);
				settings.status = pluginStatus.stopped;
				settings.currentIndex = 0;
				//invoke the callback on finish
				settings.finish();
				log("stopped");
			} else {
				log("Not running - " + settings.status);
			}
		},
		pause : function() {
			if (settings.status == pluginStatus.running) {
				clearInterval(settings.showHide);
				settings.status = pluginStatus.paused;
			} else {
				log("Not running - " + settings.status);
			}
		},
		restart : function(userSettings) {
			if (settings.status != pluginStatus.running) {
				$.extend(settings, {
					currentIndex : 0
				});
				methods.start(userSettings);
			} else {
				log("Already running - " + settings.status);
			}
		},
		resume : function(userSettings) {
			if (settings.status != pluginStatus.running) {
				methods.start(userSettings);
			} else {
				log("Already running - " + settings.status);
			}
		}

	};
	$.fn.wordSequencer = function(options) {
		// log($(this).text());
		if (options == 'stop') {
			methods.stop();
		} else if (options == 'pause') {
			methods.pause();
		} else if (options == 'status') {
			return settings.status;
		} else if (options == 'resume') {
			$.extend(settings, {
				currentElement : this
			});
			methods.resume(options);
		} else {
			$.extend(settings, {
				currentElement : this
			});
			if(settings.status == pluginStatus.paused) {
				methods.resume(options);
			} else {
				methods.restart(options);
			}
		}
	};

	function log(msg) {
		if (debug) {
			console.log(msg);
		}
	}

})(jQuery);
