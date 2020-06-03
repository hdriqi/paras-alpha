import { useState } from 'react'
import axios from 'axios'
import { RotateSpinLoader } from 'react-css-loaders'

const NewPostUrl = ({ left, right, input = '' }) => {
  const [err, setErr] = useState(false)
  const [url, setUrl] = useState(input || '')
  const [loading, setLoading] = useState(false)

  const _validateSubmit = () => {
    const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    return url.match(regex)
  }

  const _right = async () => {
    setLoading(true)
    const response = await axios.get(`https://paras.id/metaget?link=${url}`)
    const meta = response.data.data
    setTimeout(() => {
      setLoading(false)
      right({
        type: 'url',
        body: {
          img: meta.image,
          title: meta.title,
          desc: meta.description,
          url: meta.url
        },
        payload: {
          img: meta.image,
          title: meta.title,
          desc: meta.description,
          url: meta.url
        }
      })
    }, 250)
  }

  const _left = () => {
    left()
  }

  return (
    <div className="fixed inset-0 z-50" style={{
      backgroundColor: `rgba(0,0,0,0.8)`
    }}>
      <div className="max-w-sm m-auto p-4 flex items-center h-full w-full">
        <div className="bg-dark-1 w-full rounded-md overflow-hidden">
          <div className="flex justify-between items-center w-full h-12 bg-dark-4 px-2">
            <div className="w-8 text-white">
              <svg onClick={e => _left(e)} width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="white" />
                <path fillRule="evenodd" clipRule="evenodd" d="M15.9999 17.6979L10.8484 22.8494L9.15137 21.1523L14.3028 16.0009L9.15137 10.8494L10.8484 9.15234L15.9999 14.3038L21.1514 9.15234L22.8484 10.8494L17.697 16.0009L22.8484 21.1523L21.1514 22.8494L15.9999 17.6979Z" fill="white" />
              </svg>
            </div>
            <div className="flex-auto text-white font-bold overflow-hidden px-2">Add Link</div>
            <div className="w-8 text-white flex items-center justify-end">
              {
                !loading ? (
                  <button disabled={!_validateSubmit()} className="ml-auto" onClick={e => _right(e)}>
                    <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#E13128" />
                      <circle cx="16" cy="16" r="16" fill="#E13128" />
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M13.7061 19.2929L22.999 10L24.4132 11.4142L13.7061 22.1213L7.99902 16.4142L9.41324 15L13.7061 19.2929Z" fill="white" />
                    </svg>
                  </button>
                ) : (
                    <RotateSpinLoader style={{
                      marginLeft: `auto`,
                      marginRight: 0
                    }} color="#e13128" size={2.4} />
                  )
              }
            </div>
          </div>
          <div className="w-full">
            <div className={`
                ${err && 'animated shake'}
                flex items-center h-full
              `}>
              <input type="text" className="w-full text-white px-2 py-2 bg-dark-0 outline-none" onChange={e => setUrl(e.target.value)} placeholder="https://" value={url} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewPostUrl