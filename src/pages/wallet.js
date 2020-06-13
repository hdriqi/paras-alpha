import WalletScreen from 'screens/WalletScreen'
import NavMobile from 'components/NavMobile'

const WalletPage = () => {
  return (
    <div>
      <WalletScreen />
      <div className="sticky bottom-0 right-0 left-0 z-20">
        <NavMobile />
      </div>
    </div>
  )
}

export default WalletPage