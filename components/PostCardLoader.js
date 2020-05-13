import React from "react"
import ContentLoader from "react-content-loader" 

const PostCardLoader = () => (
  <ContentLoader 
    speed={2}
    width={`100%`}
    height={400}
    viewBox="0 0 400 400"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <rect x="48" y="8" rx="3" ry="3" width="88" height="6" /> 
    <rect x="48" y="26" rx="3" ry="3" width="52" height="6" /> 
    <rect x="0" y="280" rx="3" ry="3" width="410" height="6" /> 
    <rect x="0" y="296" rx="3" ry="3" width="380" height="6" /> 
    <rect x="0" y="312" rx="3" ry="3" width="178" height="6" /> 
    <circle cx="20" cy="20" r="20" /> 
    <rect x="0" y="60" rx="0" ry="0" width="400" height="200" />
  </ContentLoader>
)

export default PostCardLoader