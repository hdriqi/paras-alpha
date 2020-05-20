const Modal = ({ style, children, close }) => {
  const _closeModal = (e) => {
    if(e.target.id === 'modal-bg') {
      close()
    }
  }

  return (
    <div id="modal-bg" onClick={(e) => _closeModal(e)} className="fixed inset-0 w-full h-full z-40 p-8 pt-40" style={{
      backgroundColor: `rgba(0,0,0,0.5)`,
      ...style
    }}>
      {
        children
      }
    </div>
  )
}

export default Modal