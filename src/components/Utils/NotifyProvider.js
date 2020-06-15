import Notify from "./Notify"
import { useState, createContext } from "react"

export const NotifyContext = createContext()

const NotifyProvider = ({ children }) => {
  const [show, setShow] = useState(false)
  const [text, setText] = useState('')
  
  const value = {show, setShow, text, setText}

  return (
    <NotifyContext.Provider value={value}>
      {children}
      <Notify 
        show={show}
        setShow={setShow}
        text={text}
      />
    </NotifyContext.Provider>
  )
}

export default NotifyProvider