<?xml version="1.0" encoding="utf-8"?>
<!-- Renders feed.xml as a readable page in a browser. Feed readers ignore it. -->
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <title><xsl:value-of select="/rss/channel/title"/></title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style>
          :root { color-scheme: light dark; }
          body { margin: 0; background: #f8f6f1; color: #16181d; font: 17px/1.6 Inter, -apple-system, "Segoe UI", Roboto, sans-serif; }
          @media (prefers-color-scheme: dark) { body { background: #0f1115; color: #e9e6df; } .item { border-color: #262b33 !important; } .muted { color: #807e77 !important; } .box { background: #161a20 !important; border-color: #262b33 !important; } }
          main { max-width: 42rem; margin: 0 auto; padding: 3rem 1.5rem 5rem; }
          h1 { font: 400 2.4rem/1.1 "Instrument Serif", Georgia, serif; margin: 0 0 0.6rem; }
          h2 { font: 500 1.05rem/1.4 inherit; margin: 0 0 0.3rem; }
          a { color: #0b6b63; }
          .kicker { font: 500 0.72rem/1 ui-monospace, Menlo, Consolas, monospace; letter-spacing: 0.14em; text-transform: uppercase; color: #0b6b63; display: block; margin-bottom: 1rem; }
          .muted { color: #7b8089; font-size: 0.95rem; }
          .box { border: 1px solid #ddd7cb; background: #f0ece4; border-radius: 10px; padding: 1rem 1.2rem; margin: 1.5rem 0 2.5rem; font-size: 0.92rem; }
          .box code { font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 0.85em; }
          .item { border-top: 1px solid #ddd7cb; padding: 1.1rem 0; }
          .item time { font: 0.74rem/1 ui-monospace, Menlo, Consolas, monospace; color: #7b8089; letter-spacing: 0.04em; display: block; margin-bottom: 0.4rem; }
          .item p { margin: 0.2rem 0 0; font-size: 0.95rem; }
        </style>
      </head>
      <body>
        <main>
          <span class="kicker">RSS feed</span>
          <h1><xsl:value-of select="/rss/channel/title"/></h1>
          <p class="muted"><xsl:value-of select="/rss/channel/description"/></p>
          <div class="box">
            <strong>What this page is.</strong> This is a web feed. Paste this address into a feed reader (NetNewsWire, Feedly, Reeder, Inoreader, Thunderbird, or any other) and new posts will arrive there automatically:
            <br/><code><xsl:value-of select="/rss/channel/link"/>feed.xml</code>
            <br/><a href="{/rss/channel/link}">Back to the site</a>
          </div>
          <xsl:for-each select="/rss/channel/item">
            <article class="item">
              <time><xsl:value-of select="substring(pubDate, 1, 16)"/></time>
              <h2><a href="{link}"><xsl:value-of select="title"/></a></h2>
              <p class="muted"><xsl:value-of select="description"/></p>
            </article>
          </xsl:for-each>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
