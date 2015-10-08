import requests
import json
from email.utils import parseaddr


url = "https://onionoo.torproject.org/details?country=fi&flag=exit"

r = requests.get(url)

if r.status_code == 200:
    parsed_json = json.loads(r.text)
    exit_list = {}
    exit_list["relays_published"] = parsed_json["relays_published"]
    exit_list["relays"] = []

    for relay in parsed_json["relays"]:
        exit = {}
        exit["nickname"] = relay["nickname"]
        exit["fingerprint"] = relay["fingerprint"]
        exit["last_seen"] = relay["last_seen"]
        exit["first_seen"] = relay["first_seen"]
        exit["last_changed_address_or_port"] = relay["last_changed_address_or_port"]
        exit["latitude"] = relay["latitude"]
        exit["longitude"] = relay["longitude"]
        exit["as_number"] = relay["as_number"]
        exit["as_name"] = relay["as_name"]
        exit["host_name"] = relay["host_name"]
        exit["last_restarted"] = relay["last_restarted"]
        exit["observed_bandwidth"] = relay["observed_bandwidth"]
        exit["exit_policy_summary"] = relay["exit_policy_summary"]
        exit["contact"] = relay["contact"]
        exit["platform"] = relay["platform"]
        exit["or_addresses"] = relay["or_addresses"]
        exit["running"] = relay["running"]
        
        try:
            exit["abuse_email"] = ""
            if "<<a>>" in relay["contact"]:
                first = relay["contact"].split("<<a>>")[0].split(" ")[-1]
                last = relay["contact"].split("<<a>>")[1].split(" ")[0]
                exit["abuse_email"] = first + "@" + last
            elif '@' in parseaddr(relay["contact"])[1]:
                exit["abuse_email"] = parseaddr(relay["contact"])[1]
        except:
            exit["abuse_email"] = ""
        try:
            exit["ip_address"] = relay["or_addresses"][0].split(":")[0]
        except:
            exit["ip_address"] = ""
        exit_list["relays"].append(exit)

    with open('/var/www/html/finnish-tor-campaign/exit_relays_fi.json', 'w') as outfile:
        json.dump(exit_list, outfile, indent=4, ensure_ascii=False)
