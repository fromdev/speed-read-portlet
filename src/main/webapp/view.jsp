
<%
	/**
	 * Copyright (c) 2000-2012 Liferay, Inc. All rights reserved.
	 *
	 * This library is free software; you can redistribute it and/or modify it under
	 * the terms of the GNU Lesser General Public License as published by the Free
	 * Software Foundation; either version 2.1 of the License, or (at your option)
	 * any later version.
	 *
	 * This library is distributed in the hope that it will be useful, but WITHOUT
	 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
	 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
	 * details.
	 */
%>

<%@ taglib uri="http://java.sun.com/portlet_2_0" prefix="portlet"%>
<script>
	actionUrl = '<portlet:actionURL />';
</script>

<portlet:defineObjects />
<div class="wsContentHeader">Now Reading: Test</div>
<div class="wsContentWrapper">
	<div class="wsContentPanel"></div>
</div>

<div class="content-source">One Two Three Four Five Six Seven
	Eight Nine Ten Eleven, twelve, Thirteen, fourteen, fifteen</div>
<div id="toolbar-wrapper">
 	<div class="child">
 		<div class="ui-widget-header ui-corner-all" id="toolbar">
 	<!-- 	<button id="backward">backward</button>  -->
			<button id="play">play</button>
			<button id="stop">stop</button>
     	 	<button id="forward">fast forward</button>  
			<button class="settings" id="settings">settings</button>
		</div>
 	</div>	
</div>
<div id="config-dialog">
<form id="config">
<span id="status"></span>
	
<div class="settings-section">	
<h3>Content Settings</h3>	
	<div class="feedSelectDiv" id="feedSelectDiv">
	<label for="feedSelect">Select a Feed</label>	
	<select id="feedSelect">
			<option value="">Select A Feed</option>
		</select>
	</div>
	<div class="feedPostDiv" id="feedPostDiv">
	<label for=feedPostSelect">Select a Post</label>
	<select id="feedPostSelect">
			<option value="">Select A Post</option>
		</select>
	</div>
</div>
<div class="settings-section">	
<h3>Speed Settings</h3>	

	<div class="configItem">
		Show <span class="sliderSpan" id="wordsPerMinuteSpan">20</span> Words
		per Minute <input type="hidden" id="wordsPerMinute" value="10" />
		<div id="wordsPerMinuteSlider"></div>
	</div>
	<div class="configItem">
		Show <span class="sliderSpan" id="wordsPerLineSpan">50</span> Words
		per line <input type="hidden" id="wordsPerLine" value="10" />
		<div id="wordsPerLineSlider"></div>
	</div>
</div>
</form>
</div>