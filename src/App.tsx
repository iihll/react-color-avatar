import './App.scss'
import Container from './layouts/Container'
import Header from './layouts/Header'
import Sider from './layouts/Sider'

function App() {

  return (
    <main className="main">
      <Container>
        <div className="content-wrapper">
          <div className="content-view">
            <Header />
          </div>
        </div>
      </Container>

      <Sider>1</Sider>
    </main>
  )
}

export default App
