import { useRouter } from 'next/router'

const DistributePage = () => {
  return <div />
  // const router = useRouter()
  // // Make sure we're in the browser
  // if (typeof window !== 'undefined') {
  //   router.push('/new/post')
  //   return
  // }
}

DistributePage.getInitialProps = ctx => {
  // We check for ctx.res to make sure we're on the server.
  if (ctx.res) {
    ctx.res.writeHead(302, { Location: '/new/post' })
    ctx.res.end()
  }
  return { }
}

export default DistributePage