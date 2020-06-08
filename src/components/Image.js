const Image = ({ data = {}, className, style, onClick, id}) => {
  const url = data.type === 'ipfs' ? `https://ipfs-gateway.paras.id/ipfs/${data.url}` : data
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