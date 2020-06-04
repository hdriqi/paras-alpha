const NavTop = ({ left, right, center}) => {
  return (
    <div className="sticky top-0 z-20 bg-dark-12 px-4">
      <div className="flex justify-between items-center w-full h-12">
        <div className="w-8">{left}</div>
        <div className="flex-auto overflow-hidden px-2">{center}</div>
        <div className="w-8">{right}</div>
      </div>
    </div>
  )
}

export default NavTop