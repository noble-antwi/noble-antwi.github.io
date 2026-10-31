---
title: "The AI Agent That Could Read Too Much"
date: 2026-10-30
category: lab-notes
tags: [ai-agents, agent-identity, active-directory, ldaps, least-privilege, wazuh]
description: "I gave an AI agent its own Active Directory account so it could tell which machine an alert came from. Before it read a single attribute, I found that an account with no groups and no grants can already map who holds power in the domain. A dedicated identity, verified LDAPS and an allow-list in the tool turned that into an agent whose reach is provably narrow."
read_time: 7
---

The account was brand new. It belonged to no groups beyond the one every user gets, it had been granted nothing, and it was signed in to the domain controller over an encrypted channel I had just finished building. I asked it to read the domain's built-in Administrator account, and it did: where the account lives in the directory, when it last signed in, and every group it belongs to.

That account was about to become the identity of an AI agent. This note is about what I did with that discovery.

## Why the agent needed the directory at all

The agent answers plain questions about my lab's SIEM. Ask it whether anything unusual happened on a workstation and it searches the Wazuh alerts, under its own read-only role, and writes an answer that cites the rule and time behind every claim. The [case study](/work/ai-agent-identity-lab/) has the whole design.

Its first real run had a blind spot. The alerts were full of one address, `192.168.20.3`, and the agent could not say what it was. A human analyst would know at a glance that it is SCAN01, the lab's own vulnerability scanner, signing in as `svc-greenbone` because that is its job. Without that context the agent could only describe the address, not explain it.

Context means two lookups: what a machine is, and who an account is. Machines come from a hand-kept inventory, because most of the lab is Linux or appliances that Active Directory has never heard of, and AD stores no IP addresses anyway. Accounts come from AD. So the agent needed to sign in to the directory.

## A name of its own

The agent already had an identity in the SIEM, `svc-ask-siem`, with one role: read on alerts, nothing else. It got the same name in Active Directory, in the service accounts OU beside the scanner's account. One name per actor: wherever `svc-ask-siem` appears in a log, on either system, it is the agent and nobody else.

It is a member of Domain Users and nothing more, and it is marked sensitive, so no service can borrow its identity through delegation. Its password lives outside the repository, and it is a different password from the SIEM one.

## A channel that knows who it is talking to

Plain LDAP on port 389 would have sent that password across VLANs where anything on the path could read it. LDAPS on 636 wraps the same conversation in TLS, but a domain controller only offers it once it holds a certificate, and mine had none. That is why the lab now has [CA01](/work/enterprise-security-homelab/), an enterprise root CA, and why DC01 holds a certificate for `DC01.corp.biirabank.com` whose private key was generated on DC01 and has never left it.

The agent checks that certificate against the lab's root, by name, which means it must dial `DC01.corp.biirabank.com` and not the controller's IP address. A certificate is issued to a name, and an address is not that name, so dialling the address fails the check, correctly. Switching the check off would make that error go away and leave an encrypted channel to a server the agent could not identify. Encryption without verification protects against eavesdroppers, not impostors.

Before any of it went near the model, a small script signed in as the agent and printed what came back. TLS 1.3, and the domain controller confirming the caller: `CORP\svc-ask-siem`. The last-logon value it reported was that very sign-in, recorded under the agent's own name.

## The surprise

Then I pointed the same account at the Administrator, and got the whole record.

This is not a misconfiguration. It is how Active Directory is designed: read access to most of the directory is the default for every signed-in account, because users, computers and applications all need to look things up. A brand-new account with no groups can list who is in Domain Admins. It is also exactly what an attacker maps first after getting any foothold, because a list of who holds power is a list of who to go after.

For a person, that default is a known quantity. For an AI agent it changes the question. Whatever the agent's account can read, a model can be asked to read. A tool that passes an attribute name through, or a search filter, would let the model explore the directory as freely as the account can, and everything it found would leave the network for the model provider.

So the decision was simple to state: **AD will not limit what this account reads, so the tool must.**

## Narrow by construction

- **An allow-list of attributes.** Account lookups ask for eleven named attributes: the account name, display name and sign-in name, its groups, its flags (enabled, sensitive, password never expires), when it was created, when it last signed in and when its password was last set. Machine lookups have a list of their own. Nothing else is ever requested, so nothing else can come back.
- **Secrets are never asked for.** Attributes that can hold secrets, such as local administrator passwords, disk recovery keys and managed service account passwords, are not on either list. If AD permissions are ever set wrong, the agent still cannot leak them, because it never asks.
- **One account per question.** Names are checked against a strict pattern and escaped before they go into an LDAP filter. `*` is refused outright: unescaped, it would match every account in the domain. The check runs before any search does.
- **The description field is free text.** People put passwords in AD descriptions. It goes through the same redaction filter as command lines, the one with 18 tests, before it leaves.

Then I called the tools directly, with no AI involved. The scanner's address came back as SCAN01 on the BlueTeam VLAN. Its account came back enabled, in the right OU, a member of the one group that makes it an administrator on member machines, and sensitive. A wildcard came back refused, with no search run.

## What the agent did with it

Same question as the run that could not answer: who is `192.168.20.3`, and what has it been doing on WKS01 this week? In its first round the agent ordered the machine lookup and the alert search together, because neither depended on the other. In its second it looked up the scanner's account. Then it wrote an answer that named the scanner, its account and its job, and said where each fact came from: the inventory, or AD read live. It also knew that AD's last-logon value can be up to two weeks stale, and declined to read much into it.

## What I took from it

- **In Active Directory, read-only is the default, not something you grant.** Any account you create for an agent can already see more than the agent needs.
- **The least privilege an agent gets is decided by its tools.** The account sets the ceiling. The tool sets what is actually asked for, and for an AI agent the tool is the control that matters.
- **Never ask for what you do not want to leak.** An attribute that is never requested cannot be exfiltrated, whatever the permissions say.
- **A certificate check is only as good as the name you dial.** Dial the name on the certificate, and let a mismatch fail.

The code, the evidence and every screenshot are in [project 1 of the AI agent identity lab](https://github.com/noble-antwi/ai-agent-identity-lab/tree/main/01-agent-from-scratch). The CA that made LDAPS possible is chapter 22 of the [homelab](https://github.com/noble-antwi/enterprise-security-homelab).
