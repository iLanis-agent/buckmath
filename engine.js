// Buck Math engine: duty cycle and on-time for an ideal step-down stage, inductor ripple current, and the inductor that holds a chosen ripple. Exact integers (hundredths of a V, hundredths of a kHz, hundredths of a µH, hundredths of a mA), BigInt for the large cross-products, half-up on display only.
function _p(t, err, intDigits, places, lo, hi) {
  t = typeof t === "string" ? t.trim() : "";
  var m = new RegExp("^([0-9]{1," + intDigits + "})(?:\\.([0-9]{1," + places + "}))?$").exec(t);
  if (!m) throw new Error(err);
  var v = parseInt(m[1], 10) * Math.pow(10, places) + (m[2] ? parseInt(m[2].padEnd(places, "0"), 10) : 0);
  if (v < lo || v > hi) throw new Error(err);
  return v;
}
var _V = "each voltage must be from 0.01 to 100 V with at most two decimal places";
var _F = "the frequency must be from 0.01 to 10000 kHz with at most two decimal places";
var _L = "the inductor must be from 0.01 to 100000 µH with at most two decimal places";
var _I = "the ripple current must be from 0.01 to 1000000 mA with at most two decimal places";
var _DOWN = "the output must be below the input for a step-down stage";
function _hu(n, d) { return Math.floor((2 * n + d) / (2 * d)); }
function _huB(n, d) { return Number((2n * n + d) / (2n * d)); }
function _dec(v, places) {
  if (v < 0) return "-" + _dec(-v, places);
  var base = Math.pow(10, places);
  var s = String(Math.floor(v / base)), f = String(v % base).padStart(places, "0").replace(/0+$/, "");
  return f ? s + "." + f : s;
}
function _volt(t) { return _p(t, _V, 3, 2, 1, 10000); }
function _freq(t) { return _p(t, _F, 5, 2, 1, 1000000); }
function _ind(t) { return _p(t, _L, 6, 2, 1, 10000000); }
function _rip(t) { return _p(t, _I, 7, 2, 1, 100000000); }
function _step(vi, vo) {
  if (vo >= vi) throw new Error(_DOWN);
  return vi - vo;
}

function dutyTruth(vin, vout, fs) {
  var vi = _volt(vin), vo = _volt(vout), f = _freq(fs);
  _step(vi, vo);
  var d = _hu(vo * 10000, vi);
  var ton = _hu(vo * 10000000, vi * f);
  return "Stepping " + _dec(vi, 2) + " V down to " + _dec(vo, 2) + " V at " + _dec(f, 2) + " kHz asks for a " + _dec(d, 2) + " % duty cycle, a " + _dec(ton, 2) + " µs on-time per cycle.";
}
function rippleTruth(vin, vout, l, fs) {
  var vi = _volt(vin), vo = _volt(vout), ll = _ind(l), f = _freq(fs);
  var d = _step(vi, vo);
  var di = _huB(BigInt(d) * BigInt(vo) * 10000000000n, BigInt(vi) * BigInt(ll) * BigInt(f));
  return "With a " + _dec(ll, 2) + " µH inductor at " + _dec(f, 2) + " kHz, the current swings " + _dec(di, 2) + " mA peak to peak as the switch cycles.";
}
function inductorTruth(vin, vout, di, fs) {
  var vi = _volt(vin), vo = _volt(vout), r = _rip(di), f = _freq(fs);
  var d = _step(vi, vo);
  var l = _huB(BigInt(d) * BigInt(vo) * 10000000000n, BigInt(vi) * BigInt(r) * BigInt(f));
  return "To hold the swing to " + _dec(r, 2) + " mA at " + _dec(f, 2) + " kHz stepping " + _dec(vi, 2) + " V down to " + _dec(vo, 2) + " V, the inductor comes to " + _dec(l, 2) + " µH.";
}
