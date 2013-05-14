package com.fromdev.portlets;

import java.io.IOException;

import javax.portlet.ActionRequest;
import javax.portlet.ActionResponse;
import javax.portlet.PortletException;
import javax.portlet.PortletPreferences;
import javax.portlet.ProcessAction;

import com.liferay.util.bridges.mvc.MVCPortlet;

/**
 * Portlet implementation class SpeedReadPortlet
 */
public class SpeedReadPortlet extends MVCPortlet {

	public static final String SETTINGS = "SPEED.READ.PORTLET.USER.SETTINGS";

	@ProcessAction(name ="saveSettings")
	public void saveSettings(ActionRequest request, ActionResponse response) throws IOException, PortletException
	{
		String settings = request.getParameter(SETTINGS);

		PortletPreferences preferences = request.getPreferences();
		preferences.setValue(SETTINGS, settings);
		preferences.store();
		System.out.println("Saved Prefs" + settings);

	}

}
