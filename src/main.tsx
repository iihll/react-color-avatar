import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { store } from './store'
import { Provider } from 'react-redux'
import './i18n'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import './styles/reset.css'
import './styles/global.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <Provider store={store}>
    <App />
  </Provider>
  // </React.StrictMode>,
)
