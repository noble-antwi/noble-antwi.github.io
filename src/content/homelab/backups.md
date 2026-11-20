A running VM is not a backup of itself. Snapshots help with a quick rollback, but a real backup is an independent, retained copy that survives disk loss, a bad change or a corrupted guest. Two failures of physical machines in this lab, a server NIC and the Wazuh host losing power, made the point concretely: anything not backed up is one hardware fault away from a rebuild. So every guest on the hypervisor is now backed up nightly to a separate physical disk.

## Where the backups live

The Proxmox host is a standalone node with eight cores, about 32 GiB of RAM and two physical disks.

| Disk | Size | Role |
|---|---|---|
| `/dev/sda` | 3 TB | Proxmox OS and primary guest storage (`local`, `local-lvm`) |
| `/dev/sdb` | 500 GB | Backup target (`backup`, ext4 Directory storage) |

The second disk had previously been an operating system disk, with leftover EFI and ext4 partitions. I wiped it and created a Directory storage named `backup`, mounted at `/mnt/pve/backup`, with the content type set to VZDump backup file.

The reason for a separate disk is a basic tenet of recoverable design: the backup must survive the thing it is protecting against. If the backups sat on the same disk as the running VMs, a failure or corruption of that disk would take both.

## The job

I configured one scheduled job on 30 August 2026.

| Setting | Value | Reason |
|---|---|---|
| Schedule | Daily at 02:00 | Off-hours, low activity |
| Selection | All guests | Future VMs and containers are included automatically, so there is no rule to forget |
| Mode | Snapshot | Backs up running guests with minimal disruption |
| Compression | ZSTD | Fast, with a good ratio |
| Retention | Keep last 3 | Recent restore points without filling the disk |
| Target | `backup` | Survives loss of the primary disk |

## Proving it ran

A schedule is a promise, not evidence, so I did not wait for 02:00. I started the job on demand and checked two things: the task finished with `TASK OK`, and backup files were present under the `backup` storage for both guests that existed at the time. Figure 6.1 shows the job, with that verification run as the task at the bottom.

![Proxmox scheduled backup job](../../assets/work/enterprise-security-homelab/pve-04-backup-job.png)

*Figure 6.1: Nightly backup job, verified by an on-demand restore point. Mapped to NIST CP-9 in the runbook.*

Recovery is a short, documented path: open the `backup` storage, choose Backups, select the restore point and choose Restore. A lost or broken guest becomes a restore, not a rebuild. The runbook puts the principle bluntly: a backup never verified by a restore is only a hope.

## What the design changed elsewhere

The backup job turned out to shape a later decision. The Vault server was originally going to live on a physical host. It was built as a Proxmox guest instead, partly to keep it away from other applications, and partly because a guest inherits the nightly backup. That matters for Vault in particular, because its encrypted store is the one thing that cannot be reconstructed.

The same thinking about known-good state applies to what goes into the hypervisor in the first place. An installation image is verified against its publisher's SHA256 checksum before it is used (NIST SI-7). The Kali image for the attack host is the recorded example in the repository: verifying software before it enters the environment is a control in its own right, and it matters most for a machine that will run offensive tooling.

## What I took from it

Three habits came out of this build:

- Put the backup on a different physical disk from the thing it protects.
- Select all guests, so protection is the default and not a task.
- Run the job by hand once and look at the files, instead of trusting the schedule.

A Directory target is enough for a single node. Proxmox Backup Server, which adds deduplication and incremental backups, is the option to revisit if backup volume grows.

The runbook maps the scheduled, independent, retained backups to NIST SP 800-53 CP-9 and the documented restore procedure to CP-10. These are lab-appropriate implementations, not a claim of formal compliance.

The full runbook, with every command, is [chapter 14 in the repository](https://github.com/noble-antwi/enterprise-security-homelab/blob/main/docs/14-proxmox-storage-backup-capacity.md).
