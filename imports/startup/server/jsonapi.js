import { Router } from 'meteor/iron:router';
import { Services } from '/imports/api/collections/services.js';

Router.map(function () {
  this.route('jsonapi2', {
    path: '/jsonapi2',
    where: 'server',
    action: function () {
      var json = Services.find().fetch(); // what ever data you want to return
      this.response.setHeader('Content-Type', 'application/json');
      this.response.end(JSON.stringify(json));
    }
  });
});