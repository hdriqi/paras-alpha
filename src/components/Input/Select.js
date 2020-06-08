import { useState, useEffect, useRef } from 'react'
import Scrollbars from 'react-custom-scrollbars'

const Select = ({ isSearchable = true, placeholder = 'Select...', initial = {}, options, onChange }) => {
  const [text, setText] = useState('')
  const [showOptions, setShowOptions] = useState(false)
  const [option, setOption] = useState(initial)
  const selectRef = useRef(null)

  useEffect(() => {
    const onClickEv = (e) => {
      if (!selectRef.current.contains(e.target)) {
        if (option.label && text.length > 0) {
          setText(option.label)
        }
        else {
          setText('')
        }
        setShowOptions(false)
      }
    }
    if (showOptions) {
      document.addEventListener('click', onClickEv)
    }

    return () => {
      document.removeEventListener('click', onClickEv)
    }
  }, [showOptions])

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(option)
    }
  }, [option])

  const _textOnChange = (val) => {
    if (val.length === 0) {
      setOption({})
    }
    setText(val)
    setShowOptions(true)
  }

  const _chooseOpt = (opt) => {
    setText('')
    setOption(opt)
    setShowOptions(false)
  }

  const filteredOptions = isSearchable ? options.filter(opt => opt.label.toLowerCase().includes(text.toLowerCase())) : options

  const computedPlaceholder = option.label ? '' : placeholder
  
  return (
    <div ref={selectRef} className="relative">
      <div onClick={_ => setShowOptions(!showOptions)}  className={`
        ${showOptions ? 'bg-dark-16' : 'bg-dark-2'}
        flex items-center w-full rounded-md outline-none
      `}>
        <div className="w-11/12 relative">
          {
            text.length === 0 && (
              <p className="absolute inset-0 text-white p-2">{option.label}</p>
            )
          }
          <input readOnly={!isSearchable} className="z-10 relative cursor-default p-2 w-full bg-transparent outline-none text-white" value={text} onChange={e => _textOnChange(e.target.value)} type="text" placeholder={computedPlaceholder} />
        </div>
        <div className="w-1/12 flex justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M13.293 4.29291L14.7072 5.70712L8.00008 12.4142L1.29297 5.70712L2.70718 4.29291L8.00008 9.5858L13.293 4.29291Z" fill="white" />
          </svg>
        </div>
      </div>
      <div className={`
      ${showOptions ? 'block' : 'hidden'}
      absolute w-full pt-2 z-30
      `}>
        <div className="bg-dark-16 rounded-md overflow-hidden">
          <Scrollbars
            autoHeight
            autoHeightMin={0}
            autoHeightMax={200}
          >
            {
              filteredOptions.map((opt, idx) => {
                return (
                  <div key={idx} onClick={_ => _chooseOpt(opt)} className={`
                    ${opt.value === option.value && 'bg-dark-6'}
                    p-2 text-white hover:bg-dark-6 cursor-pointer
                  `}>
                    {opt.label}
                  </div>
                )
              })
            }
          </Scrollbars>
        </div>
      </div>
    </div>
  )
}

export default Select