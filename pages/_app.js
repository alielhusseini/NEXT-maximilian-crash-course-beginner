// main: what nextJS will render
import '../styles/globals.css'
import Layout from '../components/layout/Layout' // component will wrap every page rendered (general component)

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
