import { Product } from './Product'

const productSelector = '[data-product="product"]'

export const product = () => {
  const productDOMElement = document.querySelector(productSelector)

  if (productDOMElement) {
    const productInstance = new Product()
  }
}
