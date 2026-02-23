---
layout: post
title: "HashiCorp Vault: Understanding Sealing and Unsealing"
category: learning
tags: [hashicorp-vault, secrets-management, cloud-security, devops]
read_time: 3
---

As part of my ongoing journey learning HashiCorp Vault, today I explored one of its core security concepts — **sealing**. Here's what I learned.

## What is Sealing in HashiCorp Vault?

When Vault is **sealed**, it cannot access any of the encrypted data stored inside it. Think of it like a physical vault that has been locked — even the people running the server cannot read the secrets inside until it is deliberately unsealed.

When Vault starts up, it always starts in a **sealed state**. This is a deliberate security design — it means even if someone gains access to the server, they cannot read secrets without the unsealing credentials.

## Types of Sealing in Vault

There are three main ways Vault can become sealed:

### 1. Manual Seal
An operator deliberately seals the Vault using the CLI command:
```bash
vault operator seal
```
This is useful when suspicious activity is detected or during maintenance, and you need to immediately cut off access to all secrets.

### 2. Auto-Unseal (and Auto-Seal)
Vault integrates with cloud KMS providers to automatically unseal itself on startup without manual intervention. If the KMS key is revoked or unavailable, Vault automatically seals itself.

Supported providers include:
- **AWS KMS**
- **Azure Key Vault**
- **GCP Cloud KMS**
- **HashiCorp Transit** (Vault wrapping another Vault)

### 3. Seal Migration
This is the process of changing from one seal type to another — for example, moving from a Shamir key seal to AWS KMS Auto-Unseal.

## The Unsealing Process (Shamir's Secret Sharing)

By default, Vault uses **Shamir's Secret Sharing** to unseal. During initialisation, a master key is split into multiple **key shares**. To unseal, a minimum number of those shares (called the **threshold**) must be provided.

For example, with a 5-share, 3-threshold setup:
- 5 key shares are distributed to 5 different people
- Any 3 of those 5 must provide their share to unseal Vault
- No single person can unseal alone

```bash
# Provide one key share (repeat until threshold is met)
vault operator unseal <key-share>
```

## Why This Matters for Security

Sealing is a powerful **break-glass** mechanism. If a breach is suspected:
1. Run `vault operator seal` immediately
2. All secret access stops instantly
3. Investigate the incident
4. Only unseal once the environment is confirmed safe

> The sealed state is Vault's way of ensuring that secrets are **always encrypted at rest** and only accessible when explicitly authorised — even to the system administrators running the infrastructure.

## What's Next

Next I want to explore:
- Setting up Auto-Unseal with AWS KMS in a lab environment
- Vault policies and access control
- Dynamic secrets for AWS IAM credentials
