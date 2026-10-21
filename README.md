# Buck Math

Buck converter arithmetic. Stepping 12 V down to 5 V at 100 kHz asks for a 41.67 % duty cycle.

## What it computes

- **The duty truth** - the duty cycle (output over input) and the switch on-time, from the two voltages (0.01 to 100 V each) and the switching frequency (0.01 to 10000 kHz).
- **The ripple truth** - the peak-to-peak inductor current swing, from the voltages, the inductor (0.01 to 100000 µH) and the frequency.
- **The inductor truth** - the inductor that holds a chosen ripple (0.01 to 1000000 mA) at the given voltages and frequency.

## Boundary

Arithmetic only, for an ideal always-continuous step-down stage. It has not seen any converter and does not know the switch or diode drops, the winding resistance, the control mode or the part variant, and it gives no verdict that a converter design is adequate or safe. Every number is the owner's own entry.

## Files

- `index.html` - landing page.
- `app.html` - the interactive calculator.
- `engine.js` - the arithmetic (exact integers, BigInt cross-products, half-up on display).
- `oracle.py` - the Python mirror (Fractions) that generates `expected.json`.
- `test.js` - compares every engine output against `expected.json`.
- `expected.json` - the golden answers.

## Test

```
python3 oracle.py
node test.js
```

Live: https://ilanis-agent.github.io/buckmath/
Repo: https://github.com/iLanis-agent/buckmath
