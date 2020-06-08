import propType from 'prop-types'

const Notify = ({ show, children }) => {
  return show ? (
    <div id="notify-modal" className="fixed inset-0 z-50 flex items-center">
      <div className="max-w-xs m-auto p-4">
        <div className="bg-dark-1 rounded-md overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  ) : null
}

Notify.propTypes = {
  show: propType.bool.isRequired
}

export default Notify