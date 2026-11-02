#!/usr/bin/env python3
"""
Production & Local Smoke Test Script

Checks live URLs:
1. Home page (/)
2. Project detail (/projects/cmhp-pharma-erp)
3. Resume page (/resume)
4. API Health check (/api/v1/health/)
5. API Portfolio bundle (/api/v1/portfolio/)
6. Resume download stream (/api/v1/resume/)
7. Contact endpoint anti-spam / submission (/api/v1/contact/)

Usage:
    python scripts/smoke_test.py [--base-url http://127.0.0.1:8000] [--frontend-url http://localhost:5173]
    python scripts/smoke_test.py --base-url https://api.fenilrami.com --frontend-url https://fenilrami.com
"""

import argparse
import json
import sys
import urllib.request
import urllib.error


def run_check(name: str, url: str, expected_status=200, headers=None, method="GET", data=None):
    req_headers = {"User-Agent": "SmokeTest/1.0", "Accept": "*/*"}
    if headers:
        req_headers.update(headers)

    req = urllib.request.Request(url, data=data, headers=req_headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=10) as res:
            status = res.status
            content_type = res.headers.get("Content-Type", "")
            disposition = res.headers.get("Content-Disposition", "")
            body = res.read()
            if status == expected_status:
                print(f"  [PASS] {name} ({status}) -> {url}")
                return True, body, res.headers
            else:
                print(f"  [FAIL] {name} (Got {status}, expected {expected_status}) -> {url}")
                return False, body, res.headers
    except urllib.error.HTTPError as e:
        if e.code == expected_status:
            print(f"  [PASS] {name} ({e.code}) -> {url}")
            return True, e.read(), e.headers
        else:
            print(f"  [FAIL] {name} (HTTP {e.code}) -> {url}")
            return False, e.read(), e.headers
    except Exception as e:
        print(f"  [FAIL] {name} (Error: {e}) -> {url}")
        return False, None, {}


def main():
    parser = argparse.ArgumentParser(description="Live Smoke Test for Fenil Rami Portfolio")
    parser.add_argument("--backend-url", default="http://127.0.0.1:8000", help="Backend base URL")
    parser.add_argument("--frontend-url", default="http://localhost:5173", help="Frontend base URL")
    args = parser.parse_args()

    backend = args.backend_url.rstrip("/")
    frontend = args.frontend_url.rstrip("/")

    print(f"\n=== Executing Live Smoke Test Suite ===")
    print(f"Backend Target:  {backend}")
    print(f"Frontend Target: {frontend}\n")

    results = []

    # 1. API Health Check
    passed, body, _ = run_check("API Health Check", f"{backend}/api/v1/health/")
    if passed and body:
        try:
            health_json = json.loads(body.decode())
            db_status = health_json.get("database")
            print(f"         Database status: {db_status}")
        except Exception:
            pass
    results.append(("API Health", passed))

    # 2. API Portfolio Bundle
    passed, body, headers = run_check("API Portfolio Bundle", f"{backend}/api/v1/portfolio/", headers={"Accept": "application/json"})
    if passed and body:
        try:
            bundle = json.loads(body.decode())
            proj_count = len(bundle.get("projects", []))
            etag = headers.get("ETag")
            cache_ctrl = headers.get("Cache-Control")
            print(f"         Projects returned: {proj_count} | ETag: {etag} | Cache: {cache_ctrl}")
        except Exception:
            pass
    results.append(("API Portfolio Bundle", passed))

    # 3. Active Resume PDF Stream
    passed, body, headers = run_check("Resume Stream (/api/v1/resume/)", f"{backend}/api/v1/resume/")
    if passed and headers:
        disp = headers.get("Content-Disposition", "")
        ctype = headers.get("Content-Type", "")
        print(f"         Content-Type: {ctype} | Disposition: {disp}")
    results.append(("Resume PDF Stream", passed))

    # 4. Contact Form Dry-Run Submission (Honeypot)
    hp_payload = json.dumps({
        "name": "Bot Tester",
        "email": "bot@test.com",
        "message": "Testing honeypot anti-spam defense.",
        "website_hp": "http://spambot.com"
    }).encode("utf-8")
    passed, _, _ = run_check(
        "Contact Anti-Spam (Honeypot)",
        f"{backend}/api/v1/contact/",
        expected_status=200,
        headers={"Content-Type": "application/json"},
        method="POST",
        data=hp_payload
    )
    results.append(("Contact Anti-Spam", passed))

    # 5. Frontend Home Page
    passed, _, _ = run_check("Frontend Home (/) ", f"{frontend}/")
    results.append(("Frontend Home", passed))

    # 6. Frontend Project Detail
    passed, _, _ = run_check("Frontend Project Detail", f"{frontend}/projects/cmhp-pharma-erp")
    results.append(("Frontend Project Detail", passed))

    # 7. Frontend Resume Page
    passed, _, _ = run_check("Frontend Resume (/resume)", f"{frontend}/resume")
    results.append(("Frontend Resume Page", passed))

    # Summary
    print("\n=== Smoke Test Summary ===")
    total = len(results)
    passed_count = sum(1 for _, p in results if p)
    for name, p in results:
        status_text = "PASS" if p else "FAIL"
        print(f"  {status_text}: {name}")

    print(f"\nResult: {passed_count}/{total} checks passed.")
    if passed_count < total:
        print("[!] Some live checks failed or target servers were not responding.")
        sys.exit(1)
    else:
        print("[+] All live endpoints verified successfully!")
        sys.exit(0)


if __name__ == "__main__":
    main()
