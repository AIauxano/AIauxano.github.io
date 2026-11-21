"""Larkspur Pay evidence checks: offboarding (LKP-AC-04) and AWS IAM hygiene."""
import sys
import pandas as pd

AS_OF = pd.Timestamp("2026-11-05")
KEY_MAX_AGE_DAYS = 90

def offboarding(hr_path, okta_path):
    hr = pd.read_csv(hr_path, parse_dates=["termination_date"])
    okta = pd.read_csv(okta_path, parse_dates=["deactivated_at", "last_login"])
    hr["login"] = hr["name"].str.lower().str.replace(" ", ".", regex=False)
    df = hr.merge(okta, on="login", how="left")
    end = df["deactivated_at"].fillna(AS_OF).dt.normalize()
    df["lag_business_days"] = [
        len(pd.bdate_range(t, e)) - 1 for t, e in zip(df["termination_date"], end)
    ]
    df["still_active"] = df["okta_status"].eq("ACTIVE")
    df["login_after_term"] = df["last_login"].dt.normalize() > df["termination_date"]
    df["exception"] = (df["lag_business_days"] > 1) | df["still_active"] | df["login_after_term"]
    orphans = okta[~okta["login"].isin(df["login"]) & okta["okta_status"].eq("ACTIVE")]
    return df, orphans

def iam(path):
    r = pd.read_csv(path)
    rotated = pd.to_datetime(r["access_key_1_last_rotated"], errors="coerce")
    r["no_mfa_console_user"] = r["password_enabled"] & ~r["mfa_active"]
    r["key_age_days"] = (AS_OF - rotated).dt.days
    r["stale_key"] = r["access_key_1_active"] & (r["key_age_days"] > KEY_MAX_AGE_DAYS)
    return r[r["no_mfa_console_user"] | r["stale_key"]]

if __name__ == "__main__":
    hr_path, okta_path, iam_path = sys.argv[1:4]
    df, orphans = offboarding(hr_path, okta_path)
    exc = df[df["exception"]]
    print(f"LKP-AC-04: {len(exc)} of {len(df)} terminations are exceptions")
    print(exc[["name", "termination_date", "lag_business_days", "still_active", "login_after_term"]].to_string(index=False))
    print(f"\nActive Okta accounts with no HR record (population gap): {', '.join(orphans['login']) or 'none'}")
    findings = iam(iam_path)
    print(f"\nAWS IAM: {len(findings)} users need action")
    print(findings[["user", "no_mfa_console_user", "key_age_days", "stale_key"]].to_string(index=False))
    df.to_csv("LKP-AC-04_results.csv", index=False)
