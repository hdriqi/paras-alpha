const Image = ({ data = {}, className, style, onClick, id}) => {
  let url = ''
  if(data.type === 'ipfs') {
    url = `https://ipfs-gateway.paras.id/ipfs/${data.url}`
  }
  else if(typeof data === 'string') {
    url = data
  }
  if(onclick) {
    return (
      <img id={id} onClick={onClick} className={className} style={style} src={url} />
    )
  }
  return (
    <img id={id} className={className} style={style} src={url} />
  )
}

export default Image