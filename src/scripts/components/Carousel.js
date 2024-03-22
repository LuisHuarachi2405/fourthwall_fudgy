import { tns } from 'tiny-slider/src/tiny-slider'
import { cssClasses } from '../utils'

export class Carousel {
  constructor({ selectors, config = {} }) {
    this.sliderDOMElement = document.querySelector(selectors.main)

    if (!this.sliderDOMElement) {
      console.error(
        `DOM Element with selector :: ${selectors.main} doesn't exist or it's value is equal null.`
      )
      return
    }

    this.config = config
    this.selectors = selectors
    this.itemTemplate = this.setItemTemplate()
    this.instance = tns(this.config)

    this.rebuild = this.rebuildInstance.bind(this)
    this.setConfig = this.setConfig.bind(this)
  }

  setItemTemplate() {
    const el = document.querySelector(this.selectors.item).cloneNode(true)
    el.querySelector('img').setAttribute('src', '')
    if (el.querySelector(this.selectors.imgHolder)) {
      el.querySelector(this.selectors.imgHolder).dataset.zoomImage = ''
      el.querySelector(this.selectors.imgHolder).dataset.zoomImageLoaded = ''
    }

    return el
  }

  setConfig(config) {
    this.config = config
  }

  rebuildInstance(images) {
    this.instance.destroy()

    if (!images) {
      this.instance = tns(this.config)
      return
    }

    this.sliderDOMElement = document.querySelector(this.selectors.main)
    this.sliderDOMElement.classList.add(cssClasses.loading)

    const tempContainer = document.createDocumentFragment()

    for (let i = 0; i < images.length; i++) {
      let slide = this.itemTemplate.cloneNode(true)
      slide.querySelector('img').setAttribute('src', images[i])
      slide.dataset.galleryItemIndex = i
      let imgHolder = slide.querySelector(this.selectors.imgHolder)
      if (imgHolder) {
        imgHolder.dataset.zoomImage = images[i]
      }
      tempContainer.appendChild(slide)
    }

    this.sliderDOMElement.innerHTML = ''
    this.sliderDOMElement.appendChild(tempContainer)
    this.instance = tns(this.config)
  }
}
