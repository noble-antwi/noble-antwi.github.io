// Turns a standalone markdown image into a captioned, clickable figure.
//   ![Alt text](/assets/…)   ->   <figure><a class="frame"><img></a><figcaption>Alt text</figcaption></figure>
// Images with empty alt text are left as plain images, and so are inline
// images that sit in a paragraph with other content.
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
        properties: { className: ['frame'], href: src, target: '_blank', rel: 'noopener' },
        children: [img],
      };
      const children = [link];
      if (alt) {
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
