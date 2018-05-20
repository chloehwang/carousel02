import throttle from "lodash.throttle"
import { products } from "../../html/data/global.json"

export default class Controls {
  constructor(el) {
    this.el = el
    this.init()
    this.bindEvents()
  }

  init() {
    this.slides         = [].slice.call(document.getElementsByClassName('product'))
    this.slidesMap      = this.cacheDetails()
    this.slidesLength   = this.slides.length - 1

    this.current        = 0
    this.transitionDur  = 2000

    this.productDetails = document.getElementById('product-details')
    this.productName    = this.productDetails.getElementsByClassName('product-name')[0]
  }

  cacheDetails() {
    let map = []

    this.slides.forEach((slide, i) => {
      map[i] = slide

      if (slide.classList.contains('-active')) {
        this.activeSlide = slide
      }
    })

    return map
  }

  bindEvents() {
    this.el.addEventListener('click', throttle(
      this.onClick,
      this.transitionDur + 50
    ))
  }

  onClick = (e) => {
    let increment = parseInt(e.target.dataset.increment)

    if (!increment) {
      return
    }

    let num       = this.calcNum(increment)
    this.newSlide = this.slidesMap[num]

    this.setCssVariable(increment)
    this.moveSlides()
    this.updateProductDetails(num)
    this.removeClass(num)
  }

  calcNum(increment) {
    let num = this.current + increment

    if (num > this.slidesLength) {
      num = 0
    }
    else if (num < 0) {
      num = this.slidesLength
    }

    return num
  }

  setCssVariable(increment) {
    if (increment === 1) {
      this.activeSlide.style.setProperty('--dir', '1');
      this.newSlide.style.setProperty('--dir', '1');
      this.productDetails.style.setProperty('--dir', '1');
    }
    else {
      this.activeSlide.style.setProperty('--dir', '-1');
      this.newSlide.style.setProperty('--dir', '-1');
      this.productDetails.style.setProperty('--dir', '-1');
    }
  }

  moveSlides() {
    this.newSlide.classList.add('-enter')
    this.newSlide.classList.add('-active')
    this.activeSlide.classList.add('-exit')
    this.activeSlide.classList.remove('-active')
  }

  updateProductDetails(n) {
    this.productDetails.classList.add('-exit')

    setTimeout(() => {
      this.productDetails.classList.remove('-exit')
      this.productDetails.classList.add('-enter')
      this.productName.innerHTML = products[n].name
    }, ((this.transitionDur / 2) - 300))
  }

  removeClass(n) {
    setTimeout(() => {
      this.activeSlide.classList.remove('-exit')
      this.newSlide.classList.remove('-enter')
      this.productDetails.classList.remove('-enter')

      this.setActive(n)
    }, this.transitionDur)
  }

  setActive(n) {
    this.current = n
    this.activeSlide = this.newSlide
  }
}
