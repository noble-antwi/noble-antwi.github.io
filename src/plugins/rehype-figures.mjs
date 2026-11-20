// Turns a standalone markdown image into a captioned, clickable figure.
//   ![Alt text](/assets/…)   ->   <figure><a class="frame"><img></a><figcaption>Alt text</figcaption></figure>
// Images with empty alt text are left as plain images, and so are inline
// images that sit in a paragraph with other content.
//
// A numbered figure: when the next paragraph is one italic line that starts
// with "Figure", that line becomes the caption (with the number in bold) and
// the alt text stays on the image, where screen readers want it.
//   ![What the picture shows](/assets/…)
//
//   *Figure 3.2: What it proves.*
import { visit } from 'unist-util-visit';

export function rehypeFigures() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'p' || !parent || index === undefined) return;
      const kids = node.children.filter((c) => !(c.type === 'text' && !c.value.trim()));
      if (kids.length !== 1 || kids[0].type !== 'element' || kids[0].tagName !== 'img') return;

      const img = kids[0];
      const { src, alt } = img.properties ?? {};
      if (!src) return;
      img.properties.loading = 'lazy';
      img.properties.decoding = 'async';

      const link = {
        type: 'element',
        tagName: 'a',
        /* An image with a relative path is optimised by Astro and gets its real address at build time, after this
           plugin runs. Its link is filled in by the page (Base.astro) from the image itself. */
        properties: /^(\/|https?:)/.test(src)
          ? { className: ['frame'], href: src, target: '_blank', rel: 'noopener' }
          : { className: ['frame'], 'data-zoom': '', role: 'link', tabIndex: 0 },
        children: [img],
      };
      const children = [link];
      /* a following "*Figure N: ...*" line is this figure's caption */
      let next = index + 1;
      while (parent.children[next]?.type === 'text' && !parent.children[next].value.trim()) next++;
      const cand = parent.children[next];
      const inner = cand?.type === 'element' && cand.tagName === 'p' ? cand.children.filter((c) => !(c.type === 'text' && !c.value.trim())) : [];
      const em = inner.length === 1 && inner[0].type === 'element' && inner[0].tagName === 'em' ? inner[0] : null;
      const first = em?.children[0];
      const numbered = first?.type === 'text' ? first.value.match(/^(Figure [\d.]+)[:.]?\s*/) : null;
      if (em && numbered) {
        const rest = [{ type: 'text', value: first.value.slice(numbered[0].length) }, ...em.children.slice(1)];
        children.push({
          type: 'element', tagName: 'figcaption', properties: {},
          children: [{ type: 'element', tagName: 'b', properties: {}, children: [{ type: 'text', value: numbered[1] }] }, { type: 'text', value: ' ' }, ...rest],
        });
        parent.children.splice(index + 1, next - index);
      } else if (alt) {
        children.push({
          type: 'element',
          tagName: 'figcaption',
          properties: {},
          children: [{ type: 'text', value: alt }],
        });
      }
      parent.children[index] = { type: 'element', tagName: 'figure', properties: {}, children };
    });
  };
}
