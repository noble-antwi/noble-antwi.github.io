---
layout: post
title: "CCNA Study Notes - Day 1: Network Devices"
date: 2026-04-14
category: learning
tags: [ccna, networking, cisco, network-devices, study-notes]
read_time: 10
---

Kicking off my CCNA 200-301 study series with Jeremy McDowell's course. This first lesson covers the foundational building blocks of any network: the devices that make it up, what each one does, and how they work together. It sounds basic, but getting this right is the base everything else is built on.

---

## What Is a Network?

Wikipedia defines a computer network as "a digital telecommunications network which allows nodes to share resources." That definition is precise but not immediately useful on its own.

The key word is **nodes**. A node is any device that is part of a network. Two PCs connected by a cable is technically a network. Nodes can share files, send messages, stream video, or access services hosted elsewhere. The moment two devices can communicate with each other, you have a network.

As networks grow, they need specialised devices to manage how traffic flows between those nodes. That is where routers, switches, firewalls, and servers come in.

---

## Clients and Servers

Before getting into the hardware, it helps to understand the two roles any device can play on a network.

**A client** is a device that accesses a service made available by a server. Your phone watching a YouTube video is a client. Your laptop requesting a file is a client.

**A server** is a device that provides functions or services to clients. The YouTube server sending you that video is a server. Your friend's iPhone sending you a file over AirDrop is acting as a server in that transaction.

The important point: these are roles, not device types. The same device can be a client in one situation and a server in another. A laptop requesting a webpage is a client. That same laptop running a local web server for development is acting as a server. The role depends on what the device is doing in a given interaction, not what it looks like.

You will also hear clients and servers referred to as **end hosts** or **endpoints**. They sit at the edges of a network and generate or consume traffic. Everything else in between is infrastructure.

---

## Switches

Typically you do not connect end hosts directly to each other. As soon as you have more than a handful of devices, you need something to aggregate those connections. That device is a **switch**.

A switch is a network device designed to connect multiple end hosts within the same local area network (LAN). Think of a switch as a central hub for devices in the same physical location, whether that is a floor of an office building, an entire small office, or a home network.

Key characteristics of switches:

- They have many network interfaces (ports), typically 24 or more, to connect end hosts such as PCs, printers, and servers
- They forward traffic between devices **within** the same LAN
- They do not provide connectivity between separate LANs or to the internet

That last point matters. A switch keeps traffic local. If PC1 and PC2 are both connected to the same switch, they can communicate directly. But if you need to reach a device on a different network or send traffic out to the internet, you need a router.

Cisco's enterprise-grade switches sit in the **Catalyst** product line. The Catalyst 9200 and Catalyst 3650 are common examples you will encounter in the course.

---

## Routers

Where switches connect devices within a LAN, **routers** connect separate networks together.

If a company has a branch office in New York and another in Tokyo, each branch has its own LAN with its own switch. A router in each location connects that local network to the internet, allowing the two branches to communicate with each other over the wider network.

Key characteristics of routers:

- They have fewer network interfaces than switches, typically just a handful
- They provide connectivity **between** LANs and to the internet
- They forward traffic based on IP addresses, making decisions about the best path for data to take

When PC1 in New York wants a file from a server in Tokyo, the traffic goes: PC1 to the New York switch, to the New York router, across the internet, to the Tokyo router, to the Tokyo switch, and finally to the server. The reply follows the same path in reverse.

Cisco's enterprise router product line is called **ISR** (Integrated Services Router). The ISR 900, ISR 1000, and ISR 4000 are common models.

---

## Firewalls

Switches and routers handle where traffic goes. Firewalls handle whether traffic should be allowed to go there at all.

A **firewall** is a specialised network security device that monitors and controls traffic entering and exiting a network based on configured rules. The firewall sits at the boundary of the network and acts as a gatekeeper. If the traffic matches an allow rule, it passes. If it does not, it is blocked.

Firewalls can be placed in different positions:

- **Outside the router** - the firewall filters traffic before it even reaches the router
- **Inside the network** - the firewall filters traffic after it has passed through the router
- In some environments, both positions are used simultaneously for layered protection

### Network Firewalls vs Host-Based Firewalls

There are two distinct types of firewall:

| Type | What It Is | Where It Runs |
| --- | --- | --- |
| **Network firewall** | A hardware appliance that filters traffic between networks | A dedicated device in the network infrastructure |
| **Host-based firewall** | A software application that filters traffic on a single machine | On the end host itself (your laptop, PC, etc.) |

The CCNA focuses on network firewalls, but it is worth knowing both exist. Even in a network with a properly configured hardware firewall, every end host should also have a software firewall running as an additional layer of defence. Defence in depth applies at every level.

### Next-Generation Firewalls

Traditional firewalls filter traffic based on IP addresses, ports, and protocols. **Next-generation firewalls (NGFWs)** go further, adding capabilities such as:

- Intrusion Prevention System (IPS) to detect and block attacks in real time
- Application-layer inspection to identify and control specific applications
- Deep packet inspection
- User identity tracking

Cisco's main firewall products are the **ASA 5500-X series** (the classic Cisco firewall, now updated with NGFW features) and the **Firepower 2100 series** (a purpose-built next-generation firewall). Both are considered next-generation firewalls.

---

## How It All Fits Together

Here is how these devices work together in a typical enterprise network:

```
[PCs / Servers]
      |
  [Switch]           <- connects devices within the LAN
      |
  [Router]           <- connects the LAN to other networks and the internet
      |
  [Firewall]         <- controls what traffic is allowed in and out
      |
  [Internet]
```

End hosts (clients and servers) connect to switches. Switches connect to routers. Firewalls sit at the perimeter, protecting the network from the internet and from internal threats. The firewall can be placed before or after the router depending on the security architecture.

---

## Quick Reference

| Device | Primary Function | Key Characteristic |
| --- | --- | --- |
| **Switch** | Connects end hosts within a LAN | Many ports, LAN traffic only |
| **Router** | Connects separate networks together | Fewer ports, routes between LANs and the internet |
| **Firewall** | Controls traffic entering and exiting the network | Rule-based filtering, placed at network boundaries |
| **Server** | Provides services to clients | Any device providing a service |
| **Client** | Accesses services from servers | Any device consuming a service |

---

## What Is Next

Day 1 establishes the vocabulary and mental model. Day 2 will go deeper into the network interfaces and cabling that physically connect all of these devices. From there the course moves into the OSI and TCP/IP models, which give the theoretical framework for understanding how data actually travels across a network.

More study notes to follow as I work through the course.

---

If you are also studying for the CCNA or working through networking fundamentals, feel free to [reach out](/contact).
