import Head from 'next/head'
import Sidebar from '../components/Sidebar'

export default function Home() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <Head>
        <title>Spotify Clone</title>
      </Head>
      <main className=''>
       <Sidebar/>
       { /** center */}
      </main>
      <div>
        {/**Player */}
      </div>

    </div>
  )
}
