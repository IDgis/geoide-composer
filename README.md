# Geoide Composer

Geoide Composer is gebouwd met meteorjs.   
Zie link [Meteor](https://www.meteor.com/)

## Installatie

### Instructie voor deployment van nieuwe versie van Geoide Composer

1. Ga naar de link die is opgegeven voor de laatste Geoide-Composer release
2. download de release zip
3. stop de service ``geoide-composer``
4. ga naar ``C:\geoide-composer\meteor``
5. delete alles in deze folder
6. kopieer inhoud van zip (onder ``geoide-composer-ReleaseNr``, dus niet deze foldernaam zelf) naar ``C:\geoide-composer\meteor``
7. wijzig, indien nodig, in ``C:\geoide-composer\settings.json`` de versie van het programma (met kladblok of Notepad++):  
zet het github release nummer in regel:	``"version": "0.0.22-SNAPSHOT",``
8. start de service ``geoide-composer`` en test in browser bijv. http://localhost:3010/
9. NB 1: Het opstarten kan lang duren omdat meteor eerst de applicatie moet bouwen  
NB 2: applicatie logs zijn te vinden onder ``C:\geoide-composer\logs\``   
NB 3: configuratie staat in ``C:\geoide-composer\settings.json``
aanpassingen hierin worden vanzelf door meteor verwerkt, geen restart van de service nodig.
 

### Instructie voor inrichten Windows machine voor Meteor en Mongo 
Begrippen:  

Conventie voor naamgeving   
  Windows service: geoide-composer-SERVICE_NAAM       
    bijv: geoide-composer-*test* geoide-composer-*prod*      
  

### Windows machine

#### Voorbereiding
Voor de volgende onderdelen dienen folders aangemaakt te worden.  
    *Mongo data en logs*  
    *Windows service manager*   
 	*geoide-composer deployment*  

Zie folderstructuur hieronder  

#### Installeren basis programma's   
 * Meteor - develop/runtime omgeving  
 [Meteor Installatie](https://www.meteor.com/install), volg de instructies voor Windows.  
 Wordt lokaal geinstalleerd voor de ingelogde gebruiker:  
 C:\Users\USER\AppData\Local\.meteor\meteor.bat   
 meteor.bat wordt gebruikt om applicatie op te starten. Deze wordt door NSSM (zie hieronder) ingesteld om als Windows service te draaien.   
   
 * NSSM - Windows Service Manager   
 [Installatie](https://nssm.cc/)   
   * Download nssm 2.24 (2014-08-31) zip bestand   
   * Zip uitpakken in bijvoorbeeld C:\Programs\   
   * Voeg een service toe door het volgende commando in een terminal uit te voeren:  
   ``C:\Programs\nssm-2.24\win64\nssm.exe install``   
   Bekijk het bestand ``nssm-install-meteor-service.bat`` voor instructies   
 
#### Folder structuur na voorbereiding en installatie
    *Geoide-Composer* 
    De geoide-composer applicatie, het script nssm-...bat wordt gebruikt om de geoide-composer als Windows service te draaien 

    C:\geoide-composer\
     |-- meteor\ 
     |     (inhoud van zip file)
     |         \-- scripts
     |                 nssm-install-meteor-service.bat
     |-- logs\  
     |     out.log
     |     err.log
     |
     | settings.json 
     
    *Windows service manager* 

    Om een meteor applicatie als Windows service te kunnen installeren
    
    C:\Programs
     |-- nssm-2.2.4
  

#### Geoide-Composer als service starten   
    
   *nssm-install-meteor-service.bat*   
   start C:\Programs\nssm-2.24\win64\nssm.exe install en vul onderdelen in zoals in het voorbeeld hieronder.   
   In onderstaande is aangegeven wat in de diverse tabbladen van de nssm GUI moet worden ingevuld:
       
	*Application\Path* De locatie van het nssm-install-meteor-service.bat script   
	*Application\startup directory* meteor build e.g. C:\geoide-composer\   
	*Application\service name* e.g. geoide-composer-TEST   
	*Application\Arguments* METEOR_PORT  
	  bijvoorbeeld 3010 (elke meteor service moet een andere poortnummer worden toegwezen op de machine, bijvoorbeeld 3010, 3020, 3030 etc) Deze nummers mogen niet vlak bij elkaar liggen (dus niet 3000, 3001, 3002, etc)     
	*Details\display name* e.g. geoide-composer   
	*Details\description* naar believen in te vullen    
	*Startup type* e.g. manual     
	*Login\Log on* Vul in de gebruiker die metero heeft geinstalleerd, LocalSystem oid gaat niet werken       
	*IO\Output stdout* choose C:\geoide-composer\logs\out.log    
	*IO\Error stderr* choose C:\geoide-composer\logs\err.log    
    

#### verificatie   
  kijk of de service onder de opgegeven naam is geinstalleerd (Windows beheer, services)   
  start de service en ga met een browser naar http://localhost:METEOR_PORT   
	

