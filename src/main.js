import 'normalize.css';
import './styles/main.scss';

import { initHeader } from './sections/header/header';
import './sections/hero/hero';
import { initObjectsToolbar } from './sections/objects-preview/objects-preview';
import './sections/owners/owners';
import './sections/about/about';
import './sections/team/team';
import './sections/news-preview/news-preview';
import { initFaq } from './components/faq-item/faq-item';
import './sections/partners/partners';
import './sections/consult/consult';
import './sections/footer/footer';

import { initFilters } from './components/filter/filter';
import { initFavorites } from './components/product-card/product-card';
import { initSliders } from './components/slider/slider';
import { initCountUp } from './js/count-up';

initHeader();
initFilters();
initFavorites();
initSliders();
initFaq();
initObjectsToolbar();
initCountUp();
