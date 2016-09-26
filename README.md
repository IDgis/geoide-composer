# Geoide Composer

Geoide Composer is gebouwd met meteorjs (Zie [Meteor](https://www.meteor.com/)).

## Installatie
### Instructie voor inrichten Windows machine voor Meteor 
  
#### Voorbereiding
Voor de volgende onderdelen dienen folders aangemaakt te worden.  
  *geoide-composer*   
    Bijvoorbeeld ``C:\Users\USER\geoide-composer\``    
    maak hierin de subfolders ``meteor\``, ``conf\`` en ``logs\``   
  *Windows service manager*      
    Bijvoorbeeld ``C:\Programs\`` of ``C:\Users\USER\nssm\``     

Zie folderstructuur hieronder  

#### Installeren basis programma's   
 * Meteor - develop/runtime omgeving  
 [Meteor Installatie](https://www.meteor.com/install), volg de instructies voor Windows.  
 Wordt lokaal geinstalleerd voor de ingelogde gebruiker:  
 ``C:\Users\USER\AppData\Local\.meteor\meteor.bat``   
 meteor.bat wordt gebruikt om applicatie op te starten. Deze wordt door NSSM (zie hieronder) ingesteld om als Windows service te draaien.   
   
 * NSSM - Windows Service Manager   
 [Installatie](https://nssm.cc/)   
 Download nssm 2.24 (2014-08-31) zip bestand    
 Zip uitpakken in bijvoorbeeld C:\Programs\ of C:\Users\USER\nssm\   
 Voeg een service toe door het volgende commando in een terminal uit te voeren:  
 ``C:\Programs\nssm-2.24\win64\nssm.exe install``   
 Zie instructies hieronder.   

#### Geoide-Composer als service starten   
   Start ``C:\Programs\nssm-2.24\win64\nssm.exe install`` in een OpdrachtPrompt en vul onderdelen in zoals in het voorbeeld hieronder.   
   In onderstaande is aangegeven wat in de diverse tabbladen van de nssm GUI moet worden ingevuld:
       
	*service name* e.g. geoide-composer   
	*Application\Path* De locatie van het nssm-install-meteor-service.bat script   
	  C:\Users\USER\geoide-composer\meteor\scripts   
	*Application\startup directory* meteor build e.g. C:\Users\USER\geoide-composer\meteor   
	*Application\Arguments* METEOR_PORT  
	  bijvoorbeeld 3010 
	  (elke meteor service moet een andere poortnummer worden toegwezen op de machine,   
	  bijvoorbeeld 3010, 3020, 3030 etc)    
	  Deze nummers mogen niet vlak bij elkaar liggen (dus niet 3000, 3001, 3002, etc)        
	*Details\display name* e.g. Geoide Composer   
	*Details\description* naar believen in te vullen    
	*Details\Startup type* e.g. manual     
	*Login\Log on* Vul in de gebruiker die meteor heeft geinstalleerd, LocalSystem bijvoorbeeld werkt niet         
	*IO\Output stdout* choose C:\Users\USER\geoide-composer\logs\out.log    
	*IO\Error stderr* choose C:\Users\USER\geoide-composer\logs\err.log    
    

Om een bestaande service aan te passen:   
``C:\Programs\nssm-2.24\win64\nssm.exe edit <service name>``

#### Verificatie   
  Kijk of de service onder de opgegeven naam is geinstalleerd (Windows beheer, services)   
  Als Geoide-Composer nog niet is gedeployed, voer dit dan eerst uit (zie hieronder).   
  Start de service en ga met een browser naar http://localhost:METEOR_PORT   
	
### Instructie voor deployment van nieuwe versie van Geoide Composer

1. Ga naar de link die is opgegeven voor de laatste Geoide-Composer release
2. download de release zip
3. stop de service ``geoide-composer``
4. ga naar ``C:\Users\USER\geoide-composer\meteor``
5. delete alles in deze folder
6. kopieer inhoud van zip (onder ``geoide-composer-ReleaseNr``, dus niet deze foldernaam zelf) naar ``C:\Users\USER\geoide-composer\meteor``
7. wijzig, indien nodig, in ``C:\Users\USER\geoide-composer\conf\settings.json`` de versie van het programma (met kladblok of Notepad++):  
zet het github release nummer in regel:	``"version": "0.0.22-SNAPSHOT",``
8. start de service ``geoide-composer`` 
9. NB 1: Het opstarten kan lang duren omdat meteor eerst de applicatie moet bouwen  
NB 2: applicatie logs zijn te vinden onder ``C:\Users\USER\geoide-composer\logs\``   
NB 3: configuratie moet in  ``C:\Users\USER\geoide-composer\conf\settings.json`` staan   
aanpassingen hierin worden vanzelf door meteor verwerkt, er is geen restart van de service nodig.  
Bij de eerste installatie van Geoide-Composer kan ``C:\Users\USER\geoide-composer\meteor\settings.json`` als leidraad dienen.   
 
### Folder structuur na voorbereiding en installatie
  *Geoide-Composer*  
  De geoide-composer applicatie    

    C:\Users\USER\geoide-composer\
     |-- meteor\ 
     |     (inhoud van zip file)
     |         \-- scripts
     |                 nssm-install-meteor-service.bat
     |-- logs\  
     |     out.log
     |     err.log
     |-- conf\
     |     settings.json
     

  *Windows service manager*  
  Om een meteor applicatie als Windows service te kunnen installeren   
    
    C:\Programs
     |-- nssm-2.2.4
  
## Configuratie   
 De configuratie van de geoide-composer staat in het bestand ``C:\Users\USER\geoide-composer\conf\settings.json``  
 Dit bestand heeft de volgende structuur:
 
    {
      "version": "1.0-SNAPSHOT",
      "viewer": {
        "reloadConfigUrl": "http://httpbin.org/get"
      },
      "legendGraphic": {
        "uploadFolder": "/tmp/.uploads/"
      },
      "requestcache": {
        "delay" : 600000 
      }
    }

Dit bestand kan gewijzigd worden met een teksteditor zoals Windows kladblok of NotePad++.
De onderdelen:
  * version - dit versie nummer wordt getoond in de GUI van de Geoide-Composer  
  * reloadConfigUrl - dit is een url van de Geoide-Viewer   
    Geoide-Composer roept deze url aan telkens als er iets wordt opgeslagen.    
  * delay - het interval in milliseconden waarin cache wordt geleegd.  
   (alle requests naar externe services (WMS, WFS, TMS) worden gecached,     
   regelmatig worden deze caches leeggemaakt om tussentijdse veranderingen in services mee te kunnen nemen)   


