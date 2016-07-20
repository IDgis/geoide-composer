i18n.map('nl', {
  // GUI
  main : {
    title : 'Geoide Admin',
    menu  : {
      services: 'Services',
      layers: 'Lagen',
      maps: 'Kaarten',
      i18n: 'i18n - test',
      jsonapi: {
        services: 'jsonapi - services',
        layers: 'jsonapi - lagen',
        maps: 'jsonapi - kaarten',
      },
      jsonGvApi: {
        services: 'jsonapi GV - Services',
        layers: 'jsonapi GV - Lagen',
        maps: 'jsonapi GV - Kaarten',
        featuretypes: 'jsonapi GV - Feaure Types',
        searchtemplates: 'jsonapi GV - Search Templates',
        servicelayers: 'jsonapi GV - Service Layers',
      },
      xmlapi: 'xmlapi - test',
      getcaplayersapi: 'getcaplayersapi - test',
    },
    messages : 'meldingen'
  },
  
  services:{
    list: {
      header: 'Services',
      table: {
        name: 'Naam',
        type: 'Type',
      },
      button: {
        create: 'Maak een nieuwe service'
      },
    },
    autoform: {
      header:'Service configuratie',
    },
    
  },
  
  layers: {
    list: {
      header: 'Lagen',
      table: {
        name: 'Naam',
        type: 'Type',
      },
      button: {
        create: 'Maak een nieuwe laag'
      },
    },
    autoform: {
      header:'Laag configuratie',
    },
  },
  
  maps: {
    list: {
      header: 'Kaarten',
      button: {
        create: 'Maak een nieuwe kaart'
      },
    },
    autoform: {
      header:'Kaart configuratie',
    },
    tree: {
      search : {
        placeholder : 'Zoek'
      },
    },
  },
  
//Collections
	collections : {
    services : {
      name : {
        label : 'Naam',
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
        label : 'Versie',
      },
    },
    layers : {
      name : {
        label : 'Naam',
      },
      label : {
        label : 'Label',
      },
			type : {
				label : 'Type',
			},
			serviceLayers : {
				label : 'Servicelagen',
			},
			properties : {
				label : 'Eigenschappen',
				initialVisible : {
					label : 'Initiëel zichtbaar',
				},
				initialQuery : {
					label : 'Initiële query',
				},
				applayer : {
					label : 'CRS2 laag',
				},
			},
			serviceLayer : {
	      name : {
	        label : 'Naam',
	      },
	      label : {
	        label : 'Label',
	      },
				service : {
					label : 'Service',
				},
				nameInService : {
					label : 'Service laagnaam',
				},
				wfsService : {
					label : 'WFS service',
				},
				featureTypes : {
					label : 'WFS Featuretypes'
				},
				featureType : {
		      name : {
		        label : 'Naam',
		      },
		      label : {
		        label : 'Label',
		      },
					service : {
						label : 'Service',
					},
					nameInService : {
						label : 'FeatureType naam'
					},
					searchTemplates : {
						label : 'Zoekingangen'
					},
					searchTemplate : {
						label : {
							label : 'Label',
						},
						attributeLocalname : {
							label : 'Zoekveld',
						},
						attributeNamespace : {
							label : 'Namespace',
						},
					},
				},
			},
		},
		maps: {
      name : {
        label : 'Naam',
      },
      label : {
				label: "Label",
			},
			initialExtent: {
				label: "Initiële kaartuitsnede",
				minX: {
					label: "min X",
				},
				minY: {
					label: "min Y",
				},
				maxX: {
					label: "max X",
				},
				maxY: {
					label: "max Y"
				},
			},
			
		},
	},

  // Generiek
  version: 'versie',
  button: {
    save: 'Opslaan',
    cancel:'Annuleren'
  },

  
});