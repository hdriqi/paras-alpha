import React from "react"
import ContentLoader from "react-content-loader" 

const MementoCardLoader = () => (
  <ContentLoader 
    speed={2}
    width={`100%`}
    height={200}
    viewBox="0 0 400 200"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <rect x="0" y="8" rx="3" ry="3" width="88" height="16" /> 
    <rect x="0" y="41" rx="0" ry="0" width="120" height="120" /> 
    <rect x="140" y="40" rx="0" ry="0" width="120" height="120" /> 
    <rect x="280" y="40" rx="0" ry="0" width="120" height="120" /> 
    <rect x="344" y="8" rx="0" ry="0" width="56" height="8" />
  </ContentLoader>
)

export default MementoCardLoader