/** @jsx h */

import { h } from 'preact'

import { strings } from '../../utils'

export const CartModal = ({ title, callback }) => {
  const heading = strings.cart.deleteModal.heading.replace('[title]', title)

  const handleConfirmAction = () => {
    callback(true)
  }

  const handleCancelAction = () => {
    callback(false)
  }

  return (
    <div className="modal">
      <div className="modal__overlay" onClick={handleCancelAction} />

      <div className="modal__content modal__content--shift-up">
        <button className="modal__close" onClick={handleCancelAction}>
          <svg
            class="svg-fill-current-color"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 7L1.27 1.27 7 7l5.73-5.73L7 7zm0 0l5.73 5.73L7 7l-5.73 5.73L7 7z"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              fill-rule="evenodd"
              stroke-linecap="square"
            />
          </svg>
        </button>

        <h5 className="modal__heading modal__heading--center">{heading}</h5>

        <div className="modal__cta">
          <button
            onClick={handleCancelAction}
            className="button button--outline button--small"
          >
            {strings.cart.deleteModal.cancel}
          </button>

          <button
            onClick={handleConfirmAction}
            className="button button--primary button--small"
          >
            {strings.cart.deleteModal.delete}
          </button>
        </div>
      </div>
    </div>
  )
}
