/*
 * Geoide Composer, configuration tool for Geoide Viewer 
 * Copyright (C) 2016 IDgis
 * See license: 
 * https://github.com/IDgis/geoide-admin/blob/master/LICENSE
*/

import {Template} from 'meteor/templating';
import {Router} from 'meteor/iron:router';
import {Session} from 'meteor/session';
import {Services, ServiceSchema} from '/imports/api/collections/services.js';

import './service.html';
import '../i18n/services/help.html';
import '../i18n/alerts/geoide-viewer.html';

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
  
  /**
   * Called in autoform type to determine if this is an insert or update form.
   * Depends on Session object.
   * @return {string} 'update' or 'insert'
   */
  formType : function() {
    if (Session.get('selectedServiceId')) {
      return 'update';
    } else {
      return 'insert';
    }
  },
  
  /**
   * Called in autoform doc to find the Service object for the form
   * Depends on Session object.
   * @return {object} service that was previously selected or null if new service
   */
  serviceDoc : function() {
    if (Session.get('selectedServiceId')) {
      return Services.findOne({_id : Session.get('selectedServiceId')});
    } else {
      return null;
    }
  },
  
  /**
   * Array of service types to be used as options in a select box
   * 
   * @return {array} array of {label, value}
   */
  serviceTypes : function() {
    return [ 
      {label : 'WMS',value : 'WMS'},
      {label : 'WFS',value : 'WFS'},
      {label : 'TMS',value : 'TMS'}
    ];
  },
  
  /**
   * Array of wms versions to be used as options in a select box
   * 
   * @return {array} array of {label, value}
   */
  wmsVersions : function() {
    return [ 
      {label : '1.1.1',value : '1.1.1'},
      {label : '1.3.0',value : '1.3.0'}
    ];
  },
  
  /**
   * Array of wfs versions to be used as options in a select box
   * 
   * @return {array} array of {label, value}
   */
  wfsVersions : function() {
    return [ 
      {label : '1.0.0',value : '1.0.0'},
      {label : '1.1.0',value : '1.1.0'},
      {label : '2.0.0',value : '2.0.0'}
    ];
  },

  /**
   * Array of tms versions to be used as options in a select box
   * 
   * @return {array} array of {label, value}
   */
  tmsVersions : function() {
    return [ {label : '1.0.0',value : '1.0.0'} ];
  }
});

Template.service.events({
  /**
   * When the Cancel button is pressed go to the service list
   */
  'click #return' : function() {
    Router.go('services.list');
  },
  
  /**
   * When control button is pressed, 
   * get the capabilities document of the service
   * and show in a new browser tab.
   */
  'click #control' : function() {
    let url = document.getElementsByName('endpoint')[0].value;
    let type = "";
    
    const types = document.getElementsByName('type');
    for (let i = 0; i < types.length; i++) {
      if (types[i].checked) {
        type = types[i].value;
        break;
      }
    }
    
    if(type !== "TMS") {
	    if (url.indexOf('?') === -1) {
	      url += '?';
	    }
	    url += 'request=GetCapabilities&service=' + type;
	    const versions = document.getElementsByName('version');
	    for (let j = 0; j < versions.length; j++) {
	      if (versions[j].checked) {
	        url += '&version=' + versions[j].value;
	        break;
	      }
	    }
    }
    
    window.open(url, '_blank');
  },
  
  /**
   * Show help pop-up
   */
  'click #help' : function() {
    // peppelg:bootstrap-3-modal
    Modal.show(i18n('services.help.template'));
  }

});

AutoForm.addHooks('serviceform', {
  /**
   * When the autoform is succesfully submitted, go to the service list.
   * Before doing this, trigger the Geoide viewer that the configuration has changed.
   * When the viewer reload fails, alert the user.
   */
  onSuccess : function() {
    Meteor.call('triggerViewerReload', function(lError, lResponse) {
      if (lError) {
        Modal.show('alert-geoide-viewer-refresh');
        Router.go('services.list');
      } else {
        // check op bepaalde inhoud van response of refresh gelukt is
        if (lResponse.statusCode !== 200 ){
          Modal.show('alert-geoide-viewer-refresh');
        }
        Router.go('services.list');
      }
    });
  }
});
