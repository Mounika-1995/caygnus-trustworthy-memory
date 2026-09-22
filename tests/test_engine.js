const assert = require("assert");
const {MemoryEngine, STATES} = require("../memory_engine/engine");

function testStorage() {
  const e = new MemoryEngine();
  const m = e.store({content:"User lives in Pune", topic:"location", sourceId:"s1", sourceText:"I live in Pune."});
  assert.strictEqual(m.state, STATES.ACTIVE);
  assert.strictEqual(m.source_id, "s1");
  assert.ok(m.id);
}

function testRetrievalBounded() {
  const e = new MemoryEngine();
  for (let i=0;i<10;i++) e.store({content:`User uses tool${i}`, topic:"tools", sourceId:`s${i}`});
  assert.strictEqual(e.retrieve("tools user uses", 3).length, 3);
}

function testCorrection() {
  const e = new MemoryEngine();
  const old = e.store({content:"User lives in Pune", topic:"location", sourceId:"s1"});
  const newer = e.correct(old.id, {content:"User lives in Mumbai", topic:"location", sourceId:"s2"});
  assert.strictEqual(e.inspect(old.id).state, STATES.SUPERSEDED);
  assert.strictEqual(e.inspect(old.id).superseded_by_id, newer.id);
  assert.ok(!e.retrieve("user lives location", 5).some(r => r.memory.id === old.id));
}

function testPendingExcluded() {
  const e = new MemoryEngine();
  const p = e.markPending({content:"User may live in Delhi", topic:"location", sourceId:"s1"});
  assert.strictEqual(e.inspect(p.id).state, STATES.PENDING);
  assert.ok(!e.retrieve("user lives location", 5).some(r => r.memory.id === p.id));
}

function testDeletion() {
  const e = new MemoryEngine();
  const m = e.store({content:"User likes Java", topic:"technology", sourceId:"s1"});
  e.delete(m.id);
  assert.strictEqual(e.inspect(m.id).state, STATES.DELETED);
  assert.strictEqual(e.retrieve("Java technology", 5).length, 0);
}

function testDeterministic() {
  const e = new MemoryEngine();
  e.store({content:"User likes Java", topic:"technology", sourceId:"a"});
  e.store({content:"User uses JavaScript", topic:"technology", sourceId:"b"});
  const a = JSON.stringify(e.retrieve("technology", 5));
  const b = JSON.stringify(e.retrieve("technology", 5));
  assert.strictEqual(a,b);
}

const tests = [testStorage,testRetrievalBounded,testCorrection,testPendingExcluded,testDeletion,testDeterministic];
let passed=0;
for (const t of tests) { t(); console.log(`PASS ${t.name}`); passed++; }
console.log(`RESULT: ${passed}/${tests.length} tests passed`);
