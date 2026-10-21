const fs = require("fs");
eval(fs.readFileSync("engine.js", "utf8"));
const exp = JSON.parse(fs.readFileSync("expected.json", "utf8"));
const fns = { duty: dutyTruth, ripple: rippleTruth, inductor: inductorTruth };
let fail = 0;
for (const c of exp.cases) {
  const got = fns[c.fn](...c.args);
  if (got !== c.expect) { fail++; console.log("MISMATCH", c.fn, c.args, "\n got:", got, "\n exp:", c.expect); }
}
const ERRS = ["each voltage must be from 0.01 to 100 V with at most two decimal places",
  "the frequency must be from 0.01 to 10000 kHz with at most two decimal places",
  "the inductor must be from 0.01 to 100000 µH with at most two decimal places",
  "the ripple current must be from 0.01 to 1000000 mA with at most two decimal places",
  "the output must be below the input for a step-down stage"];
for (const [fn, args] of exp.errors) {
  let threw = null;
  try { fns[fn](...args); } catch (e) { threw = e.message; }
  if (!threw || !ERRS.includes(threw)) { fail++; console.log("ERRCASE FAIL", fn, args, "->", threw); }
}
console.log(fail ? `${fail} FAILURES` : "all green");
process.exit(fail ? 1 : 0);
