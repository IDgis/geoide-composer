i18n.map('en', {
	// GUI
	main : {
		title : 'Geoide Admin',
		menu : {
			services : 'Services',
			layers : 'Layers',
			maps : 'Maps',
      i18n: 'i18n - test',
      jsonapi: {
        services: 'jsonapi - services',
        layers: 'jsonapi - layers',
        maps: 'jsonapi - maps',
      },
      xmlapi: 'xmlapi - test',
		},
		messages : 'messages'
	},

  services:{
    list: {
      header: 'Services',
      table: {
        name: 'Name',
        type: 'Type',
      },
      button: {
        create: 'Make a new service'
      },
    },
    autoform: {
      header:'Service configuration',
    },
    
  },
  
  layers: {
    list: {
      header: 'Layers',
      table: {
        name: 'Name',
        type: 'Type',
      },
      button: {
        create: 'Make a new layer'
      },
    },
    autoform: {
      header:'Laag configuration',
    },
  },
  
  maps: {
    list: {
      header: 'Maps',
      button: {
        create: 'Make a new map'
      },
    },
    autoform: {
      header:'Kaart configuration',
    },
    tree: {
      search : {
        placeholder : 'Search'
      },
    },
  },

	// Collections
	collections : {
    services : {
      name : {
        label : 'Name',
      },
      label : {
        label : 'Label',
      },
      endpoint : {
        label : 'Url',
      },
      type : {
        label : 'Type',
      },
      version : {
        label : 'Version',
      },
    },
    layers : {
			name : {
				label : 'Name',
			},
      label : {
        label : 'Label',
      },
			type : {
				label : 'Type',
			},
			service_layers : {
				label : 'Servicelayers',
			},
			properties : {
				label : 'Properties',
				initial_visible : {
					label : 'Initial visible',
				},
				initial_query : {
					label : 'Initial query',
				},
				applayer : {
					label : 'CRS2 layer',
				},
			},
			service_layer : {
				name : {
					label : 'Name',
				},
	      label : {
	        label : 'Label',
	      },
				service : {
					label : 'Service',
				},
				nameInService : {
					label : 'Servicelayername',
				},
				wfs_service : {
					label : 'WFS service',
				},
				featureTypes : {
					label : 'WFS Featuretypes'
				},
				featureType : {
					name : {
						label : 'Name',
					},
		      label : {
		        label : 'Label',
		      },
					service : {
						label : 'Service',
					},
					nameInService : {
						label : 'FeatureType name'
					},
					searchTemplates : {
						label : 'Searchtemplates'
					},
					searchTemplate : {
						label : {
							label : 'Label',
						},
						attribute_localname : {
							label : 'Search field',
						},
						attribute_namespace : {
							label : 'Namespace',
						},
					},
				},
			},
		},

		maps : {
			name : {
				label : "Map name",
			},
      label : {
        label : 'Label',
      },
			initial_extent : {
				label : "Initial extent",
				minX : {
					label : "min X",
				},
				minY : {
					label : "min Y",
				},
				maxX : {
					label : "max X",
				},
				maxY : {
					label : "max Y"
				},
			},
		},
	},

	// General
	version : 'version',

});