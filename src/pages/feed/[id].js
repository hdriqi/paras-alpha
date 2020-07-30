import FeedScreen from "screens/FeedScreen"
import { useRouter } from "next/router"
import NavTop from "components/NavTop"

const FeedPage = () => {
  const router = useRouter()

  return (
    <div>
      <NavTop
        center={
          <div className="flex justify-center">
            <h3 className="text-white text-xl font-bold px-2">Editors' Picks</h3>
            <h3 className="text-white text-xl font-bold px-2">Following</h3>
          </div>
        }
      />
      <FeedScreen id={router.query.id} />
    </div>
  )
}

export default FeedPage