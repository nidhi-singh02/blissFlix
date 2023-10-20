import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Providers from '../components/providers/Providers'
import Header from '@/components/Header'
import { AppContext } from '@/components/UserContext'
import { WagmiProvider } from '../utils/wagmi'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Providers> 
      <WagmiProvider>
      <AppContext>
        <div className="bg-white max-w-7xl mx-auto">
          <Header/>
          <Component {...pageProps} />
        </div>
      </AppContext>
      </WagmiProvider>
    </Providers>
  )
}
