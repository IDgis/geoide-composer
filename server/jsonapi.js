Router.map(function () {
  this.route('api', {
    path: '/jsonapi',
    where: 'server',
    action: function () {
      var json = Services.find().fetch(); // what ever data you want to return
      this.response.setHeader('Content-Type', 'application/json');
      this.response.end(JSON.stringify(json));
    }
  });
});