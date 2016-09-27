@echo off
rem -------- INTRO -------
rem This script can be run standalone 
rem to start a meteor instance for an application:
rem   Start it in the folder of the meteor application
rem or 
rem as the script in a NSSM service installation:
rem   Start 'nssm install' and fill in the fields described below
rem v---v NSSM v---v
rem https://nssm.cc/
rem nssm install (starts GUI with Admin rights)
rem Application\Path this script
rem Application\startup directory meteor build e.g. C:\geoide-admin\deployment\TEST\
rem Application\service name e.g. geoide-admin-TEST
rem Application\Arguments: METEOR_PORT    
rem   e.g. 3010  
rem METEOR_PORT=3010, 3020, ... (even numbers, one for every meteor application)
set METEOR_PORT_=%1
rem Details\display name e.g. geoide-admin-TEST
rem Details\description
rem Startup type e.g. manual
rem Login\Log on as the User that installed meteor
rem IO\Output stdout choose C:\geoide-admin\logs\TEST\out.log
rem IO\Error stderr choose C:\geoide-admin\logs\TEST\err.log
rem ^---^ NSSM ^---^
rem -----------------
rem  check arguments
rem -----------------

rem !!!!  T.B.D.  !!!!
rem if METEOR_PORT_=="" exit 1
rem -----------------
set PORT=%METEOR_PORT_%
set ROOT_URL=http://localhost:%METEOR_PORT_%
@echo Start meteor
meteor --port %METEOR_PORT_% --settings ../conf/settings.json

