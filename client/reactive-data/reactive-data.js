globalDep = new Tracker.Dependency();

Template.reactiveData.onRendered(function () {
	var nodes = null;
	this.$('.tree').jstree({
    core: {
      data: function (node, cb) {
        globalDep.depend();
        if(node.id === '#') {
          var rootNode = [{
            text : 'Root node',
            id : '1',
            children : true
          }];
          cb(rootNode);
          console.log("root");
        }
        else {
          nodes = Maps.find().fetch();
          console.log("kind");
          console.log(nodes);
          cb(nodes);
        }
      }
    }
  });
});