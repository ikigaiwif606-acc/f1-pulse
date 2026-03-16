/**
 * API Connectivity Test Script
 * Run with: npx tsx scripts/test-apis.ts
 */

async function testOpenF1() {
  const res = await fetch("https://api.openf1.org/v1/sessions?session_key=latest");
  if (!res.ok) throw new Error(`OpenF1: ${res.status}`);
  const data = await res.json();
  console.log(`  OpenF1:      OK — Latest session: ${data[0]?.session_name || "N/A"}`);
}

async function testErgast() {
  // Using Jolpica — community successor to the deprecated Ergast API
  const res = await fetch("https://api.jolpi.ca/ergast/f1/current.json");
  if (!res.ok) throw new Error(`Jolpica/Ergast: ${res.status}`);
  const data = await res.json();
  const total = data?.MRData?.total;
  console.log(`  Jolpica:     OK — ${total} races in current season`);
}

async function testPolymarket() {
  const res = await fetch("https://gamma-api.polymarket.com/markets?limit=1");
  if (!res.ok) throw new Error(`Polymarket: ${res.status}`);
  const data = await res.json();
  console.log(`  Polymarket:  OK — API accessible (${Array.isArray(data) ? data.length : "?"} market(s) returned)`);
}

async function main() {
  console.log("\nF1 Pulse — API Connectivity Tests\n" + "=".repeat(40));

  const tests = [
    { name: "OpenF1", fn: testOpenF1 },
    { name: "Ergast", fn: testErgast },
    { name: "Polymarket", fn: testPolymarket },
  ];

  let passed = 0;
  for (const test of tests) {
    try {
      await test.fn();
      passed++;
    } catch (err) {
      console.log(`  ${test.name}: FAILED — ${err}`);
    }
  }

  console.log(`\n${passed}/${tests.length} APIs connected successfully.\n`);

  if (!process.env.OPENWEATHERMAP_API_KEY) {
    console.log("  Note: OPENWEATHERMAP_API_KEY not set — weather API test skipped.");
    console.log("  Set it in .env.local to enable weather features.\n");
  }
}

main();
