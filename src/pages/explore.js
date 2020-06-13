import ExploreScreen from "screens/ExploreScreen"
import NavMobile from "components/NavMobile"

const ExplorePage = () => {
  return (
    <div>
      <ExploreScreen />
      <div className="sticky bottom-0 right-0 left-0 z-20">
        <NavMobile />
      </div>
    </div>
  )
}

export default ExplorePage