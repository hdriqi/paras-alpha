import NavTop from "components/NavTop"
import Push from "components/Push"
import Image from "components/Image"
import { prettyBalance } from "lib/utils"
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en-US')

const Wallet = ({ me, balance, txList, getTx, hasMore }) => {
  const formattedBalance = prettyBalance(balance)

  return (
    <div className="bg-dark-0 min-h-screen pb-6">
      <NavTop
        center={
          <h3 className="text-white text-xl font-bold">Wallet</h3>
        }
      />
      <div className="px-4 py-4">
        <h4 className="text-white-1">Your Balance</h4>
        <div className="flex items-center">
          <h2 className="text-white" style={{
            fontSize: `2.5rem`
          }}>{formattedBalance}</h2>
          <svg className="ml-2" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="white" />
            <path d="M12.25 18.3828V25.0625H10V8H16.293C18.1602 8 19.6211 8.47656 20.6758 9.42969C21.7383 10.3828 22.2695 11.6445 22.2695 13.2148C22.2695 14.8711 21.75 16.1484 20.7109 17.0469C19.6797 17.9375 18.1992 18.3828 16.2695 18.3828H12.25ZM12.25 16.543H16.293C17.4961 16.543 18.418 16.2617 19.0586 15.6992C19.6992 15.1289 20.0195 14.3086 20.0195 13.2383C20.0195 12.2227 19.6992 11.4102 19.0586 10.8008C18.418 10.1914 17.5391 9.875 16.4219 9.85156H12.25V16.543Z" fill="white" />
          </svg>
        </div>
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h4 className="text-white-1">Recent Transactions</h4>
            <div>
              <Push href="/wallet/transaction" as="/wallet/transaction">
                <a>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M9.58586 8.00001L4.29297 2.70712L5.70718 1.29291L12.4143 8.00001L5.70718 14.7071L4.29297 13.2929L9.58586 8.00001Z" fill="black" />
                  </svg>
                </a>
              </Push>
            </div>
          </div>
          <div>
            {
              txList.slice(0, 3).map(tx => {
                const formattedBalance = prettyBalance(tx.value)
                const isOutTx = tx.from === me.id
                const user = isOutTx ? tx.toUser : tx.fromUser
                return (
                  <div key={tx.id} className="mt-4 p-2 bg-dark-1 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center w-8/12 overflow-hidden ">
                        <div className="h-10 w-10 rounded-full overflow-hidden shadow-inner flex-shrink-0">
                          <Push href="/[id]" as={`/${user.id}`} props={{
                            id: user.id,
                            user: user.id
                          }}>
                            <a>
                              <Image className="object-fill" data={user.imgAvatar} />
                            </a>
                          </Push>
                        </div>
                        <div className="ml-2 truncate">
                          <Push href="/[id]" as={`/${user.id}`} props={{
                            id: user.id,
                            user: user.id
                          }}>
                            <a>
                              <h4 className="text-white font-bold truncate">{user.id}</h4>
                            </a>
                          </Push>
                          <p className="text-white-3 text-sm">{timeAgo.format(tx.createdAt / (10 ** 6))}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-end w-4/12">
                        <h2 className="text-white text">{isOutTx ? '-' : '+'} {formattedBalance}</h2>
                        <svg className="ml-2" width="16" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="white" />
                          <path d="M12.25 18.3828V25.0625H10V8H16.293C18.1602 8 19.6211 8.47656 20.6758 9.42969C21.7383 10.3828 22.2695 11.6445 22.2695 13.2148C22.2695 14.8711 21.75 16.1484 20.7109 17.0469C19.6797 17.9375 18.1992 18.3828 16.2695 18.3828H12.25ZM12.25 16.543H16.293C17.4961 16.543 18.418 16.2617 19.0586 15.6992C19.6992 15.1289 20.0195 14.3086 20.0195 13.2383C20.0195 12.2227 19.6992 11.4102 19.0586 10.8008C18.418 10.1914 17.5391 9.875 16.4219 9.85156H12.25V16.543Z" fill="white" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
          <div className="flex justify-end">
            <Push href="/wallet/transaction" as="/wallet/transaction">
              <a className="flex items-center text-white-3 pt-4 hover:text-white">
                <h4 className="font-bold">All transactions</h4>
                <svg className="fill-current ml-2" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M9.58586 8.00001L4.29297 2.70712L5.70718 1.29291L12.4143 8.00001L5.70718 14.7071L4.29297 13.2929L9.58586 8.00001Z" />
                </svg>
              </a>
            </Push>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Wallet