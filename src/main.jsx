import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './i18n.js'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { AppProvider } from './context/AppContext.jsx'
import { Provider } from 'react-redux'
import { persistor, store } from './redux/Store.js'
import { PersistGate } from 'redux-persist/integration/react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppProvider>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </AppProvider>
    </Provider>
  </React.StrictMode>,
)
