
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
<div class="wsContentWrapper">
	<span class="status"></span>
	<div class="feedSelectDiv" id="feedSelectDiv">
		<select id="feedSelect">
			<option value="">Select A Feed</option>
		</select>
	</div>
	<div class="feedPostDiv" id="feedPostDiv">
		<select id="feedPostSelect">
			<option value="">Select A Post</option>
		</select>
	</div>

	<div class="wsContentPanel">Test</div>
</div>

<div class="content-source">One Two Three Four Five Six Seven
	Eight Nine Ten Eleven, twelve, Thirteen, fourteen, fifteen</div>
<input type="button" value="Start" id="start" />
<input type="button" value="Stop" id="stop" class="stop" />
<input type="button" value="Pause" id="pause" class="pause" />
<input type="button" value="Resume" id="resume" class="resume" />

<form id="config">
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
</form>