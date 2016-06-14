Template.jsData.onRendered(function () {
  this.$('.tree').jstree({
    core: {
      data: [{ 
        text: 'Afdelingen', 'children': [{
          text: 'Topografie groep', 
          children: [
	          {
	        	  text: 'luchtfoto',
	        	  type: 'layer'
	          },
	          {
	        	  text: 'top10 nl',
	        	  type: 'layer'
	          }],
          type: 'default'
        }, {
          text: 'percelen',
          type: 'layer'
        }],
        type: 'map'
      }],
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
        }
      },
    
    plugins : ["contextmenu", "dnd", "search",
               "state", "types", "wholerow"]
  });
});

Template.jsData.events({
	'click .jstree': function () {
		console.log("geklikt");
	},
	'click #submit-button': function () {
		console.log($.jstree.reference('.tree').data());
	},
	'click #reset-button': function () {
		var v = $.jstree.reference('.tree').get_json('#');
		
		
		
		console.log(v);
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

/* listen for event
.on('changed.jstree', function (e, data) {
	console.log("ben veranderd");
  var i, j, r = [];
  for(i = 0, j = data.selected.length; i < j; i++) {
    r.push(data.instance.get_node(data.selected[i]).text);
  }
  $('#event_result').html('Selected: ' + r.join(', '));
});*/