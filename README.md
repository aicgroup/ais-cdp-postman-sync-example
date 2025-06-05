# API-Dokumentation und Postman-Integration

Dieses Repository dient der strukturierten Pflege von Postman-Collections anhand fachlicher Use Cases, technischer Anforderungen und allgemeiner Konventionen.

Die Postman-Collections werden nicht manuell, sondern durch Agenten wie GitHub Copilot kontinuierlich überarbeitet. Ziel ist es, die API-Dokumentation konsistent, nachvollziehbar und stets aktuell zu halten.

> ⚠️ Bestehende Collection-Dateien wie `collections/gaaaaaaaaaaaaaaaanzLaaaaaaaaaaaangeID.json` werden **nicht ersetzt**, sondern ausschließlich **ergänzt und aktualisiert**.
> Bitte **keine neuen Collection-Dateien anlegen**. Die ID stammt aus dem Postman-Sync und darf **nicht umbenannt** werden.

Bei Unsicherheit bitte Rücksprache mit dem Projektteam.

## Postman Collection Synchronisation

Dieses Repository dient der strukturierten Überarbeitung und Pflege von Postman-Collections auf Basis von Use-Cases, Projektanforderungen und generellen Stilvorgaben.

## Struktur und Arbeitsweise

Jede Postman-Collection besitzt ein zugehöriges Verzeichnis im Projekt-Root (z. B. `ais-contact-data-platform-svc`). Darin befinden sich:

- `project-requirements.md`: projektspezifische Ergänzungen und Rahmenbedingungen
- `use-cases.md`: fachliche Use Cases als Grundlage für die API-Generierung

Diese Dateien bauen auf `.github/copilot-instructions.md` auf, welches globale Regeln und Konventionen für alle Collections definiert.

Die Dokumentation und Weiterentwicklung der Postman-Collections erfolgt in drei aufeinander abgestimmten Dateien:

---

### 🔧 [`copilot-instructions.md`](.github/copilot-instructions.md)

**Gültig für alle Collections.**  
Enthält zentrale Stilregeln, Namenskonventionen, Authentifizierungsrichtlinien, URL-Schemata, Fehlerverhalten, Formatvorgaben für Beispiele sowie das Verhalten des Agenten.

Beispiele:

- Authentifizierung via Keycloak
- CRUD-Konventionen für `SchemaEntities`
- Nutzung von Variablen wie `{{projectId}}`
- Regeln zur Dokumentationsgenerierung (z. B. Abschnittsstruktur)

---

### 🧭 `collections/<collection-name>/project-requirements.md`

**Spezifisch für eine Collection.**  
Beschreibt projektspezifische Konventionen, Eigenheiten und besondere Anforderungen, die über die allgemeinen Vorgaben hinausgehen. Ergänzt die allgemeinen Regeln aus den Copilot-Instructions.

Beispiele:

- Besondere Asynchronitätskonzepte
- Erweiterte Fehlercodes oder Statusobjekte
- Abweichende Pfadstrukturen

---

### 📘 `collections/<collection-name>/use-cases.md`

**Datei pro Collection.**  
Jeder Eintrag beschreibt eine fachliche Funktionalität (Use Case) mit Titel, Untertitel, Beschreibung und zugehörigen Endpunkten. Dies dient als Grundlage für die Generierung und Verbesserung der API-Endpunkte in der Postman-Collection.

Beispiele:

- Zielgruppensuche mit Filterparametern
- Versand eines Exports mit Status-Callback
- Verwaltung von Merkmalgruppen

---

## Wichtig: Arbeit mit Postman-Dateien

- Jede Collection liegt als Datei `collections/<postman-id>.json` vor (z. B. `collections/9837006-9404c807-2003-4790-b77b-183431c560f9.json`).
- Diese Dateien stammen aus dem Postman Repository Sync.
- Die Datei wird **nicht ersetzt**, sondern fortlaufend **ergänzt und angepasst**.
- Neue Collections sollen **nicht manuell** angelegt werden.
- Der Name der Collection wird über `info.name` im JSON ermittelt und muss mit dem Ordnernamen im Projekt-Root übereinstimmen (z. B. `ais-contact-data-platform-svc/`).

---

## Befehle für Agenten

Zur Steuerung der Agenten können folgende Kommandos in PRs oder Commit-Messages verwendet werden:

- `sync <collection-name>` – Aktualisiert die Collection auf Basis des aktuellen Use-Case-Dokuments.
- `sync-all` – Führt die Synchronisation für alle Use-Case-Dokumente durch.
- `init <collection-name>` – Erstellt ein neues Use-Case-Dokument basierend auf der vorhandenen Collection.
- `generate <collection-name>` – Erstellt eine neue Collection basierend auf einem vollständigen Use-Case-Dokument.

---

## Fragen?

Bei Unsicherheiten bitte Rücksprache mit dem Projektteam halten oder einen PR mit `@review` markieren.
