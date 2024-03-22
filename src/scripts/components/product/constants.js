import { isMobile } from '../../utils'

const dataPrefix = 'data-gallery'
const swipeAngle = 40

export const mainSelectors = {
  main: `[${dataPrefix}="gallery"]`,
  item: `[${dataPrefix}="gallery-slide"]`,
  navPrev: `[${dataPrefix}="nav-prev"]`,
  navNext: `[${dataPrefix}="nav-next"]`,
  imgHolder: `[${dataPrefix}="gallery-img-holder"]`,
}

export const thumbnailsSelectors = {
  main: `[${dataPrefix}="thumbnails"]`,
  item: `[${dataPrefix}="thumbnail"]`,
  navPrev: `[${dataPrefix}="thumbnails-nav-prev"]`,
  navNext: `[${dataPrefix}="thumbnails-nav-next"]`,
}

export const mainConfig = {
  container: mainSelectors.main,
  mode: isMobile.any ? 'carousel' : 'gallery',
  items: 1,
  slideBy: 1,
  autoplay: false,
  mouseDrag: isMobile.any ? true : false,
  controls: true,
  controlsContainer: false,
  prevButton: mainSelectors.navPrev,
  nextButton: mainSelectors.navNext,
  nav: true,
  loop: false,
  navContainer: thumbnailsSelectors.main,
  navAsThumbnails: true,
  swipeAngle: swipeAngle,
  preventScrollOnTouch: 'auto',
}

export const thumbnailsConfig = {
  container: thumbnailsSelectors.main,
  items: 4,
  gutter: 8,
  responsive: {
    1200: {
      items: 5,
    },
    1440: {
      items: 6,
    },
  },
  slideBy: 1,
  autoplay: false,
  mouseDrag: isMobile.any ? true : false,
  controls: true,
  controlsContainer: false,
  prevButton: thumbnailsSelectors.navPrev,
  nextButton: thumbnailsSelectors.navNext,
  nav: false,
  loop: false,
  swipeAngle: swipeAngle,
  preventScrollOnTouch: 'auto',
}

export const desktopBreakpoint = '(min-width: 1024px)'
