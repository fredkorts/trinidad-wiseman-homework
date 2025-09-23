const DISALLOWED_TAGS = new Set([
  'script',
  'style',
  'iframe',
  'object',
  'embed',
  'template',
  'noscript',
  'meta',
  'link',
]);

const URI_ATTRS = new Set(['href', 'src', 'xlink:href', 'formaction']);
const NODE_FILTER_SHOW_ELEMENT =
  typeof NodeFilter === 'undefined' ? 1 : NodeFilter.SHOW_ELEMENT;

/**
 * Sanitizes HTML by removing dangerous elements and event handler attributes.
 * Falls back to returning the original HTML when DOM APIs are unavailable (SSR).
 */
export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) {
    return '';
  }

  if (typeof window === 'undefined' || typeof window.DOMParser !== 'function') {
    return html;
  }

  const parser = new window.DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  if (!doc.body) {
    return '';
  }

  for (const tag of DISALLOWED_TAGS) {
    doc.body.querySelectorAll(tag).forEach((node) => node.remove());
  }

  const walker = doc.createTreeWalker(doc.body, NODE_FILTER_SHOW_ELEMENT);

  while (walker.nextNode()) {
    const element = walker.currentNode as Element;

    for (const attr of Array.from(element.attributes)) {
      const name = attr.name.toLowerCase();
      const value = attr.value.trim();

      if (name.startsWith('on')) {
        element.removeAttribute(attr.name);
        continue;
      }

      if (URI_ATTRS.has(name) && value.toLowerCase().startsWith('javascript:')) {
        element.removeAttribute(attr.name);
      }
    }
  }

  return doc.body.innerHTML;
}
