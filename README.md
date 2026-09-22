# Caygnus — Trustworthy Long-Term Memory

A small deterministic memory engine implementing Problem 4 of the Product Engineering Challenge.

## Run

Requires Node.js 18+.

```powershell
node --version
node tests/test_engine.js
node benchmark.js
node demo.js
```

No npm install, API key, database, or external service is required.

## What is implemented

- Stable memory IDs
- Source provenance
- Creation/update timestamps
- Lifecycle states: active, superseded, deleted, pending
- Explicit correction with linked supersession history
- Conservative handling of uncertain contradictions
- Soft deletion
- Bounded deterministic retrieval
- Observable retrieval evidence
- Version-controlled benchmark fixture
- Six automated tests

## Verification

Expected benchmark result:

`RESULT: 20/20 queries passed`

Expected test result:

`RESULT: 6/6 tests passed`

## Architecture

Fixture/source message -> MemoryEngine.store() -> provenance/lifecycle record -> correct()/delete() -> retrieve(query, limit) -> deterministic token/topic scoring -> bounded results.

## Trade-offs

This is intentionally a local prototype. It uses lexical retrieval instead of embeddings and in-memory storage instead of a database. A production implementation would add transactional persistence, active-memory indexes, append-only audit records, hybrid retrieval, concurrency/version checks, retention controls, and sensitive-memory policy gates.

## AI usage

AI assistance was used for scaffolding, documentation, fixture generation, and edge-case review. The runtime has no AI dependency. The implementation is verified by deterministic tests, the demo, and the fixed benchmark.
