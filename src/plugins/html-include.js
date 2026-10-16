import fs from 'node:fs';
import path from 'node:path';

// <include src="src/components/header/header.html"></include>
// Путь относительно корня проекта. Вложенные include поддерживаются.
const INCLUDE_RE = /<include\s+src=["']([^"']+)["']\s*(?:\/>|>\s*<\/include>)/g;

// <icon name="burger-menu" class="burger-menu__icon"></icon>
// Вставляет inline-svg из src/assets/icons/<name>.svg.
// class добавляется к "icon icon--<name>", остальные атрибуты переносятся на <svg>.
const ICON_RE = /<icon\s+([^>]*?)\s*(?:\/>|>\s*<\/icon>)/g;
const ATTR_RE = /([\w:-]+)=["']([^"']*)["']/g;
const ICONS_DIR = 'src/assets/icons';

function render(html, root, stack = []) {
  return html.replace(INCLUDE_RE, (_, src) => {
    const file = path.resolve(root, src);

    if (stack.includes(file)) {
      throw new Error(`[html-include] circular include: ${[...stack, file].join(' -> ')}`);
    }
    if (!fs.existsSync(file)) {
      throw new Error(`[html-include] file not found: ${src}`);
    }

    return render(fs.readFileSync(file, 'utf-8'), root, [...stack, file]);
  });
}

function renderIcons(html, root) {
  return html.replace(ICON_RE, (_, rawAttrs) => {
    const attrs = Object.fromEntries([...rawAttrs.matchAll(ATTR_RE)].map(([, k, v]) => [k, v]));
    const { name, class: className = '', ...rest } = attrs;

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
