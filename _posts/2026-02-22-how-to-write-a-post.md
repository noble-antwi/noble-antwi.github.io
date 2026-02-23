---
layout: post
title: "How to Write a Lab Note or Project Update"
category: lab-notes
tags: [meta, guide, how-to]
read_time: 3
---

This is a **template post** showing you exactly how to write a lab note, project update, or learning entry. You can delete this post once you've written your first real one.

## How to Create a New Post

1. Create a new file inside the `_posts/` folder
2. Name it using this format: `YYYY-MM-DD-your-post-title.md`
   - Example: `2026-02-22-gpo-password-policy-lab.md`
3. Add the front matter at the top (the block between `---`)
4. Write your content below in plain Markdown

## Front Matter Options

```yaml
---
layout: post
title: "Your Post Title Here"
category: lab-notes        # options: lab-notes, project-update, til, learning, cloud-security
tags: [aws, iam, windows]  # add as many tags as you like
read_time: 5               # estimated reading time in minutes
---
```

## Category Options

| Category | Use it when... |
|---|---|
| `lab-notes` | Documenting something you built or configured in a lab |
| `project-update` | Sharing progress on a specific project |
| `til` | A short "Today I Learned" note |
| `learning` | Notes from a course, book, or certification study |
| `cloud-security` | AWS, Azure, GCP security topics |

## Writing Tips

- **Keep it real** — write like you're explaining to a colleague, not an exam marker
- **Include what went wrong** — troubleshooting notes are the most useful
- **Use code blocks** for commands:

```bash
# Example: force a Group Policy update
gpupdate /force
gpresult /r
```

- **Use blockquotes** for key takeaways:

> Key insight: GPO password policies only apply at the domain level by default, not at the OU level. To enforce at OU level, use Fine-Grained Password Policies.

## Example Real Posts You Could Write

- *"Configuring a Password Policy GPO and Applying It to an OU"*
- *"My First Prowler Scan — What I Found and How I Fixed It"*
- *"Week 1 of studying for AZ-500 — Key Concepts"*
- *"Setting Up Cloudflare Zero Trust Tunnel on a Home Lab"*
- *"IAM Job Scout Update: Switched from Google CSE to JSearch API"*

---

Once you're ready to write your first real post, duplicate this file, rename it with today's date and your topic, then replace this content with your own. That's it!
