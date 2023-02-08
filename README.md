# Employee Managment Frontend

Dies ist das Repository von Fabian, Malek und Moritz für das Projekt im Lernfach 10.

## Besonderheiten
Wir haben uns die _Mühe_ gemacht tsdocs aufzusetzen und diese mit Compodocs zu bauen. Diese sind unter https://mlhmz.github.io/ems-frontend/ zu finden

Außerdem haben wir coole Build Pipelines die das Projekt bauen und eslint drauf laufen lassen.

_wir sind eslint error & warning free ;))_

## Features
Grundsätzlich haben wir natürlich die gewöhnlichen CRUD-Funktionen implementiert.

Bennenbare Features sind:
* Viel doppelten Code durch parametrisierbare Components mit Emits reduziert
* Eine Suche implementiert
* Einen Editor der Qualifikationen mit Tag-Inputs und Suggestions hinzufügen lässt
* Validatoren implementiert
* Web-App responsive gemacht

## Bugs
* Third-Party-Cookies: Bei Browsern die Third-Party-Cookies deaktiviert haben (u.a. Firefox), funktioniert Keycloak nicht.
  Um dies zu beheben können Third-Party-Cookies aktiviert werden. 

## Requirements

* Docker https://docs.docker.com/get-docker/
* Docker compose (bei Windows und Mac schon in Docker enthalten) https://docs.docker.com/compose/install/

### Terminal öffnen

für alles gilt, im Terminal im Ordner docker sein

```bash
cd docker
```

### Abhängigkeiten starten (Postgres, EmployeeBackend)

```bash
docker compose up
```

Achtung: Der Docker-Container läuft dauerhaft! Wenn er nicht mehr benötigt wird, solltest du ihn stoppen.

### Abhängigkeiten stoppen

```bash
docker compose down
```

### Postgres Datenbank wipen, z.B. bei Problemen

```bash
docker compose down
docker volume rm docker_employee_postgres_data
docker compose up
```

### Docker-Stack unter IntelliJ hinzufügen
Alternativ kann auch der Docker-Stack mit den IntelliJ Services ausgeführt werden.
Dazu muss der Docker Host auf dem "Services"-Tab in der IDE hinzugefügt werden und
in IntelliJ in der Compose auf den Start-Knopf gedrückt werden. Somit sollte
automatisch der Stack von IntelliJ gehandled werden

## Swagger des Backends

```
http://localhost:8089/swagger
```

# Postgres

```

### Intellij-Ansicht für Postgres Datenbank einrichten (geht nicht in Webstorm!)

```bash
1. Lasse den Docker-Container mit den Abhängigkeiten laufen
2. rechts im Fenster den Reiter Database öffnen
3. In der Database-Symbolleiste auf das Datenbanksymbol mit dem Schlüssel klicken
4. auf das Pluszeichen klicken
5. Datasource from URL auswählen
6. URL der DB einfügen (jdbc:postgresql://localhost:5432/employee_db) und PostgreSQL-Treiber auswählen, mit OK bestätigen
7. Username lf10_starter und Passwort secret eintragen (siehe application.properties), mit Apply bestätigen
8. im Reiter Schemas alle Häkchen entfernen und lediglich vor lf10_starter_db und public Häkchen setzen
9. mit Apply und ok bestätigen 
```

## Keycloak-Integration

Das Login ist als Single Sign On für alle Applikationen der HiTec GmbH implementiert. 

Der Benutzer, mit dem die Integration getestet werden kann, hat den Benutzernamen user und das Passwort test. Die einzige Rolle heißt user.

Des Weiteren ist der Client mit der Bezeichnung employee-management-service-frontend wie folgt konfiguriert:

Die Konfigurationen können unter dem "resources"-Ordner gefunden werden.

# Bugs

Trage hier die Features ein, die nicht funktionieren. Beschreibe den jeweiligen Fehler. 

