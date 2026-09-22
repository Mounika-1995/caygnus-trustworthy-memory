const crypto = require("crypto");

const STATES = Object.freeze({
  ACTIVE: "active",
  SUPERSEDED: "superseded",
  DELETED: "deleted",
  PENDING: "pending"
});

function stableId(sourceId, content) {
  return crypto.createHash("sha256")
    .update(`${sourceId}|${content.trim().toLowerCase()}`)
    .digest("hex")
    .slice(0, 16);
}

function tokenize(text) {
  return new Set(
    String(text).toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .split(/\s+/)
      .filter(w => w.length > 1)
  );
}

class MemoryEngine {
  constructor() {
    this.memories = new Map();
    this.clock = 0;
  }

  timestamp() {
    this.clock += 1;
    return new Date(Date.UTC(2026, 0, 1, 0, 0, this.clock)).toISOString();
  }

  store({content, topic, sourceId, sourceText}) {
    const id = stableId(sourceId, content);
    if (this.memories.has(id)) return this.memories.get(id);

    const now = this.timestamp();
    const memory = {
      id, content, topic: topic || "general",
      source_id: sourceId, source_text: sourceText || "",
      created_at: now, updated_at: now,
      state: STATES.ACTIVE,
      supersedes_id: null, superseded_by_id: null, deleted_at: null
    };
    this.memories.set(id, memory);
    return memory;
  }

  inspect(id) {
    const m = this.memories.get(id);
    if (!m) throw new Error(`Memory not found: ${id}`);
    return JSON.parse(JSON.stringify(m));
  }

  correct(oldId, {content, topic, sourceId, sourceText}) {
    const old = this.memories.get(oldId);
    if (!old) throw new Error(`Memory not found: ${oldId}`);
    if (old.state !== STATES.ACTIVE) throw new Error("Only an active memory can be corrected");

    const replacement = this.store({content, topic: topic || old.topic, sourceId, sourceText});
    const now = this.timestamp();
    old.state = STATES.SUPERSEDED;
    old.superseded_by_id = replacement.id;
    old.updated_at = now;
    replacement.supersedes_id = old.id;
    replacement.updated_at = now;
    return replacement;
  }

  markPending({content, topic, sourceId, sourceText}) {
    const memory = this.store({content, topic, sourceId, sourceText});
    memory.state = STATES.PENDING;
    memory.updated_at = this.timestamp();
    return memory;
  }

  delete(id) {
    const m = this.memories.get(id);
    if (!m) throw new Error(`Memory not found: ${id}`);
    m.state = STATES.DELETED;
    m.deleted_at = this.timestamp();
    m.updated_at = m.deleted_at;
  }

  retrieve(query, limit = 5) {
    const qTokens = tokenize(query);
    const scored = [];

    for (const m of this.memories.values()) {
      if (m.state !== STATES.ACTIVE) continue;
      const contentTokens = tokenize(m.content);
      const topicTokens = tokenize(m.topic);
      const matchedContent = [...qTokens].filter(x => contentTokens.has(x));
      const matchedTopic = [...qTokens].filter(x => topicTokens.has(x));
      const score = matchedContent.length * 2 + matchedTopic.length;
      if (score > 0) {
        scored.push({
          memory: this.inspect(m.id),
          score,
          evidence: {
            matched_content_tokens: matchedContent.sort(),
            matched_topic_tokens: matchedTopic.sort()
          }
        });
      }
    }

    return scored
      .sort((a,b) => b.score - a.score || a.memory.id.localeCompare(b.memory.id))
      .slice(0, limit);
  }

  all() {
    return [...this.memories.values()].map(m => this.inspect(m.id));
  }
}

module.exports = { MemoryEngine, STATES };
