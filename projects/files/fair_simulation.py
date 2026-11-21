"""FAIR-style Monte Carlo for risk R-01 (ransomware outage over 48 hours), Larkspur Pay training case.

Inputs are calibrated workshop estimates (min, most likely, max) modeled with PERT distributions.
Usage: python3 fair_simulation.py
"""
import numpy as np

rng = np.random.default_rng(42)
N = 10_000


def pert(lo, ml, hi, n):
    a = 1 + 4 * (ml - lo) / (hi - lo)
    b = 1 + 4 * (hi - ml) / (hi - lo)
    return lo + rng.beta(a, b, n) * (hi - lo)


def simulate(v_lo, v_ml, v_hi):
    lef = pert(0.2, 0.6, 2.0, N) * pert(v_lo, v_ml, v_hi, N)  # threat events/yr x vulnerability
    events = rng.poisson(lef)
    annual_loss = np.zeros(N)
    for i, k in enumerate(events):
        if k:
            primary = pert(400e3, 1.2e6, 3.5e6, k).sum()
            secondary = ((rng.random(k) < 0.6) * pert(300e3, 1.5e6, 8e6, k)).sum()
            annual_loss[i] = primary + secondary
    return annual_loss


if __name__ == "__main__":
    for label, v in [("current", (0.15, 0.25, 0.40)), ("with $180k controls", (0.04, 0.08, 0.15))]:
        loss = simulate(*v)
        print(f"{label}: mean ${loss.mean():,.0f}  P90 ${np.percentile(loss, 90):,.0f}  "
              f"P95 ${np.percentile(loss, 95):,.0f}  chance of any loss {(loss > 0).mean():.1%}")
