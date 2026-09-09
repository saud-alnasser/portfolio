// The direct contrast measurement the contrast tests run inside the page.
// It is kept apart from the spec so a test can import it and so the spec
// reads as assertions.

// Pairs of text and background under the WCAG AA ratio, measured in the
// page. Large text (24px, or 18.66px bold) needs 3:1; anything else 4.5:1.
// Only elements with their own visible text are measured, and the
// background is the nearest ancestor that paints one, which the root always
// does.
export function lowContrastPairs(): string[] {
  const parse = (color: string): [number, number, number, number] | null => {
    const match = color.match(/rgba?\(([^)]+)\)/);
    if (!match) return null;
    const [r, g, b, a = '1'] = match[1].split(/[\s,\/]+/).filter(Boolean);
    return [Number(r), Number(g), Number(b), Number(a)];
  };
  const luminance = ([r, g, b]: number[]) => {
    const channel = (value: number) => {
      const c = value / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  };
  const ratio = (a: number[], b: number[]) => {
    const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (light + 0.05) / (dark + 0.05);
  };
  const backgroundOf = (element: Element): number[] | null => {
    for (let node: Element | null = element; node; node = node.parentElement) {
      const parsed = parse(getComputedStyle(node).backgroundColor);
      if (parsed && parsed[3] > 0) return parsed;
    }
    return null;
  };
  const describe = (element: Element) => {
    const tag = element.tagName.toLowerCase();
    const id = element.id ? `#${element.id}` : '';
    const text = (element.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 40);
    return `${tag}${id} "${text}"`;
  };

  const failures: string[] = [];
  let measured = 0;
  for (const element of document.body.querySelectorAll('*')) {
    const ownText = [...element.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && (node.textContent ?? '').trim() !== '');
    if (!ownText) continue;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    if (style.visibility === 'hidden' || style.display === 'none' || rect.width <= 1 || rect.height <= 1) continue;
    const foreground = parse(style.color);
    const background = backgroundOf(element);
    if (!foreground || !background) {
      failures.push(`${describe(element)}: could not read its colours (${style.color} on ${background ? 'a background' : 'nothing painted'})`);
      continue;
    }
    const size = parseFloat(style.fontSize);
    const bold = parseInt(style.fontWeight, 10) >= 700;
    const large = size >= 24 || (bold && size >= 18.66);
    const required = large ? 3 : 4.5;
    const found = ratio(foreground, background);
    measured += 1;
    if (found < required) {
      failures.push(`${describe(element)}: ${found.toFixed(2)}:1, expected ${required}:1 (${style.color} on rgb(${background.slice(0, 3).join(', ')}) at ${size}px${bold ? ' bold' : ''})`);
    }
  }
  if (measured === 0) failures.push('no text was measured');
  return failures;
}
