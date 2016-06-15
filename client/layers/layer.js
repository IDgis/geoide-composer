Template.layer.helpers({
	layer_servicelayer: function() {
		return Layers.find({},{fields:{service_layers:1}}).fetch();
	}	
});

