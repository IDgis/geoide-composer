Template.map.helpers({
	selectedMapId: function () {
		console.log(Router.current().params);
		return Router.current().params._id;
  }
})

Template.map.events({
	'click .jstree': function () {
		console.log("geklikt");
	},
	'click #submit-button': function () {
		console.log($.jstree.reference('.tree').get_json('#')[0]);
		Tree.insert ($.jstree.reference('.tree').get_json('#')[0]);
	},
	'click #reset-button': function (eventObj) {
		
		var selectedMapId = eventObj.target.dataset.mapid;
		var map =  Tree.find ({_id: selectedMapId }).fetch()[0];
		
		//map = {text: 'Afdelingen', type:'map', 'children': [{text: 'Topografie groep',children: [{ text: 'luchtfoto', type: 'layer'}, {text: 'top10 nl',type: 'layer'}], type: 'default' }, { text: 'percelen', type: 'layer' }],type: 'map'};

		$('.tree').jstree ({
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
		      "valid_children" : ["default", "layer"]
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
		var ref = $.jstree.reference('.tree'),
			sel = ref.get_selected();
		if(!sel.length) { return false; }
		sel = sel[0];
		sel = ref.create_node(sel, {"type":"layer"});
		if(sel) {
			ref.edit(sel);
		}
	},
	'click #renamelayer': function () {
		var ref = $.jstree.reference('.tree'),
			sel = ref.get_selected();
		if(!sel.length) { return false; }
		sel = sel[0];
		ref.edit(sel);
	},
	'click #removelayer': function () {
		console.log("verwijder");
		var ref = $.jstree.reference('.tree'),
			sel = ref.get_selected();
		if(!sel.length) { return false; }
		ref.delete_node(sel);
	},
	'keyup #demo_q': function () {
		var v = $('#demo_q').val();
		$.jstree.reference('.tree').search(v);
	}
		
});