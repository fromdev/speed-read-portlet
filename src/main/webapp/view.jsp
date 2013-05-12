
<%@page import="javax.portlet.PortletPreferences"%>
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

<portlet:defineObjects />

<%
	PortletPreferences preferences = renderRequest.getPreferences();
	String settings = preferences.getValue("SPEED.READ.PORTLET.USER.SETTINGS", "{}");

%>
<script>
	saveSettingsActionUrl = '<portlet:actionURL name="saveSettings"/>';
	userPrefs = <%=settings%>;
</script>

<div class="wsContentHeader">Welcome To Speed Read Portlet</div>
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
     	 	<button id="forward">next article</button>  
			<button class="settings" id="settings">settings</button>
		</div>
 	</div>	
</div>
<div id="config-dialog">
<span id="status"></span>
<form id="config">	
<div class="settings-section">	
<h3>Content Settings</h3>	
	<div class="feedSelectDiv" id="feedSelectDiv">
		<label for="feedSelect">Select a Feed</label>
		<select id="feedSelect">
			<option value="">Select a Feed</option>
		</select>
	</div>
	<div class="feedPostDiv" id="feedPostDiv">
		<label for="feedPostSelect">Select a Post</label>
		<select id="feedPostSelect">
			<option value="">Select a Post</option>
		</select>
	</div>
	<div class="userFeedInputDiv" id="userFeedInputDiv">
		<label for="userFeedInput">Add a Feed</label>
		<input type="text" value="" name="userFeedInput" id="userFeedInput" size="70"/>
		<button class="addUserFeed" id="addUserFeed">Add</button>
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
<div class="settings-section">	
<h3>Display Settings</h3>	
	<div class="configItem">
		Font size : <span class="sliderSpan" id="fontSizeSpan">11</span>
		<input type="hidden" id="fontSize" value="11" />
		<div id="fontSizeSlider"></div>
	</div>
	<div class="preview">Preview Display</div>
</div>
</form>
<div class='settings-header'>
<div class="ui-widget">
    <div class="ui-state-highlight ui-corner-all" style="padding: 0 .7em;"> 
        <p style="margin:0;">
            <span class="ui-icon ui-icon-info" 
                style="float: left; margin-right: .3em;"></span>
            <strong>Hey: No Save Button?</strong> Changes are auto applied on close of dialog (hit ESC) when you are done
        </p>
    </div>
</div>
</div>

</div>
<%@ include file="footer.jsp"%>