import 'normalize.css';
import './styles/main.scss';

// секции
import { initHeader } from './sections/header/header';
import './sections/hero/hero';
import { initObjectsToolbar } from './sections/objects-preview/objects-preview';
import './sections/owners/owners';
import './sections/about/about';
import './sections/team/team';
import './sections/news-preview/news-preview';
import './sections/partners/partners';
import './sections/consult/consult';
import './sections/footer/footer';
import { initCatalog } from './sections/catalog/catalog';
import './sections/product/product.scss';
import { initNewsList } from './sections/news-list/news-list';

// компоненты
import './components/breadcrumbs/breadcrumbs.scss';
import './components/page-hero/page-hero.scss';
import './components/tiles/tiles.scss';
import './components/steps/steps.scss';
import './components/check-table/check-table.scss';
import './components/link-card/link-card.scss';
import './components/pagination/pagination.scss';
import './components/map/map.scss';
import { initFilters } from './components/filter/filter';
import { initFavorites } from './components/product-card/product-card';
import { initSliders } from './components/slider/slider';
import { initFaq } from './components/faq-item/faq-item';
import { initSelectMenus } from './components/select-menu/select-menu';
import { initShare } from './components/share/share';
import { initContent } from './components/content/content';
import { initCountUp } from './js/count-up';
import { initReveal } from './js/reveal';
import { initForms } from './components/form/form';
import { initModals } from './components/modal/modal';
import { initVideoBg } from './components/video-bg/video-bg';

// каждая функция сама проверяет, есть ли её блок на странице
initHeader();
initFilters();
initFavorites();
initSliders();
initFaq();
initObjectsToolbar();
initSelectMenus();
initShare();
initContent();
initCatalog();
initNewsList();
initCountUp();
initForms();
initModals();
initVideoBg();
initReveal();
