import NavTop from "components/NavTop"
import Push from "components/Push"
import Image from "components/Image"
import { prettyBalance } from "lib/utils"
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import ReactTooltip from "react-tooltip"

TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en-US')

const Wallet = ({ me, balance, txList, getTx, hasMore }) => {
  const formattedBalance = prettyBalance(balance)

  return (
    <div className="bg-dark-0 min-h-screen pb-6">
      <ReactTooltip />
      <NavTop
        center={
          <div className="flex items-center">
            <div>
              <h3 className="text-white text-xl font-bold">Wallet</h3>
            </div>
            <div className="px-2 text-white-2">
              <a data-place="right" data-tip="Track your coin movement here.">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path className="fill-current" fillRule="evenodd" clipRule="evenodd" d="M1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12ZM21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM13.0036 13.9983H14.003V15.9983H10.003V13.9983H11.003V11.9983H10.003V9.99835H13.0036V13.9983ZM13.0007 7.99835C13.0007 8.55063 12.5528 8.99835 12.0003 8.99835C11.4479 8.99835 11 8.55063 11 7.99835C11 7.44606 11.4479 6.99835 12.0003 6.99835C12.5528 6.99835 13.0007 7.44606 13.0007 7.99835Z" />
                </svg>
              </a>
            </div>
          </div>
        }
      />
      <div className="px-4 py-4">
        <h4 className="text-white-1">Your Balance</h4>
        <div className="flex items-center">
          <h2 className="text-white" style={{
            fontSize: `2.5rem`
          }}>{formattedBalance}</h2>
          <svg className="ml-2" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="white" />
            <path d="M12.25 18.3828V25.0625H10V8H16.293C18.1602 8 19.6211 8.47656 20.6758 9.42969C21.7383 10.3828 22.2695 11.6445 22.2695 13.2148C22.2695 14.8711 21.75 16.1484 20.7109 17.0469C19.6797 17.9375 18.1992 18.3828 16.2695 18.3828H12.25ZM12.25 16.543H16.293C17.4961 16.543 18.418 16.2617 19.0586 15.6992C19.6992 15.1289 20.0195 14.3086 20.0195 13.2383C20.0195 12.2227 19.6992 11.4102 19.0586 10.8008C18.418 10.1914 17.5391 9.875 16.4219 9.85156H12.25V16.543Z" fill="white" />
          </svg>
        </div>
        <a className="text-sm text-white-2 text-underline hover:text-white font-bold" target="_blank" href="https://paras.id/blog/lets-make-a-pac">Learn more about PAC</a>
        <div>
          <Push href="/wallet/send" as="/wallet/send">
            <a>
              <button className="mt-4 bg-primary-5 rounded-md h-10 w-20 flex items-center justify-center hover:bg-primary-7 text-white font-semibold text-sm text-center p-2">SEND</button>
            </a>
          </Push>
        </div>
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h4 className="text-white-1">Recent Transactions</h4>
          </div>
          <div>
            {
              txList.slice(0, 3).map(tx => {
                const formattedBalance = prettyBalance(tx.value, 18, 4)
                const isOutTx = tx.from === me.id
                const user = isOutTx ? tx.toUser : tx.fromUser
                return (
                  <div key={tx.id} className="mt-4 p-2 bg-dark-1 rounded-md">
                    <div data-place="bottom" data-tip={tx.msg}>
                      <div className="flex items-center justify-between">
                        {
                          user ? (
                            <div className="flex items-center w-7/12 overflow-hidden ">
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
                          ) : (
                              <div className="flex items-center w-8/12 overflow-hidden ">
                                <div className="h-10 w-10 rounded-full overflow-hidden shadow-inner flex-shrink-0 bg-dark-0"></div>
                                <div className="ml-2 truncate">
                                  <a>
                                    <h4 className="text-white font-bold truncate">0x</h4>
                                  </a>
                                  <p className="text-white-3 text-sm">{timeAgo.format(tx.createdAt / (10 ** 6))}</p>
                                </div>
                              </div>
                            )
                        }
                        <div className="flex items-center justify-end w-5/12">
                          <h2 className="text-white text">{isOutTx ? '-' : '+'} {formattedBalance}</h2>
                          <svg className="ml-2" width="16" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="white" />
                            <path d="M12.25 18.3828V25.0625H10V8H16.293C18.1602 8 19.6211 8.47656 20.6758 9.42969C21.7383 10.3828 22.2695 11.6445 22.2695 13.2148C22.2695 14.8711 21.75 16.1484 20.7109 17.0469C19.6797 17.9375 18.1992 18.3828 16.2695 18.3828H12.25ZM12.25 16.543H16.293C17.4961 16.543 18.418 16.2617 19.0586 15.6992C19.6992 15.1289 20.0195 14.3086 20.0195 13.2383C20.0195 12.2227 19.6992 11.4102 19.0586 10.8008C18.418 10.1914 17.5391 9.875 16.4219 9.85156H12.25V16.543Z" fill="white" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <ReactTooltip />
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
                  <path fillRule="evenodd" clipRule="evenodd" d="M9.58586 8.00001L4.29297 2.70712L5.70718 1.29291L12.4143 8.00001L5.70718 14.7071L4.29297 13.2929L9.58586 8.00001Z" />
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