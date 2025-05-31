import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import '../app/globals.css'


function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const isPublicPage = router.pathname === '/' || router.pathname === '/auth'

  return (
    <>
      {!isPublicPage && <Navbar />}
      <Component {...pageProps} />
    </>
  )
}

export default MyApp