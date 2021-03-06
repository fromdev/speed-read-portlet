/*
 * Custom UI Plugin Developed by
 * Author: Sachin Joshi sachin@fromdev.com
 * Copyright (c) 2013 www.FromDev.com
 * MIT Licensed: http://www.opensource.org/licenses/mit-license.php
 */
(function($) {
	/*
	 * Turn this flag to true for debug logs.
	 */
	debug = false;

	$.selectSlider = function(selectId) {
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

	};
	$.spanSlider = function(options) {
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
				$(config.fieldId).trigger('change');
			}
		});
		$(config.spanId).text($(config.sliderId).slider("value"));
		$(config.fieldId).val($(config.sliderId).slider("value"));

	};
	$.spanSliderSetValue = function(options) {
		var derivedConfig = {
			spanId : (options.fieldId + "Span"),
			sliderId : (options.fieldId + "Slider")
		};
		var config = $.extend({}, options, derivedConfig);
		$(config.spanId).text(config.value);
		$(config.fieldId).val(config.value);
		$(config.sliderId).slider("value",config.value)

	};
	
	$.buildDefaultSelect = function(options) {
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
	};
	$.fn.buildDefaultOptions = function(options) {
		if (options) {
			$(this).empty();
			var html = [];
			var len = options.data.length;
			html[html.length] = '';
			for ( var i = 0; i < len; i++) {
				html[html.length] = '<option>' + options.data[i].title + '</option>';
			}
			$(this).append(html.join(''));

		}
	};
	$.fn.buildPostOptions = function(options) {
		if (options) {
			$(this).empty();
			var html = [];
			var len = options.data.entries.length;
			html[html.length] = '';
			for ( var i = 0; i < len; i++) {
				html[html.length] = '<option>' + options.data.entries[i].title + '</option>';
			}
			$(this).append(html.join(''));

		}
	};
	$.buildSelect = function(options) {
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
	};

	$.fn.buildOptions = function(options) {
		if (options) {
			$(this).empty();
			var html = [];
			var len = options.data.length;
			html[html.length] = '';
			for ( var i = 0; i < len; i++) {
				html[html.length] = '<option value="' + options.data[i].url + '">' + options.data[i].title + '</option>';
			}
			$(this).append(html.join(''));
		}
	};
	
	$.fn.addOption = function(options) {
	     $(this)
         .append($("<option></option>")
         .attr("value",options.key)
         .attr("selected",options.selected)
         .text(options.value)); 
	};
	

	$.validateUrl = function(url) {
		if(url) {
			if (/^([a-z]([a-z]|\d|\+|-|\.)*):(\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?((\[(|(v[\da-f]{1,}\.(([a-z]|\d|-|\.|_|~)|[!\$&'\(\)\*\+,;=]|:)+))\])|((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=])*)(:\d*)?)(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*|(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)){0})(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
					.test(url)) {
				return true;
			}
		}
		return false;
	};
	
	$.getEmFontSize = function(fontSize) {
		return (1 + (fontSize - 1) * 0.1);
	};

	function log(msg) {
		if (debug) {
			console.log(msg);
		}
	}

})(jQuery);
