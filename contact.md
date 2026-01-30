---
layout: default
title: Contact
description: "Connect with Noble Antwi - Cloud Security Engineer. Available for cybersecurity consulting, mentoring, and collaboration opportunities."
---

<h1><i class="fas fa-envelope"></i> Let's Connect</h1>

<p style="text-align: center; font-size: 1.2rem; color: var(--text-light); margin-bottom: 3rem;">
  Curious about working together, mentoring, or just having a real conversation about security, tech, or life? Let’s make it happen. Reach out — I’d love to connect.
</p>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
  <div class="card">
    <h3><i class="fas fa-envelope" style="color: var(--accent-color);"></i> Email</h3>
    <p>For professional inquiries, project discussions, or general questions.</p>
    <a href="mailto:amnworlanyo@gmail.com" class="btn">
      <i class="fas fa-paper-plane"></i> Send Email
    </a>
  </div>

  <div class="card">
    <h3><i class="fab fa-linkedin" style="color: #0077b5;"></i> LinkedIn</h3>
    <p>Connect with me professionally and stay updated on my latest projects and insights.</p>
    <a href="https://linkedin.com/in/{{ site.social.linkedin }}" class="btn" target="_blank">
      <i class="fab fa-linkedin"></i> Connect on LinkedIn
    </a>
  </div>

  <div class="card">
    <h3><i class="fab fa-github" style="color: #333;"></i> GitHub</h3>
    <p>Explore my code repositories, contribute to projects, or collaborate on open source initiatives.</p>
    <a href="https://github.com/{{ site.social.github }}" class="btn" target="_blank">
      <i class="fab fa-github"></i> View GitHub Profile
    </a>
  </div>

  <div class="card">
    <h3><i class="fab fa-medium" style="color: #00ab6c;"></i> Medium</h3>
    <p>Read my technical articles, tutorials, and insights on cybersecurity and cloud computing.</p>
    <a href="https://medium.com/@noble-antwi" class="btn" target="_blank">
      <i class="fab fa-medium"></i> Read Articles
    </a>
  </div>
</div>

<div class="card" style="margin-top: 3rem;">
  <h2><i class="fas fa-handshake"></i> What I'm Looking For</h2>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-top: 1.5rem;">
    <div>
      <h3><i class="fas fa-briefcase"></i> Career Opportunities</h3>
      <p>Cloud Security Engineer positions, Cybersecurity Analyst roles, or Security Consultant opportunities.</p>
    </div>
    <div>
      <h3><i class="fas fa-users"></i> Collaboration</h3>
      <p>Open source projects, research collaborations, or technical writing partnerships.</p>
    </div>
    <div>
      <h3><i class="fas fa-graduation-cap"></i> Mentorship</h3>
      <p>Learning from experienced professionals and sharing knowledge with those starting their journey.</p>
    </div>
    <div>
      <h3><i class="fas fa-comments"></i> Networking</h3>
      <p>Connecting with cybersecurity professionals, cloud architects, and technology enthusiasts.</p>
    </div>
  </div>
</div>

<div style="background: var(--gradient); color: white; padding: 3rem; border-radius: 12px; text-align: center; margin: 3rem 0;">
  <h2 style="color: white; margin-bottom: 1rem;">Ready to Connect?</h2>
  <p style="font-size: 1.1rem; margin-bottom: 2rem; opacity: 0.9;">
    I'm always excited to discuss cybersecurity, cloud technologies, and potential collaborations.
  </p>
  <a href="mailto:amnworlanyo@gmail.com" style="background: white; color: var(--primary-color); padding: 1rem 2rem; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
    <i class="fas fa-rocket"></i> Start a Conversation
  </a>
</div>

<div style="text-align: center; color: var(--text-light);">
  <p><i class="fas fa-clock"></i> Response time: Usually within 24 hours</p>
  <p><i class="fas fa-map-marker-alt"></i> Based in Chicago, IL | Open to remote opportunities</p>
</div>

<script>
  // Handle Ready to Connect button click
  document.addEventListener('DOMContentLoaded', function() {
    // Find all email links and add click functionality
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    
    emailLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        // Check if the user's device can handle mailto links
        const email = 'amnworlanyo@gmail.com';
        const subject = 'Hello from your website';
        const body = 'Hi Noble,%0D%0A%0D%0AI found your website and would like to connect.%0D%0A%0D%0ABest regards,';
        
        // Try to open the default email client
        const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${body}`;
        
        // For better user experience, also show a notification
        setTimeout(function() {
          if (confirm('If your email client didn\'t open automatically, you can copy this email address: ' + email)) {
            // Copy email to clipboard if user confirms
            if (navigator.clipboard) {
              navigator.clipboard.writeText(email).then(function() {
                alert('Email address copied to clipboard!');
              });
            } else {
              // Fallback for older browsers
              const textArea = document.createElement('textarea');
              textArea.value = email;
              document.body.appendChild(textArea);
              textArea.select();
              document.execCommand('copy');
              document.body.removeChild(textArea);
              alert('Email address copied to clipboard!');
            }
          }
        }, 1000);
      });
    });
  });
</script>