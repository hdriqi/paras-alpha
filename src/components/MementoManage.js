import Push from "./Push"
import Pop from "./Pop"

const MementoManage = ({ id, memento, pendingPostCount }) => {
  return (
    <div className="bg-white-1 min-h-screen">
      <div className="pb-12">
        <div className="fixed bg-white top-0 left-0 right-0 h-12 px-4 z-20">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute left-0">
              <Pop>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M9.41412 12L16.707 19.2929L15.2928 20.7071L6.58569 12L15.2928 3.29291L16.707 4.70712L9.41412 12Z" fill="#222"/>
                </svg>
              </Pop>
            </div>
            <div>
              <h3 className="text-xl font-bold text-black-1 tracking-tighter">Manage Memento</h3>
            </div>
          </div>
        </div>
      </div>
      <div className="py-6">
        <div className="bg-white border-t border-black-6">
          <Push href="/m/[id]/edit" as={`/m/${id}/edit`} props={{
            id: id,
            memento: memento
          }}>
            <div className="px-4 py-2 flex justify-between border-b border-black-6">
              <div>
                <p className="text-xl tracking-tight">Edit memento</p>
              </div>
              <div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M14.5859 12L7.29297 4.70712L8.70718 3.29291L17.4143 12L8.70718 20.7071L7.29297 19.2929L14.5859 12Z" fill="black"/>
                </svg>
              </div>
            </div>
          </Push>
          <Push href="/m/[id]/pending" as={`/m/${id}/pending`} props={{
            id: id,
            memento: memento
          }}>
            <div className="px-4 py-2 flex justify-between border-b border-black-6">
              <div className="flex items-center">
                <p className="text-xl tracking-tight">Pending post</p>
                {
                  pendingPostCount && (
                    <div className="ml-2 text-sm text-center bg-black text-white rounded-full w-6 h-6 flex items-center justify-center">{pendingPostCount}</div>
                  )
                }
              </div>
              <div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M14.5859 12L7.29297 4.70712L8.70718 3.29291L17.4143 12L8.70718 20.7071L7.29297 19.2929L14.5859 12Z" fill="black"/>
                </svg>
              </div>
            </div>
          </Push>
        </div>
      </div>
    </div>
  )
}

export default MementoManage