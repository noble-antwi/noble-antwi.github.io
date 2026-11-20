The lab sits behind a home router it does not administer. The pfSense WAN takes a private address from that router, so the lab is behind two layers of address translation and nothing on the internet can open a connection inward. Remote access had to work without any inbound port, and Tailscale does: it builds WireGuard tunnels between devices that each sign in to the same tailnet, and both ends dial out.

## Why pfSense is the subnet router

| Option | Needs inbound port forwarding | Decision |
|---|---|---|
| OpenVPN on pfSense | Yes | Not possible without control of the upstream router |
| ZeroTier | No | Not enough routes on the free tier |
| Tailscale | No | Chosen |

pfSense joins the tailnet as a subnet router and advertises the seven lab networks. I put the router on the firewall on purpose: remote traffic enters through pfSense, so pfSense rules still decide what it reaches. Key expiry is disabled for the router alone, because a silently expired key would cut off all remote access.

## Two copies of Tailscale

I first installed Tailscale on pfSense by hand in July 2025, with two Shellcmd entries to start it at every boot. When I later moved to the pfSense Tailscale package, I did not remove those entries. Nothing failed for over a year.

On 1 November 2026, after upgrading pfSense from 2.8.0 to 2.9.0, the firewall came back logged out of Tailscale, and the console showed Tailscale log lines instead of the pfSense menu. The old entries were starting a second `tailscaled` before the package's own. The package's start script saw a Tailscale already running and stepped aside, and its routine for migrating an old identity then copied the stray copy's empty state file over the real one. The upgrade did not cause the fault. It restarted everything and exposed it.

I deleted both entries, signed the firewall in once more, kept a copy of the working identity on the firewall, readable by root only, and rebooted to prove it: one `tailscaled`, started by the package, with the same identity as before the reboot.

## Seeing the real device

Until this change, every remote connection reached the lab from the firewall's own address. Keycloak events, SSH logins and Windows logon events all showed the same source, so an alert could say that a remote device signed in but never which one.

The cause is specific to FreeBSD. There, Tailscale handles subnet traffic in its own user-space network stack: it accepts the connection itself and opens a new one from the firewall's address. One environment setting, given to the service through `/etc/rc.conf.d/tailscaled`, turns that stack off for subnet traffic, so packets go to the pfSense kernel and are routed like any other traffic.

Because the traffic is now routed rather than re-originated, the rules on the Tailscale interface see the real source. One rule allows Tailscale's address range, `100.64.0.0/10`, to the lab networks. The older rule written for relabelled traffic showed zero states afterwards and was disabled on 2 November 2026.

## The proof

Every remote connection now arrives with the real device's address instead of the firewall's, proven in two places:

- **In the SSH session itself.** On IDP01, over the tunnel, `echo $SSH_CLIENT` shows the laptop's Tailscale address. The same command showed `192.168.50.1` before the change.
- **In a Wazuh logon event.** A Remote Desktop session to DC01 over Tailscale produced a logon event carrying the laptop's Tailscale address and its computer name.

A Wazuh event gives a Tailscale address, and the Tailscale admin console maps that address to a device and its owner, so logs and rules can now name the device. I repeated the tests after a reboot with the same result.

## What surprised me

One server, APP01, runs Tailscale itself, and it stopped answering remote devices by its lab address. The request arrived through pfSense with a Tailscale source, APP01 replied through its own tunnel, and the laptop discarded an answer it expected from the subnet router. The rule that follows: a server that runs Tailscale is reached by its Tailscale name, which is also a direct, end-to-end encrypted path.

The lesson from the outage: when a package takes over something that was set up by hand, retire the old start-up mechanism in the same change, and check that exactly one copy of the service is running.

The full runbook, with every command, is [chapter 05 in the repository](https://github.com/noble-antwi/enterprise-security-homelab/blob/main/docs/05-remote-access.md).
