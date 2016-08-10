import { EJSON } from 'meteor/ejson';

import { Router } from 'meteor/iron:router';
import { Images } from '/imports/api/collections/images.js';

Router.map(function () {
  
  /**
   * Images
   */
  this.route('json-gv-api-services', {
    path: '/GetLegendGraphic/:_id',
    where: 'server',
    action: function () {
    }
  });
 
});