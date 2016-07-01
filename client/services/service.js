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
		return[{label: "WMS", value: "WMS"},
		       {label: "WFS", value: "WFS"},
		       {label: "TMS", value: "TMS"}];
	},
	wmsVersions: function() {
		return [{label: "1.1.1", value: "1.1.1"},
		        {label: "1.3.0", value: "1.3.0"}];
	},
	wfsVersions: function() {
		return [{label: "1.0.0", value: "1.0.0"},
		        {label: "1.1.0", value: "1.1.0"},
		        {label: "2.0.0", value: "2.0.0"}];
	},
	tmsVersions: function() {
		return [{label: "1.0.0", value: "1.0.0"}];
	}
});



if (this.service_type==='WFS') {
	return ["1.0.0","1.1.0","2.0.0"];
} 
if (this.service_type==='TMS') {
	return ["1.0.0"];
}


Template.service.events({
	'submit #serviceform': function () {
		Router.go('services');
	},
	'click #return': function () {
		Router.go('services');
	}
});