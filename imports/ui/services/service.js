import
{
	Template
}
from
'meteor/templating';
import
{
	Router
}
from
'meteor/iron:router';
import
{
	Session
}
from
'meteor/session';

import
{
	Services, ServiceSchema
}
from
'/imports/api/collections/services.js';

import
'./service.html';
import
'../i18n/services/help.html';

Template.service.helpers({
	/**
	 * Services collection
	 */
	services : function() {
		return Services;
	},
	/**
	 * Services schema
	 */
	serviceSchema : function() {
		return ServiceSchema;
	},
	formType : function() {
		if (Session.get("selectedServiceId")) {
			return "update";
		} else {
			return "insert";
		}
	},
	serviceDoc : function() {
		if (Session.get("selectedServiceId")) {
			return Services.findOne({
				_id : Session.get("selectedServiceId")
			});
			// return this;
		} else {
			return null;
		}
	},
	serviceTypes : function() {
		return [ {
			label : "WMS",
			value : "WMS"
		}, {
			label : "WFS",
			value : "WFS"
		}, {
			label : "TMS",
			value : "TMS"
		} ];
	},
	wmsVersions : function() {
		return [ {
			label : "1.1.1",
			value : "1.1.1"
		}, {
			label : "1.3.0",
			value : "1.3.0"
		} ];
	},
	wfsVersions : function() {
		return [ {
			label : "1.0.0",
			value : "1.0.0"
		}, {
			label : "1.1.0",
			value : "1.1.0"
		}, {
			label : "2.0.0",
			value : "2.0.0"
		} ];
	},
	tmsVersions : function() {
		return [ {
			label : "1.0.0",
			value : "1.0.0"
		} ];
	}
});

/**
 * When the Cancel button is pressed go to the service list
 */
Template.service.events({
	'click #return' : function() {
		console.log("clicked cancel serviceform");
		Router.go('services.list');
	},
	'click #control' : function(e) {
		console.log("clicked control serviceform");

		var url = document.getElementsByName("endpoint")[0].value;
		if (url.indexOf("?") == -1) {
			url += "?"
		}
		url += "request=GetCapabilities";

		var types = document.getElementsByName("type");
		for (var i = 0; i < types.length; i++) {
			if (types[i].checked) {
				url += "&service=" + types[i].value;
				break;
			}
		}

		var versions = document.getElementsByName("version");
		for (var j = 0; j < versions.length; j++) {
			if (versions[j].checked) {
				url += "&version=" + versions[j].value;
				break;
			}
		}

		window.open(url, "_blank");

	},
	'click #help' : function() {
		var helpTemplate = i18n('services.help.template');
		console.log("clicked help", helpTemplate);
		Modal.show(helpTemplate);
	},

});

/**
 * when the autoform is succesfully submitted, then go to the service list
 */
AutoForm.addHooks('serviceform', {
	onSuccess : function(formType, result) {
		console.log("submit service autoform, goto list");
		Meteor.call('triggerViewerReload', function(lError, lResponse) {
			if (lError) {
				console.log('triggerViewerReload Error ', lError);
			}
		});
		Router.go('services.list');
	},
	onError : function(formType, error) {
		console.log("service autoform error = " + error);
	}
});