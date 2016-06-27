Template.service.helpers({
	formType: function () {
		if (Session.get("selectedServiceId")) {
		    return "update";
		 } else {
		    return "insert";
		 }
	},
	serviceDoc: function () {
		if (Session.get("selectedServiceId")) {
		    return this;
		 } else {
		    return null ;
		 }
	},
	serviceTypes: function () {
		var serviceTypes = 
			[{label: "WMS", value: "WMS"},
		     {label: "WFS", value: "WFS"},
		     {label: "TMS", value: "TMS"}];
		return serviceTypes;
	},
	wmsVersions: function() {
		var wmsVersions = 
			[{label: "2", value: 2},
		     {label: "3", value: 3}];
		return wmsVersions;
	},
	wfsVersions: function() {
		var wfsVersions = 
			[{label: "4", value: 4},
		     {label: "5", value: 5}];
		return wfsVersions;
	},
	tmsVersions: function() {
		var tmsVersions = 
			[{label: "7", value: 7},
		     {label: "8", value: 8}];
		return tmsVersions;
	}
});


Template.service.events({
	'submit #serviceform': function () {
		Router.go('services');
	},
	'click #return': function () {
		Router.go('services');
	}
});