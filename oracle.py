import json, random
from fractions import Fraction

def hu(num, den):
    return Fraction((2*num + den) - ((2*num + den) % (2*den)), 2*den)

def dec(v, places=2):
    if v < 0: return "-" + dec(-v, places)
    base = 10**places
    n = v.numerator // v.denominator
    s = str(n // base); f = str(n % base).zfill(places).rstrip("0")
    return s + "." + f if f else s

def s100(n):
    w, f = divmod(n, 100)
    return f"{w}.{f:02d}".rstrip("0").rstrip(".")

def duty(vi, vo, f):
    d = hu(vo*10000, vi); ton = hu(vo*10000000, vi*f)
    return (f"Stepping {dec(Fraction(vi))} V down to {dec(Fraction(vo))} V at {dec(Fraction(f))} kHz asks for a "
            f"{dec(d)} % duty cycle, a {dec(ton)} µs on-time per cycle.")
def ripple(vi, vo, ll, f):
    d = vi - vo
    di = hu(d*vo*10**10, vi*ll*f)
    return (f"With a {dec(Fraction(ll))} µH inductor at {dec(Fraction(f))} kHz, the current swings {dec(di)} mA "
            f"peak to peak as the switch cycles.")
def inductor(vi, vo, r, f):
    d = vi - vo
    l = hu(d*vo*10**10, vi*r*f)
    return (f"To hold the swing to {dec(Fraction(r))} mA at {dec(Fraction(f))} kHz stepping {dec(Fraction(vi))} V "
            f"down to {dec(Fraction(vo))} V, the inductor comes to {dec(l)} µH.")

random.seed(734)
cases = [
  dict(fn="duty", args=["12","5","100"], expect=duty(1200,500,10000)),
  dict(fn="ripple", args=["12","5","10","100"], expect=ripple(1200,500,1000,10000)),
  dict(fn="inductor", args=["12","5","3000","100"], expect=inductor(1200,500,300000,10000)),
]
for _ in range(30):
    vi = random.randint(2,10000); vo = random.randint(1,vi-1); f = random.randint(1,1000000)
    cases.append(dict(fn="duty", args=[s100(vi),s100(vo),s100(f)], expect=duty(vi,vo,f)))
for _ in range(30):
    vi = random.randint(2,10000); vo = random.randint(1,vi-1)
    ll = random.randint(1,10000000); f = random.randint(1,1000000)
    cases.append(dict(fn="ripple", args=[s100(vi),s100(vo),s100(ll),s100(f)], expect=ripple(vi,vo,ll,f)))
for _ in range(30):
    vi = random.randint(2,10000); vo = random.randint(1,vi-1)
    r = random.randint(1,100000000); f = random.randint(1,1000000)
    cases.append(dict(fn="inductor", args=[s100(vi),s100(vo),s100(r),s100(f)], expect=inductor(vi,vo,r,f)))
errcases = [
  ("duty", ["5","5","100"]), ("duty", ["5","12","100"]), ("duty", ["0","5","100"]),
  ("duty", ["12","5","0"]), ("duty", ["12","5","10000.01"]),
  ("ripple", ["12","12","10","100"]), ("ripple", ["12","5","0","100"]),
  ("ripple", ["12","5","100000.01","100"]), ("ripple", ["12","5","10","0"]),
  ("inductor", ["12","5","0","100"]), ("inductor", ["12","5","1000000.01","100"]),
  ("inductor", ["12","12","3000","100"]),
]
json.dump({"cases": cases, "errors": errcases}, open("expected.json","w"), ensure_ascii=False, indent=1)
open("expected.json","a").write("\n")
print("expected.json written:", len(cases), "cases")
