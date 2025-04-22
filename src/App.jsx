import './App.css'
import About from './components/about/About'
import Contact from './components/contact/Contact'
import Demo from './components/demo/Demo'
import Footer from './components/footer/Footer'
import Header from './components/header/Header'
import Review from './components/review/Review'
import Search from './components/search/Search'

function App() {
  return (
    <div className='app'>
      <Header />
      <Search />
      <Demo />
      <About />
      <Review />
      <Contact />
      <Footer />
    </div>
  )
}

export default App
