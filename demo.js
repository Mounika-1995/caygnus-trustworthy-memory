const {loadFixture} = require("./load_fixture");
const {MemoryEngine} = require("./memory_engine/engine");

const {engine: fixtureEngine, ids} = loadFixture();

console.log("=== Caygnus Trustworthy Long-Term Memory Demo ===");

console.log("\n1. Store + provenance");
const demoEngine = new MemoryEngine();
const original = demoEngine.store({
  content: "User lives in Bengaluru",
  topic: "location",
  sourceId: "demo-source-1",
  sourceText: "User said: I live in Bengaluru."
});
console.log(demoEngine.inspect(original.id));

console.log("\n2. Retrieve relevant context");
console.log(demoEngine.retrieve("where does the user live", 3));

console.log("\n3. Explicit correction: Bengaluru -> Mumbai");
const replacement = demoEngine.correct(original.id, {
  content: "User lives in Mumbai",
  topic: "location",
  sourceId: "demo-correction",
  sourceText: "Correction: I moved to Mumbai."
});
console.log("Old:", demoEngine.inspect(original.id));
console.log("New:", demoEngine.inspect(replacement.id));

console.log("\n4. Outdated memory absent from retrieval");
console.log(demoEngine.retrieve("user lives location", 5));

console.log("\n5. Delete current memory");
demoEngine.delete(replacement.id);
console.log(demoEngine.retrieve("user lives location", 5));

console.log("\n6. Ambiguous contradiction stays pending");
const pending = fixtureEngine.all().find(m => m.state === "pending");
console.log(pending);

console.log("\nDemo complete.");
