import { isMobile } from '../utils'

export class ImageZoom {
  constructor({ selector, config = {} }) {
    this.selector = selector
    this.config = config
    this.imgContainers = document.querySelectorAll(this.selector)
    this.rebuild = this.rebuild.bind(this)
    this.destroy = this.destroy.bind(this)

    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseOut = this.onMouseOut.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)

    if (this.imgContainers.length > 0) {
      this.setup()
    }
  }

  setup() {
    for (let i = 0; i < this.imgContainers.length; i++) {
      if (!isMobile.any) {
        this.imgContainers[i].addEventListener('mousemove', this.onMouseMove)
        this.imgContainers[i].addEventListener('dragover', this.onMouseMove)
        this.imgContainers[i].addEventListener('mouseout', this.onMouseOut)
      } else {
        this.imgContainers[i].addEventListener('touchmove', this.onTouchMove)
      }
    }
  }

  onMouseMove(e) {
    const imgContainer = e.currentTarget
    if (!imgContainer.dataset.zoomImageLoaded) {
      let imageObj = new Image()

      imageObj.src = imgContainer.dataset.zoomImage
      imageObj.onload = (e) => {
        imgContainer.dataset.zoomImageLoaded = true
        if (imageObj.width > imgContainer.offsetWidth) {
          imgContainer.style.backgroundImage = `url("${imgContainer.dataset.zoomImage}")`
          imgContainer.dataset.zoomEnabled = true
          this.imageZoomIn(imgContainer, e)
        }
      }
    } else if (imgContainer.dataset.zoomEnabled) {
      this.imageZoomIn(imgContainer, e)
    }
  }

  onMouseOut(e) {
    this.imageZoomOut(e.currentTarget)
  }

  onTouchMove(e) {
    const imgContainer = e.currentTarget
    if (!imgContainer.dataset.zoomImageLoaded) {
      const img = imgContainer.querySelector('img')
      let imageObj = new Image()

      imageObj.src = imgContainer.dataset.zoomImage
      imageObj.onload = () => {
        img.src = imgContainer.dataset.zoomImage
        imgContainer.dataset.zoomImageLoaded = true
      }
    }
  }

  imageZoomIn(imgContainer, e) {
    const img = imgContainer.querySelector('img')
    const offsetX = e.offsetX ? e.offsetX : 0
    const offsetY = e.offsetY ? e.offsetY : 0
    let x = (offsetX / imgContainer.offsetWidth) * 100
    let y = (offsetY / imgContainer.offsetHeight) * 100
    imgContainer.style.backgroundPosition = x + '% ' + y + '%'
    img.style.opacity = 0
    imgContainer.style.display = 'block'
  }

  imageZoomOut(imgContainer) {
    const img = imgContainer.querySelector('img')
    imgContainer.style.display = 'contents'
    img.style.opacity = 1
  }

  destroy() {
    for (let i = 0; i < this.imgContainers.length; i++) {
      if (!isMobile.any) {
        this.imgContainers[i].removeEventListener('mousemove', this.onMouseMove)
        this.imgContainers[i].removeEventListener('dragover', this.onMouseMove)
        this.imgContainers[i].removeEventListener('mouseout', this.onMouseOut)
      } else {
        this.imgContainers[i].removeEventListener('touchmove', this.onTouchMove)
      }
    }
  }

  rebuild() {
    this.destroy()
    this.imgContainers = document.querySelectorAll(this.selector)
    this.setup()
  }
}
