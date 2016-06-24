Template.map.helpers({
	formType: function () {
		if (Session.get("selectedMapId")) {
		    return "update";
		 } else {
		    return "insert";
		 }
	},
	serviceDoc: function () {
		if (Session.get("selectedMapId")) {
		    return this;
		 } else {
		    return null ;
		 }
	},
	
   buildTree: function() {
		
   }
});

Template.map.events({
	
	'submit #mapForm': function (event) {
		console.log("submit");
		//Router.path('map');
	},

	'click .jstree': function () {
		console.log("geklikt");
	},
	
	'click #save-tree': function () {
		console.log("save tree");
		//console.log($.jstree.reference('.tree').get_json('#')[0]);
		//Maps.insert ($.jstree.reference('.tree').get_json('#')[0]);
	},
	
	'click #reset-tree': function (eventObj) {
		console.log("reset");
		var map =  Maps.find ({_id: Router.current().params._id }).fetch()[0];
		//map = {text: 'Afdelingen', type:'map', 'children': [{text: 'Topografie groep',children: [{ text: 'luchtfoto', type: 'layer'}, {text: 'top10 nl',type: 'layer'}], type: 'default' }, { text: 'percelen', type: 'layer' }],type: 'map'};
		$('.maptree').jstree ({
		    core: {
		      data: [
		            map
		       ],
		       check_callback : true
		},
		types : {
			"#" : {
			      "max_children" : 1,
			      "max_depth" : 4,
			      "valid_children" : ["map"]
			},
		    map : {
		      "icon" : "glyphicon glyphicon-tree-deciduous",
		      "valid_children" : ["default", "layer"],
		      //"li-attr" : []
		    },
		    "default" : {
		      "valid_children" : ["default", "layer"]
		    },
		    layer : {
		      "icon" : "glyphicon glyphicon-file",
		      "valid_children" : []
		    },
		   
		  },
		  checkbox : {
			    three_state : false,
			    tie_selection : false,
			    whole_node : false
			},
		plugins : ["dnd", "search","state", "types", "checkbox"]
		});
	},
	
	'click #createlayer': function () {
		var ref = $.jstree.reference('.maptree'),
			sel = ref.get_selected();
		if(!sel.length) { return false; }
		sel = sel[0];
		sel = ref.create_node(sel, {"type":"layer"});
		if(sel) {
			ref.edit(sel);
		}
	},
	
	'click #creategroup': function () {
		var ref = $.jstree.reference('.maptree'),
			sel = ref.get_selected();
		if(!sel.length) { return false; }
		sel = sel[0];
		sel = ref.create_node(sel, {"type":"default"});
		if(sel) {
			ref.edit(sel);
		}
	},
	
	'click #renamenode': function () {
		var ref = $.jstree.reference('.maptree'),
			sel = ref.get_selected();
		if(!sel.length) { return false; }
		sel = sel[0];
		ref.edit(sel);
	},
	
	'click #removenode': function () {
		console.log("verwijder");
		var ref = $.jstree.reference('.maptree'),
			sel = ref.get_selected();
		if(!sel.length) { return false; }
		ref.delete_node(sel);
	},
	'keyup #search-tree': function () {
		var v = $('#search-tree').val();
		$.jstree.reference('.maptree').search(v);
	}
});




Template.map.rendered = function() {
   	var mapId = Router.current().params._id;
    if (mapId!=="new") {
    	console.log("vul de tree");
	    var map =  Maps.find ({_id: mapId }).fetch()[0];
		//map = {text: 'Afdelingen', type:'map', 'children': [{text: 'Topografie groep',children: [{ text: 'luchtfoto', type: 'layer'}, {text: 'top10 nl',type: 'layer'}], type: 'default' }, { text: 'percelen', type: 'layer' }],type: 'map'};
		$('.maptree').jstree ({
		    core: {
		      data: [
		            map
		       ],
		       check_callback : true
		},
		types : {
			"#" : {
			      "max_children" : 1,
			      "max_depth" : 4,
			      "valid_children" : ["map"]
			},
		    map : {
		      "icon" : "glyphicon glyphicon-tree-deciduous",
		      "valid_children" : ["default", "layer"],
		      //"li-attr" : []
		    },
		    "default" : {
		      "valid_children" : ["default", "layer"]
		    },
		    layer : {
		      "icon" : "logo.png",
		      "valid_children" : []
		    },
		   
		  },
		  checkbox : {
			    three_state : false,
			    tie_selection : false,
			    whole_node : false
			},
		plugins : ["dnd", "search","state", "types", "checkbox"]
		});
    }
}




