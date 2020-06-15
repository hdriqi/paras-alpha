import propType from 'prop-types'

const Notify = ({ show, setShow, text }) => {
  return show ? (
    <div id="notify-modal" className="fixed inset-0 z-50 flex items-center" onClick={_ => setShow(false)}>
      <div className="max-w-xs m-auto p-4">
        <div className="bg-dark-1 rounded-md overflow-hidden">
          <p className="text-white text-center p-2">{text}</p>
        </div>
      </div>
    </div>
  ) : null
}

Notify.propTypes = {
  show: propType.bool.isRequired
}

export default Notify