import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/estilos.css'
import './styles/tema.css'
import LoaderGlobal from '@/components/LoaderGlobal'

import { store } from '@/app/store'
import Rutas from '@/app/Rutas'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ToastContainer />
      <LoaderGlobal />
      <Rutas />
    </Provider>
  </StrictMode>,
)
