const {loadFixture} = require("./load_fixture");

const {engine, data, ids, currentIds} = loadFixture();
engine.delete(ids["m37"]);

let passed = 0;
for (const q of data.queries) {
  const results = engine.retrieve(q.query, 5);
  const got = new Set(results.map(r => r.memory.id));
  const expected = q.include.map(k => currentIds[k] || ids[k]).filter(Boolean);
  const missing = expected.filter(id => !got.has(id));

  // Old correction IDs and deleted m37 are forbidden from current retrieval.
  const forbidden = [
    ids["m01"], ids["m02"], ids["m03"], ids["m04"], ids["m05"], ids["m06"], ids["m37"]
  ];
  const returnedForbidden = forbidden.filter(id => got.has(id));

  if (missing.length === 0 && returnedForbidden.length === 0) {
    passed++;
    console.log(`PASS ${q.name}: ${results.map(r => r.memory.content).join(" | ")}`);
  } else {
    console.log(`FAIL ${q.name}: missing=${missing.join(",")} forbidden=${returnedForbidden.join(",")}`);
  }
}
console.log(`RESULT: ${passed}/${data.queries.length} queries passed`);
process.exitCode = passed === data.queries.length ? 0 : 1;
