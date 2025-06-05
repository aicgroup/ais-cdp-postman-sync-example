
# Use Cases – Contact Data Platform API

Dieses Dokument beschreibt typische Anwendungsfälle (Use Cases) für die `contact-data-platform-svc` API. Jeder Anwendungsfall beschreibt den fachlichen Kontext, das erwartete Verhalten und ggf. relevante Endpunkte oder Parameter.
Zugrunde liegt eine SchemaEntity dp.Contacts, so dass alle CRUD Routen generiert werden können.

## 📤 Export von Kontakten

**title**: Export von Kontakten  
**subtitle**: Zielgruppen exportieren zur weiteren Verarbeitung in CRM-Systemen  
**explanation**: Dieser Use Case beschreibt, wie Benutzer gespeicherte Zielgruppen exportieren können, um diese z. B. in externe CRM-Systeme zu übernehmen oder lokal weiterzuverarbeiten. Der Export erfolgt asynchron und liefert nach Abschluss eine herunterladbare Datei.

**Ziel:** Ein Nutzer möchte eine Zielgruppe exportieren, um die Daten in ein CRM-System zu übernehmen.

**Ablauf:**

- Der Nutzer wählt eine gespeicherte Zielgruppe aus.
- Ein Exportauftrag wird über die API angestoßen (`POST /exports`).
- Die API gibt ein `202 Accepted` zurück und stellt eine `operationId` zur Verfügung.
- Der Nutzer kann den Status des Exports über `GET /exports/{operationId}` abrufen.

**Hinweise:**

- Der Export erfolgt asynchron.
- Die Daten werden nach Abschluss als Datei über einen temporären Download-Link bereitgestellt.

## 🏷 Tagging von Kontakten

**Ziel:** Ein Nutzer möchte einer bestimmten Zielgruppe ein neues Attribut (Tag) zuweisen.

**Ablauf:**

- Der Nutzer erstellt ein neues Tag über `POST /tags`.
- Danach wird ein Tagging-Vorgang über `POST /tag-assignments` angestoßen, unter Angabe einer Zielgruppen-ID.
- Die API gibt ein `202 Accepted` zurück, da der Vorgang im Hintergrund erfolgt.

**Hinweise:**

- Die Zielgruppe darf nicht leer sein.
- Ein erfolgreicher Abschluss wird über `GET /tag-assignments/{operationId}` überprüft.

## 📥 Import von Kontakten

**Ziel:** Ein Partner möchte einen Datensatz von neuen Kontakten in das System einspielen.

**Ablauf:**

- Der Partner überträgt eine CSV-Datei über `POST /imports`.
- Die API nimmt die Datei entgegen, prüft das Format und gibt ein `202 Accepted` zurück.
- Der Fortschritt kann über `GET /imports/{operationId}` abgefragt werden.

**Hinweise:**

- Nur registrierte Partner dürfen diesen Endpunkt nutzen.
- Die Validierung erfolgt schrittweise im Backend und kann Fehlermeldungen auslösen (z. B. bei Duplikaten oder fehlenden Pflichtfeldern).
