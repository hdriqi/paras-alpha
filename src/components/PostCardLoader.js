import React from "react"
import ContentLoader from "react-content-loader" 

const PostCardLoader = () => (
  <ContentLoader 
    speed={2}
    width={`100%`}
    height={`100%`}
    viewBox="0 0 400 500"
    backgroundColor="#232323"
    foregroundColor="#272727"
  >
    <circle cx="23" cy="47" r="15" /> 
    <rect x="130" y="8" rx="2" ry="2" width="140" height="10" /> 
    <rect x="50" y="42" rx="2" ry="2" width="140" height="10" /> 
    <rect x="0" y="72" rx="2" ry="2" width="400" height="400" /> 
    <rect x="0" y="480" rx="0" ry="0" width="80" height="8" /> 
    <rect x="160" y="480" rx="0" ry="0" width="80" height="8" /> 
    <rect x="325" y="480" rx="0" ry="0" width="80" height="8" />
  </ContentLoader>
)

export default PostCardLoader