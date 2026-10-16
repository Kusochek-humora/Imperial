import 'normalize.css';
import './styles/main.scss';

import { initI18n } from './i18n';
import { initLangSwitcher } from './components/lang-switcher/lang-switcher';

import { initHeader } from './sections/header/header';
import './sections/hero/hero';

await initI18n();

initLangSwitcher();
initHeader();
