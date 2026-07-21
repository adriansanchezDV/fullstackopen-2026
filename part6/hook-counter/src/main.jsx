import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import {CounterContextProvider} from './components/counterContext'
createRoot(document.getElementById('root')).render(
  <StrictMode>
      <CounterContextProvider>
      <App />
    </CounterContextProvider>
  </StrictMode>,
)
