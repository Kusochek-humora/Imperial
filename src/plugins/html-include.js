import fs from 'node:fs';
import path from 'node:path';

// <include src="src/components/header/header.html"></include>
// Путь относительно корня проекта. Вложенные include поддерживаются.
//
// Параметры: остальные атрибуты include подставляются в партиал вместо {{name}}.
// {{name|значение}} — значение по умолчанию, если атрибут не передан.
// <include src="src/components/product-card/product-card.html" title="Офис" price="520 000 000 ₸"></include>
const INCLUDE_RE = /<include\s+([^>]*?)\s*(?:\/>|>\s*<\/include>)/g;
const VAR_RE = /\{\{\s*([\w-]+)\s*(?:\|([^}]*))?\}\}/g;

// <icon name="burger-menu" class="burger-menu__icon"></icon>
// Вставляет inline-svg из src/assets/icons/<name>.svg.
// class добавляется к "icon icon--<name>", остальные атрибуты переносятся на <svg>.
const ICON_RE = /<icon\s+([^>]*?)\s*(?:\/>|>\s*<\/icon>)/g;
const ATTR_RE = /([\w:-]+)=(?:"([^"]*)"|'([^']*)')/g;
const ICONS_DIR = 'src/assets/icons';

const parseAttrs = (raw) =>
  Object.fromEntries([...raw.matchAll(ATTR_RE)].map(([, k, v1, v2]) => [k, v1 ?? v2]));

function render(html, root, stack = []) {
  return html.replace(INCLUDE_RE, (_, rawAttrs) => {
    const { src, ...props } = parseAttrs(rawAttrs);

    if (!src) {
      throw new Error(`[html-include] <include> without src: <include ${rawAttrs}>`);
    }

    const file = path.resolve(root, src);

    if (stack.includes(file)) {
      throw new Error(`[html-include] circular include: ${[...stack, file].join(' -> ')}`);
    }
    if (!fs.existsSync(file)) {
      throw new Error(`[html-include] file not found: ${src}`);
    }

    const partial = fs
      .readFileSync(file, 'utf-8')
      .replace(VAR_RE, (__, name, fallback = '') => props[name] ?? fallback);

    return render(partial, root, [...stack, file]);
  });
}

function renderIcons(html, root) {
  return html.replace(ICON_RE, (_, rawAttrs) => {
    const { name, class: className = '', ...rest } = parseAttrs(rawAttrs);

    if (!name) {
      throw new Error(`[html-include] <icon> without name: <icon ${rawAttrs}>`);
    }

    const file = path.resolve(root, ICONS_DIR, `${name}.svg`);
    if (!fs.existsSync(file)) {
      throw new Error(`[html-include] icon not found: ${ICONS_DIR}/${name}.svg`);
    }

    const svgAttrs = {
      class: ['icon', `icon--${name}`, className].filter(Boolean).join(' '),
      'aria-hidden': 'true',
      focusable: 'false',
      ...rest,
    };
    const attrString = Object.entries(svgAttrs)
      .map(([k, v]) => `${k}="${v}"`)
      .join(' ');

    return fs
      .readFileSync(file, 'utf-8')
      .replace(/<\?xml[\s\S]*?\?>/g, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<svg\b/, `<svg ${attrString}`)
      .trim();
  });
}

export default function htmlInclude() {
  let root;

  return {
    name: 'html-include',
    configResolved(config) {
      root = config.root;
    },
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => renderIcons(render(html, root), root),
    },
    configureServer(server) {
      // при правке html-партиала или иконки перезагружаем страницу
      server.watcher.on('change', (file) => {
        if (/\.(html|svg)$/.test(file)) server.ws.send({ type: 'full-reload' });
      });
    },
  };
}
