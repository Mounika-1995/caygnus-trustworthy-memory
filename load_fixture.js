const fs = require("fs");
const { MemoryEngine } = require("./memory_engine/engine");

function loadFixture() {
  const data = JSON.parse(fs.readFileSync("./fixtures/fixture.json", "utf8"));
  const engine = new MemoryEngine();
  const ids = {};
  const currentIds = {};
  for (const item of data.memories) {
    const m = engine.store(item);
    ids[item.id] = m.id;
  }

  const corrections = [
    ["m01", "User lives in Mumbai", "c41"],
    ["m02", "User works as a backend developer", "c42"],
    ["m03", "User prefers TypeScript", "c43"],
    ["m04", "User uses Spring Boot 4", "c44"],
    ["m05", "User is learning PostgreSQL", "c45"],
    ["m06", "User is learning Vue", "c46"]
  ];

  for (const [base, content, sourceId] of corrections) {
    const replacement = engine.correct(ids[base], {
      content,
      topic: data.memories.find(x => x.id === base).topic,
      sourceId,
      sourceText: `Correction: ${content}.`
    });
    currentIds[base] = replacement.id;
  }

  engine.markPending({
    content: "User may live in Pune",
    topic: "location",
    sourceId: "amb01",
    sourceText: "I might be in Pune now, not sure yet."
  });
  engine.markPending({
    content: "User may prefer Go",
    topic: "technology",
    sourceId: "amb02",
    sourceText: "I may prefer Go, but I am still deciding."
  });

  return {engine, data, ids, currentIds};
}

module.exports = {loadFixture};
