# Product Engineering Challenge Submission

## Candidate

- **Name:** Mounika
- **Email:** mounika7.ai@gmail.com
- **GitHub:** https://github.com/Mounika-1995/caygnus-trustworthy-memory
- **Selected problem:** Problem 4 — Trustworthy Long-Term Memory
- **Demo video:** `<replace with your unlisted video URL>`

## Run the project

### Prerequisites

- Node.js 18+
- No environment variables
- No API key, database, or paid external service

```powershell
cd caygnus-trustworthy-memory
node tests/test_engine.js
node benchmark.js
node demo.js
```

## Successful scenario

The demo stores a memory, inspects provenance, retrieves relevant context, performs an explicit correction, verifies supersession, deletes the current memory, and demonstrates conservative handling of an ambiguous contradiction.

## Acceptance scenarios

- **AC1 Store with provenance:** stable ID and source metadata; inspect exposes source.
- **AC2 Relevant retrieval:** bounded retrieval with deterministic scoring and evidence.
- **AC3 Explicit correction:** old record becomes superseded and links to the new record.
- **AC4 Uncertain contradiction:** pending candidates remain inspectable but are excluded.
- **AC5 Deletion:** deleted memories remain inspectable but are excluded from current retrieval.
- **AC6 Stable evaluation:** fixed JSON fixture and deterministic benchmark.

## Verification benchmark

```powershell
node benchmark.js
```

Expected:

`RESULT: 20/20 queries passed`

The fixture contains 40 base memories, 6 explicit correction chains, 2 ambiguous candidates, and 20 fixed retrieval queries.

## Architecture

```text
Fixture/source message
        |
        v
MemoryEngine.store()
        |
        +--> provenance + lifecycle
        |
        +--> correct() --> supersession chain
        |
        +--> delete() --> deleted state
        |
        v
retrieve(query, limit)
        |
        v
deterministic topic/token scoring
        |
        v
bounded results + observable evidence
```

## Important decisions

1. Explicit corrections supersede rather than mutate history.
2. Ambiguous contradictions become pending rather than silently replacing current truth.
3. Retrieval is deterministic and explainable.

## Limitations

- Single-process local prototype
- No authentication or multi-user sharing
- No HTTP API or persistent database
- Keyword retrieval rather than embeddings
- No automatic extraction from arbitrary conversations
- No production sensitive-memory policy enforcement

## Production and scale

A production version would add transactional persistence with explicit versioning, indexes for active memories, append-only provenance/audit records, hybrid retrieval, concurrency controls, retention rules, and explicit deletion/policy gates.

## AI usage

AI assistance was used for scaffolding, documentation, fixture generation, and edge-case review. The runtime has no AI dependency. The result is verified through deterministic tests, the demo, and the fixed benchmark.

## Credibility note

Replace this with truthful personal experience before submitting. Do not invent a shipped system or claim work that was not personally performed.

Suggested structure:
- **Problem:** what the system solved
- **My contribution:** modules/features personally implemented
- **Scale/complexity:** actual constraints
- **Difficult decision:** one real trade-off
- **Evidence:** public project/demo link

## Reviewer verification

```powershell
node tests/test_engine.js
node benchmark.js
node demo.js
```

Expected:
- all six tests pass
- benchmark ends with `RESULT: 20/20 queries passed`
- demo completes through deletion and ambiguous-conflict steps
