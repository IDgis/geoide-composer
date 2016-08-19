i18n.map('nl', {
  // GUI
  main : {
    title : 'Geoide Composer',
    menu  : {
      home: 'Home',
      services: 'Services',
      layers: 'Lagen',
      maps: 'Kaarten',
      users: 'Gebruikers',
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
    messages : 'meldingen',
    loggedin : 'Ingelogd als: ',
    notloggedin : 'Niet ingelogd',
    home:{
      template: "home-nl",
    },
  },
  
  services:{
    list: {
      header: 'Services',
      table: {
        name: 'Naam',
        label: 'Label',
        type: 'Type',
        version: 'Versie',
      },
      button: {
        create: 'Maak een nieuwe service'
      },
    },
    autoform: {
      header:'Service configuratie',
    },
    help:{
      template: "help-services-nl",
    },
  },
  
  layers: {
    list: {
      header: 'Lagen',
      table: {
        name: 'Naam',
        label: 'Label',
        type: 'Type',
        visible: 'Zichtbaar'
      },
      button: {
        create: 'Maak een nieuwe laag'
      },
    },
    autoform: {
      header:'Laag configuratie',
    },
    help:{
      template: "help-layers-nl",
    },
  },
  
  maps: {
    list: {
      header: 'Kaarten',
      table: {
        name: 'Naam',
        label: 'Label',
        layers: 'Hoofdlagen',
      },
      button: {
        create: 'Maak een nieuwe kaart'
      },
    },
    autoform: {
      header: 'Kaart configuratie',
      layerselect: 'Kies een laag',
      createlayer: 'Nieuwe laag +',
      creategroup: 'Nieuwe groep +',
      renamenode: 'Hernoem laag/groep',
      removenode: 'Verwijder laag/groep X',
    },
    tree: {
      search : {
        placeholder : 'Zoek'
      },
      label: 'Kaart'
    },
    help:{
      template: "help-maps-nl",
    },
  },

  users:{
    list: {
      header: 'Gebruikers',
      table: {
        name: 'Naam',
        role: 'Rol',
      },
      button: {
        create: 'Maak een nieuwe gebruiker'
      },
    },
    autoform: {
      header:'Gebruiker configuratie',
    },
    
  },
  
  //Tooltips
  tooltips:{
    main: {      
      login: "Log in",
      menu: {
    	home: "Keer terug naar de start pagina", 
        services: "Maak en beheer services",
        layers: "Maak en beheer lagen",
        maps: "Maak en beheer kaarten"
      },
      
    },
    layers:{
      list:{
        button: {
          create: "Maak een nieuwe laag aan",
          edit: "Wijzig een laag",
          remove: "Verwijder een laag",
        }
      },
      autoform: {
        fields: {
          name: "Geef een (unieke) naam aan de service",
          label: "Geef een omschrijving van de service (wordt getoond in de viewer)",
          type: "Het type van deze laag",
          properties: {
            main: "Eigenschappen van de laag",
            initialVisible: "Is de laag initieel (on)zichtbaar",
            appLayer: "Is de laag een CRS2 laag",
            initialQuery: "De sql query voor deze laag indien van type 'cosurvey-sql'",
          },
          serviceLayers: {
            main: "Service lagen",
            label: "Geef een omschrijving (optioneel)",
            service: "Kies de WMS of TMS service",
            nameInService: "Kies de service laag",
            featureType: "Het featuretype bij deze laag",
            legendGraphic: "De legenda bij deze laag, kan worden vervangen door een eigen legenda afbeelding",
          },
          featureType: {
            label: "Geef een omschrijving",
            service: "Kies de WFS service",
            nameInWfsService: "Kies het service feature type",
            searchTemplates: "Zoekingangen voor velden van het feature type",
            
          },
          searchTemplate: {
            label: "Geef een omschrijving",
            attributeLocalname: "Veld van het feature type",
            attributeNamespace: "Namespace van het feature type (wordt automatisch gevuld)",
          }
        },
        button: {
          save: 'Opslaan',
          cancel:'Annuleren',
        },
      },
    },
    services: {
      list:{
        button: {
          create: "Maak een nieuwe service aan",
          edit: "Wijzig een service",
          remove: "Verwijder een service",
        }
      },
      autoform: {
        fields: {
          name: "Geef een (unieke) naam aan de service",
          label: "Geef een omschrijving van de service (wordt getoond in de viewer)",
          endpoint: "Geef de basis url van de service, afgesloten met een '?'",
          type: "Kies het service type",
          version: "Kies de versie van de service",
        },
        button: {
          save: 'Opslaan',
          cancel:'Annuleren',
        },
      },
    },
    maps: {
      list:{
        button: {
          create: "Maak een nieuwe kaart aan",
          edit: "Wijzig een kaart",
          remove: "Verwijder een kaart",
        }
      },
      autoform: {
        fields: {
          name: "Geef een (unieke) naam aan de kaart",
          label: "Geef een omschrijving  (wordt getoond in de viewer)",
          initial_visible : "Maak een laag of groep initieel (on)zichtbaar ",
          initial_extent: {
            label: "Bounding box van de kaart",
            minx: "minimum waarde van x",
            miny: "minimum waarde van y",
            maxx: "maximum waarde van x",
            maxy: "maximum waarde van y",
          },
        },
        createlayer: 'Nieuwe laag +',
        creategroup: 'Nieuwe groep +',
        renamenode: 'Hernoem groep',
        removenode: 'Verwijder laag/groep X',
      },
      jstree: {
        main: "Verander volgorde door slepen en neerzetten",
        select: "Selecteer een laag",
        search: "Zoek op (groeps)laag naam",
        button: {
          save: 'Opslaan',
          cancel:'Annuleren'
        },
      },
    },
    legendgraphic: {
      button: {
        remove: "Verwijder een legenda plaatje",
      },
    },
  },
  
//Collections
	collections : {
	  firstOption: '(Selecteer)',
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
				legendGraphic : {
          label : 'Legend Graphic'
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
    users: {
      name : {
        label : 'Naam',
      },
      role : {
        label: "Rol",
      },
    },
    confirmation: {
      "delete" :{
        title: "Verwijderen",
        cancel: "Annuleren",
        ok: "OK",
        message: {
          services: "Wilt u deze service verwijderen?",
          layers: "Wilt u deze laag verwijderen?",
          maps: "Wilt u deze kaart verwijderen?",
        },
      },
    },
  },



  // Generiek
  version: 'versie',
  button: {
    save: 'Opslaan',
    cancel:'Annuleren',
    help: "Help",
    close: "Sluiten",
    remove: "Verwijder",
  },
  yes: 'Ja',
  no: 'Nee',
  
});