/** @jsx h */

import { h } from 'preact'
import { useState, useRef, useEffect } from 'preact/hooks'

const TEN_OR_MORE_VALUE = '10+'
const selectOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, TEN_OR_MORE_VALUE]

export const CartQuantity = ({ value = 0, id, onChange }) => {
  const [input, forceInputField] = useState(false)
  const [currentValue, setCurrentValue] = useState(value)
  const inputRef = useRef(null)

  const handleQuantityChange = (e) => {
    if (onChange && e.target.value !== currentValue) {
      setCurrentValue(e.target.value)
      if (e.target.value === TEN_OR_MORE_VALUE) {
        forceInputField(true)
      } else {
        forceInputField(false)
        onChange(e.target.value, id)
      }
    }
  }
  
  useEffect(() => {
    if (input) {
      inputRef.current.focus()
    }
  }, [input])

  const renderInput = () => {
    return (
      <div className="input-field input-field--quantity input-field--transparent input-field--base input-field--cart-item">
        <input
          className="input-field__input"
          value={value}
          ref={inputRef}
          onBlur={handleQuantityChange}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current.blur()}
        />
      </div>
    )
  }

  const renderSelect = () => {
    return (
      <div className="select-field select-field--quantity select-field--transparent select-field--base select-field--cart-item">
        <select
          className="select-field__select"
          value={value}
          onChange={handleQuantityChange}
        >
          {selectOptions.map((item) => (
            <option key={item} id={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <div className="select-field__dropdown-icon">
          <svg
            class="svg-fill-current-color"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z" />
          </svg>
        </div>
      </div>
    )
  }

  if (value >= 10 || input) {
    return renderInput()
  }

  return renderSelect()
}
