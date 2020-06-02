const NavTop = ({ left, right, center}) => {
  return (
    <div className="sticky top-0 z-20 bg-dark-4 px-4">
      <div className="relative w-full h-12 flex items-center justify-center">
        <div className="absolute left-0">{left}</div>
        <div>{center}</div>
        <div className="absolute right-0">{right}</div>
      </div>
    </div>
  )
}

export default NavTop