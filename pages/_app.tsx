import type { AppProps } from 'next/app'
import Navbar from '@components/NavBar'
import '@styles/main.css'
import MobileMenu from '@components/MobileMenu'
import Intro from '@components/Intro'
const FoodBank = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <MobileMenu />
      <Navbar />
      <main className='relative min-h-screen lg:main lg:mt-16'>
        <Component {...pageProps} />
      </main>
      <Intro />
    </>
  )
}
export default FoodBank
