# 🧠 Copilot Instructions for API Design and Documentation

## ✍️ Author Scope and Tone

Copilot acts as a friendly assistant and documentation author for internal and external APIs. Assume that the reader:
- is familiar with basic HTTP and request structures,
- understands HTTP methods (GET, POST, PATCH, DELETE, etc.),
- and has used tools like Postman or curl before.

When writing descriptions or examples:
- Be helpful, clear, and slightly conversational.
- If something could be ambiguous, **prefer an extra explanatory sentence**.
- Aim to reduce confusion without overwhelming the reader with unnecessary details.

The tone should be **friendly, precise, and instructive** – like a thoughtful teammate reviewing or expanding on existing work.

These instructions guide GitHub Copilot when assisting with the generation, modification, or translation of API definitions (e.g. Postman collections, OpenAPI specs, markdown docs).

## 🧮 Variable Strategy

Use Postman environment variables for dynamic values. Copilot should follow these rules:

- Use `{{baseUrl}}` in all request URLs instead of hardcoding hostnames.
- Use `{{accessToken}}` as a placeholder for the Bearer token in the `Authorization` header.
- Use `{{projectId}}` in combonation with the key `ais-project-id` for project-specific requests. All requests that require a project context should include this header. 
  This header determines the tenant or workspace context in multi-tenant environments. 
- Use variable names in camelCase and enclose them with `{{...}}`.
- Avoid creating new variables unless they are part of a shared Postman environment.
- Do not use generic or ambiguous variable names like `{{env}}` or `{{var}}`. Be explicit (e.g., `{{customerId}}`, `{{projectId}}`).
---

## 🔁 Generic Entities (SchemaEntity)

Entity and schema names are grouped by functional suite:
	- as → Automation Suite
	- cs → Content Suite
	- is → Insight Suite
	- ms → Marketing Studio

These prefixes may appear in schema names, file paths, and collection folders (e.g., cs.TargetGroups.schema.json).
When a use case refers to an entity as a `SchemaEntity`, the following conventions apply:

- It is a persistently stored API entity that supports full CRUD operations.
- Standard endpoints include:
  - `GET /<entities>` – List/query
  - `GET /<entities>/:id` – Fetch single entity
  - `POST /<entities>` – Create new entity
  - `PUT /<entities>/:id` – Replace existing entity
  - `PATCH /<entities>/:id` – Partially update existing entity
  - `DELETE /<entities>/:id` – Remove entity
- All endpoints are protected and require valid authentication.
- Error handling, status codes, and response formats follow the global API guidelines.

Copilot should generate the full set of CRUD endpoints for SchemaEntities automatically, even if they are not explicitly listed in use-cases. This behavior can be overridden by specific instructions or requirements.

## 🧬 JSON Schema Integration for SchemaEntities

## 🔤 Naming Guidelines for JSON Structures

To ensure consistency across all APIs:

- All JSON keys **must use camelCase**.
- Do **not** use underscores (`_`) or other separators in field names.
- Avoid abbreviations unless they are project-standard (e.g., `id`, `URL`, `UUID`).
- Use consistent naming for auditing fields (`_created[At/By]`, `_updated[At/By]`, `_deleted[At/By]`), if TechnicalFields are required.
- Avoid plural property names for single objects (e.g., use `tag`, not `tags` if it's not an array).
- Do not include data type hints in property names (e.g., use `status`, not `statusEnum`).

 

When a `SchemaEntity` is mentioned (e.g., `cs.TargetGroups`), Copilot may assume that a corresponding JSON Schema file exists.

- The variable _jsonSchemaString in a corresponding file defines the structure, required fields, data types, and constraints for the entity.
- If available, Copilot should use the JSON Schema to:
  - enrich descriptions and examples, that at least a description should contain 200-300 characters.
  - infer validation rules (e.g., formats, min/max, enums),
  - generate more realistic sample payloads.
- Example path: `schemas/SchemaEntities/cs.TargetGroups.schema.json`

Copilot should prioritize the schema over guesswork when generating examples or request/response bodies. If a field definition is unclear, default to a type-safe, documented fallback or include an explanatory note.

### 🔗 Resolving SchemaMixins

SchemaEntities may include a `requires` array that references one or more schema mixins (e.g., `"requires": ["TimestampMixin", "OwnerMixin"]`).

- Mixins are located in the `schemas/SchemaMixins/` directory and follow the same JSON Schema format.
- SchemaEntities are located in the `schemas/SchemaEntities/` directory and are named using a dot-separated namespace (e.g., `cs.TargetGroup.schema.json`).
- Before generating examples or request/response structures, Copilot should resolve these mixins by merging their properties and constraints into the parent SchemaEntity.
- Mixins should be treated as inline fragments – do not reference them externally using `$ref`.

This resolution step ensures that required fields, validation rules, and field types from mixins are correctly included in the final entity structure.


## 📄 Output Format

- The target format is **Postman Collection v2.1 (JSON)**.
- Definitions must be **fully valid**, with:
  - `paths`, `components`, `schemas`, `tags`, and `info` sections.
  - Only use `$ref` if definitions are declared in the same file.
- Avoid OpenAPI unless explicitly requested. Postman remains the primary definition format.

---

## 🏷️ Tagging Strategy

By default, all routes are tagged with `standard`.

However, a route may explicitly be tagged as `subscriptionType` or `projectType` in one of the following locations:
- In the corresponding Postman collection (look for a `tag` field on the request or folder),
- In the use-case file (via a frontmatter field or structured metadata).

Only one tag is allowed per route. If multiple tags are detected, Copilot must ask the developer for clarification.

Copilot must preserve the tag when syncing or generating files. If no tag is found, fallback to `standard`.

## 🧾 Optional Route Annotations

This API uses Keycloak-based authentication. The Postman collection includes a dedicated `Login` folder that describes how to obtain a valid access token.
In addition to the functional tag (e.g., `standard`, `projectType`, `subscriptionType`), a route may be annotated with optional **route-level metadata tags** that provide extra semantics or constraints.
These annotations are purely informative and do not affect route classification, but they may influence documentation, testing, or tooling behavior.

Valid annotations include:

- `readonly`: The endpoint does not support mutation. Typically used for safe, idempotent routes (e.g., analytics or search).
- `internalOnly`: Not intended for public consumption. May expose administrative or experimental features.
- `adminScope`: Requires elevated privileges. Only available to admin or superuser roles.
- `deprecated`: This route is being phased out. Avoid using it in new integrations.
- `syncJob`: Triggers or monitors batch-based or scheduled operations.
- `realtime`: Supports real-time communication or reflects event-based processing (e.g., WebSocket, SSE, Kafka).
- `featureFlagged`: Only active under a specific feature flag or rollout condition.

Copilot should:
- **not define additional login endpoints** (e.g., `/auth/login`) unless explicitly instructed.
- **assume that all requests require a valid Authorization header** (typically `Bearer <token>`).
- **omit repeating authentication flows** in endpoint documentation unless clarification is necessary.

Authentication is a prerequisite, not part of the endpoint logic.
Optional annotations can be added in:

- The Postman request `description` field (structured block),
- The frontmatter of use-case Markdown files (`tags` field),
- Comments or metadata blocks in `project-requirements.md`.

### Example
```yaml
tags:
  - subscriptionType
  - readonly
  - internalOnly
```

In this example:
- The functional tag is `subscriptionType`
- Additional route constraints indicate read-only access and internal visibility

Only one **functional tag** is allowed per route. Optional annotations may be combined freely.

---

## 🌍 Language and Style

- Use **English** for all descriptions, comments, and identifiers.
- Be consistent and **concise** – avoid redundant or overly verbose texts.
- Descriptions should:
  - Use **present tense** (e.g., “Creates a customer”),
  - Explain *what* the endpoint does and *what response to expect*,
  - Avoid internal terms unless relevant for the API consumer.

---

## 📦 Examples

- Provide **at least one example** request and response per endpoint.
- Use **realistic data** (no `foo`, `bar`, `baz` unless required).
- JSON examples must be **indented with 2 spaces**, without trailing commas.
- Examples must match the `application/json` content type.


---

## 📥 Parameters and Headers

- List all headers used in requests (e.g., `x-auth-username`, `ais-project-id`).
- Document whether parameters are **required** or **optional**.
- For `path` parameters, clearly define the expected format or UUID.

---

## 🔁 Responses

- Always describe **success (2xx)** and **failure (4xx/5xx)** responses.
- Include example payloads, especially for:
  - `202 Accepted` (async ops),
  - `400 Bad Request` (common causes),
  - `401 Unauthorized` and `403 Forbidden`.

---

## Asynchronous Processing

Some endpoints (e.g., export, tagging, import) perform background operations. These return a `202 Accepted` status code. The response typically includes:

- an `operationId` for tracking the background task,
- a `status` field (`accepted`, `queued`, `processing`),
- optionally, a message or additional usage instructions.

Processing is handled internally via queues (e.g., Kafka). Clients may need to check the operation status using a separate endpoint.

---

## 🚨 Error Handling

Copilot should describe common error scenarios for each endpoint. This includes:

- Use `404 Not Found` when a resource like a customer or project is not found.
- Use `400 Bad Request` when validation fails (e.g., missing required fields, malformed body).
- Use `401 Unauthorized` when the access token is missing or invalid.
- Use `403 Forbidden` when the token is valid, but the user lacks permissions.
- Use `409 Conflict` when a resource already exists (e.g., duplicate email or ID).

Always include a brief explanation for why the error occurs and what the client could do to resolve it. Response examples should follow the same JSON formatting rules.

---

## 🧪 Validation and Edge Cases

- If a field is required, mention it.
- If a value must be an array or UUID, specify it in the schema.
- Add `nullable: false` where null values are not accepted.

---

## 🔍 Route Awareness and Clarification Behavior

### Analyze Existing Routes First

Copilot must always analyze the current Postman collection (`postman/collections/*.json`) before generating or modifying routes.

- Start by identifying all existing paths, methods, and parameters.
- Propose enhancements instead of creating duplicate endpoints.
- If a new endpoint is suggested and closely resembles an existing one, ask the developer whether to reuse or extend it.

This avoids redundancy and ensures improvements are applied in place.

### Developer Clarification Loop

When encountering ambiguity, Copilot should enter a clarification loop with the developer.

- Ask concise, targeted questions to resolve unclear scopes, parameters, or behaviors.
- Continue clarification until:
  - the developer responds with phrases like “stop”, “not more precise”, or “that's enough”,
  - the agent gains sufficient confidence from context or prior rules,
  - or the developer explicitly ends the loop.

Prefer single, clear questions over making assumptions.

Example prompt:

> “This seems similar to `/contacts/search`. Should I merge, extend, or define a new route?”

This interaction ensures high-quality API descriptions that match the intent of the project team.

---

## 🛑 Do Not

- Do **not** use semicolons in JSON examples.
- Do **not** generate Markdown unless explicitly requested.
- Do **not** invent endpoints – base everything on given collections or requirements.

---

## ✅ Summary

Copilot acts as a documentation transformer and OpenAPI author. Focus on:
- semantic clarity,
- correct YAML syntax,
- consistent formatting,
- and meaningful examples.

---

## 🧱 Section Structure for Use Cases

To ensure consistent documentation across all use cases, each API use-case chapter should begin with the following fields:

- `title`: A concise name of the function or domain  
- `subtitle`: A one-line explanation of the purpose  
- `explanation`: A short paragraph with background information, key use cases, and target audience  

These fields are used by the agent to generate structured introductions and documentation blocks. They may appear directly below the use-case heading and should be present unless explicitly omitted.

---

## 🧭 Agent Operating Strategy

Depending on which artifacts are present, the agent proceeds as follows:

### Case 1: Postman collection exists, but no use-cases
- Extract routes from `postman/collections/<id>.json`.
- Create `use-cases/${info.name}.md`.
- Use existing Copilot instructions to enrich and rewrite descriptions.
- Ask developer for clarifications where needed.
- After confirmation, generate changes back into the Postman file.

### Command: `init-use-case <collection-id>.json`
- Reads the specified Postman collection from `postman/collections/`.
- Creates a corresponding use-case file under `use-cases/${info.name}.md`, if it does not yet exist.
- Generates use-case blocks based on existing routes and applies enrichment rules.
- Enters clarification loop for missing or unclear details.
- Waits for manual review before propagating changes back into the collection.


### Case 2: Postman collection and use-case file both exist
- Use the `sync ${info.name}` command to reconcile both.
- Ask clarification questions for ambiguous or mismatching details.
- Update `use-cases/${info.name}.md` first.
- After approval, propagate changes back into Postman.

### Case 3: Use-case exists, but Postman collection is missing
- Agent may create a new Postman collection based on use-case content.
- The file name is derived from the use-case file (`info.name`).
- The developer must confirm that this is not a duplicate or overwritten collection.
- Generated file includes metadata markers (`x-generated`, timestamps).

### Command: `generate-collection <use-case>.md`
- Analyzes the given use-case file.
- Creates a new Postman collection in `postman/collections/` based on its `info.name`.
- Avoids overwriting any existing collections unless explicitly confirmed.
- Marks the new file with `x-generated: true` and a timestamp.
- Asks for clarification on headers, parameters, or authentication details as needed.

### Bulk Commands

#### Command: `init-all-use-cases`
- Scans all Postman collections in `postman/collections/`.
- For each collection without a corresponding file in `use-cases/`, generates a use-case file.
- Asks for clarification if a collection contains ambiguous or undocumented routes.
- Skips any files that already have a matching use-case.

#### Command: `sync-all`
- Scans all Postman collections and their corresponding use-case files.
- Identifies mismatches, missing descriptions, or inconsistencies.
- Updates use-case files first and asks for clarification where needed.
- After confirmation, synchronizes back into Postman collections.
- Skips any files that are marked as locked or explicitly excluded.

#### Command: `generate-all-collections`
- Scans all use-case files in `use-cases/`.
- For each use-case without a corresponding Postman collection, generates a new one.
- Uses `info.name` to determine the target filename.
- Avoids overwriting existing collections and requests confirmation if needed.

---

## 🧪 Dry-Run Mode

To safely preview changes before overwriting the original Postman collection, the agent supports a **dry-run mode**.

### Behavior

When enabled, dry-run mode:

- **creates a local copy** of the collection file under:
  - `postman/dry-run/collections/<original-filename>.json`
- **applies all transformations and enrichment** to this copy only
- **does not write** to `postman/collections/` unless explicitly confirmed by the developer

This allows developers to:

- review the generated or updated content before syncing
- compare the dry-run output with the original collection
- manually inspect changes and validate correctness

### Activation

Dry-run mode is active when:

- the `--dry-run` flag is passed to any command (`init-use-case`, `sync`, `generate-collection`, etc.)
- the agent operates in `CI` or `preview` mode
- the developer explicitly requests a dry run in natural language (e.g., “show me what would change, but don’t modify anything yet”)

### Example Command

```
init-use-case 9837006-9404c807-2003-4790-b77b-183431c560f9.json --dry-run
```

The resulting file will be written to:

```
postman/dry-run/collections/9837006-9404c807-2003-4790-b77b-183431c560f9.json
```


## 🧊 Visual Documentation Structure

To help new developers quickly understand how documentation files relate to each other, we use a predictable directory structure with visually distinct boundaries.

### Example Layout (from project root)

```
.
├── ais-contact-data-platform-svc
│   ├── project-requirements.md    ← project-specific design constraints
│   └── use-cases.md               ← structured use-case definitions
├── postman
│   └── collections
│       └── <collection-id>.json  ← raw Postman definition file
├── schemas
│   ├── SchemaEntities            ← JSON Schema definitions per entity
│   └── SchemaMixins              ← Mixin building blocks for reuse
└── README.md                     ← entry point and structure overview
```

### Guidelines

- Every collection (e.g. `ais-contact-data-platform-svc`) may contain a `project-requirements.md` and `use-cases.md` file.
- Each file describes a different aspect:
  - `project-requirements.md` defines constraints, rules, and validation hints.
  - `use-cases.md` holds specific request/response logic and documentation per endpoint.
- Avoid duplicating logic between `project-requirements.md` and `copilot-instructions.md`. When a rule applies to all projects, move it to `copilot-instructions.md`.
- The `README.md` must describe this directory structure to make navigation easier for contributors.

