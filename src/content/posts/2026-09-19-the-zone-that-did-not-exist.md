---
title: "The Zone That Did Not Exist"
date: 2026-09-19
category: lab-notes
tags: [dns, pfsense, unbound, active-directory, troubleshooting, homelab, greenbone, systemd-resolved]
description: "One DNS zone failed while every other lookup worked. I fixed the obvious thing, broke the resolver completely, chased two wrong theories, and found the real cause in a setting that decides which interface a resolver may speak out of. A walk through diagnosing DNS one hop at a time."
read_time: 9
---

Before a vulnerability scanner can scan a workstation, it has to find it. Mine could not.

The target should be a name rather than an address, because the workstation holds a DHCP lease. Pin a scan target to `192.168.50.56` and one day you are scanning nothing, or worse, scanning whatever machine inherited that address. So the scanner needs to resolve `wks01.corp.biirabank.com`, and the scanner lives on a different VLAN from the domain.

The first lookup returned nothing at all.

## Empty is not an error

```
dig +short wks01.corp.biirabank.com
```

No output. It is tempting to read that as broken, but it is the correct answer to the question that was actually asked. The scanner asks the firewall, the firewall knows nothing about an internal Active Directory zone, so it walks out to the public internet and asks there. `biirabank.com` is a domain I own publicly, and it has no `corp` subdomain, so the public answer is an honest "no such name".

A public resolver will always deny the existence of your internal names. That is not a fault, it is the design.

The fix belongs on the firewall, not the client. A **Domain Override** in the pfSense DNS Resolver carves out one zone and says: for anything ending in `corp.biirabank.com`, do not go to the internet, ask the domain controller. Everything else still resolves publicly.

I added the override. I also added two custom options to disable DNSSEC validation for that zone, because a real public domain with an unsigned internal counterpart is a classic source of validation failures, and I wanted to get ahead of it.

Two changes at once. Remember that.

## Then nothing resolved at all

```
;; communications error to 127.0.0.53#53: timed out
;; no servers could be reached
```

Not just the internal zone. Everything. `127.0.0.53` is systemd-resolved, the local stub on the scanner itself, and it was not answering for any name.

My first theory was that the resolver had refused to start on the new configuration. A resolver that will not start answers nothing rather than answering wrongly, which fits perfectly.

It was wrong, and one command showed it:

```
dig @192.168.20.1 google.com
```

`NOERROR`, a real answer, 48 milliseconds. The firewall's resolver was alive and healthy, and the rest of the network had been fine the whole time. **Asking a different server is the cheapest diagnostic in DNS**, and it immediately moved the fault from the firewall to the scanner itself.

`resolvectl status` showed the stub pointed at exactly the right upstream. Correct configuration, no answers. Restarting `systemd-resolved` cleared it: the stub had cached a dead state for an upstream that had bounced while I was applying changes.

That produced a different failure, which was progress.

## Three words worth knowing cold

```
;; ->>HEADER<<- opcode: QUERY, status: SERVFAIL
```

DNS has three answers that matter, and they point at completely different problems:

- **NOERROR** with an answer section: it worked.
- **NXDOMAIN**: the server is certain this name does not exist. A *data* problem. Something is missing from a zone.
- **SERVFAIL**: the server tried and could not answer. A *plumbing* problem. Something upstream is unreachable, broken, or failed validation.

I had SERVFAIL, so the name probably existed and something in the path was failing. Worth adding: `dig +short` hides this completely. Short output collapses "no answer" and "the query failed" into the same silence, and those need opposite fixes. Drop `+short` the moment anything is wrong.

The reply also came back in **0 milliseconds**, which is its own clue. A real attempt to reach a domain controller and wait costs tens of milliseconds. Zero means a cached failure being handed straight back.

## Walking the chain

Rather than theorise, I asked each hop in turn.

```
dig @192.168.50.2 wks01.corp.biirabank.com
```

`NOERROR`, an answer of `192.168.50.56`, and the `aa` flag: **authoritative answer**. The domain controller was not repeating something it had heard, it owns that zone and was speaking for it. Two milliseconds.

That single command proved three things at once. The record exists. The domain controller serves it correctly. And the scanner's VLAN can reach the domain's VLAN on port 53, so the segmentation was not the obstacle either.

The fault was now pinned between two points I could both reach myself: the firewall's resolver, asking a server that was answering everyone else.

My second theory was DNSSEC, since that was exactly what my custom options had been guessing at. I opened the resolver settings to confirm.

**DNSSEC support was switched off.** It had never been on. My pre-emptive fix had been solving a problem that did not exist, which meant those two custom options had been inert the entire time, and my second theory was as wrong as my first.

Dead configuration that looks meaningful is worse than no configuration. Anyone reading that box later, including me, would assume DNSSEC mattered here.

## The actual cause

It was on the same settings page, a few rows up.

**Outgoing Network Interfaces: WAN only.**

That setting controls which interfaces the resolver may send its own queries out of. Restricted to WAN, it could reach the entire internet, which is why every public lookup worked perfectly. But the domain controller sits on an internal segment reachable only through a different interface, so queries for that one zone had nowhere to go. The resolver waited, timed out, returned SERVFAIL, and cached the failure.

Every symptom lines up with that one setting. One zone fails while everything else works. The first attempt hangs and the retry answers instantly from cache. Nothing in any log says "refused", because nothing was refused. The packets were never sent.

The fix was to add the internal interface. Deliberately **not** to set it to "All": the resolver has no business sourcing queries into the red team segment or any other zone that has no DNS in it. Two interfaces, named for the two jobs it actually has.

```
dig wks01.corp.biirabank.com
```

`NOERROR`, `192.168.50.56`, 390 milliseconds. Then the same query again: 1 millisecond, with the record's time to live counting down from 1200. Cold lookup, then cache. The zone was reachable.

## What I took from it

**One zone failing while everything else works is a very specific symptom.** It almost never means the resolver is broken. It means there is a per-zone path, and something about that path is wrong: the delegation, the forwarder, or the route to it.

**Ask each hop yourself.** `dig @server name` is how you convert a vague failure into a location. Local stub, then resolver, then authoritative server. The hop where the answer changes is the hop that is broken.

**Learn the three statuses.** NOERROR, NXDOMAIN and SERVFAIL are not shades of failure, they point at different halves of the system. Data or plumbing.

**Change one thing at a time.** I applied an override and two custom options together, then spent the next twenty minutes unsure which had caused the outage. It was neither, but I could not know that.

**Do not fix problems you have not confirmed.** The DNSSEC options were a reasonable guess that turned out to be inert, and they left misleading configuration behind. A guess that costs nothing to apply still costs something to leave in place.

**Targets should be names when addresses can move.** All of this existed to avoid pinning a scan to a DHCP address. The lookup now resolves at scan time, so the day that lease changes, nothing breaks and nobody has to notice.
