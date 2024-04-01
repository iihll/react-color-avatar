import './App.scss'
import Container from './layouts/Container'
import { Footer } from './layouts/Footer'
import Header from './layouts/Header'
import Sider from './layouts/Sider'

function App() {

  return (
    <main className="main">
      <Container>
        <div className="content-wrapper">
          <div className="content-view">
            <Header />

            <div className="playground">
              <div className="avatar-wrapper"></div>
            </div>
            
            <Footer />
          </div>

          <div className="gradient-bg">
            <div className="gradient-top"></div>
            <div className="gradient-bottom"></div>
          </div>
        </div>
      </Container>

      <Sider>1</Sider>
    </main>
  )
}

export default App
