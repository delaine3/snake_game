import '../css/style.css'
import '../css/form.css'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <div className='app'>
      <Head>
        <title>Snake Game</title>
      </Head>

      <div className="top-bar">
      </div>
      <div className=" wrapper ">
        
        <Component {...pageProps} />
      </div>
    </div>
  )
}

export default MyApp
