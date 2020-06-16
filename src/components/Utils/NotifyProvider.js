import Notify from "./Notify"
import { useState, createContext } from "react"

export const NotifyContext = createContext()

const NotifyProvider = ({ children }) => {
  const [reveal, setReveal] = useState(false)
  const [text, setText] = useState('')

  const setShow = (val, timeout) => {
    setReveal(val)
    if (val && timeout) {
      setTimeout(() => {
        setReveal(false)
      }, timeout)
    }
  }
  
  const value = {setShow, setText}

  return (
    <NotifyContext.Provider value={value}>
      {children}
      <Notify 
        show={reveal}
        setShow={setShow}
        text={text}
      />
    </NotifyContext.Provider>
  )
}

export default NotifyProvider