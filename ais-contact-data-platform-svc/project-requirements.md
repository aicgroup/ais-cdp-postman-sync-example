# Projektanforderungen – Contact Data Platform API

## Einordnung

Dieses Dokument ergänzt die allgemeinen technischen und stilistischen Spezifikationen aus `.github/copilot-instructions.md` und definiert projektspezifische Anforderungen für die Collection `contact-data-platform-svc`.

Dieses Dokument beschreibt technische und architektonische Rahmenbedingungen für die Postman Collection `contact-data-platform-svc`.

## Fehlerverhalten

Sofern nicht anders spezifiziert, gelten die allgemeinen Fehlerkonventionen gemäß `.github/copilot-instructions.md`.

Für diese API gelten zusätzlich folgende Besonderheiten:

- `422 Unprocessable Entity` wird bei validen, aber nicht speicherbaren Daten verwendet (z. B. Geschäftsregeln verletzt).
- `503 Service Unavailable` wird bei überlasteten Subsystemen (z. B. Tagging-Service) zurückgegeben.
