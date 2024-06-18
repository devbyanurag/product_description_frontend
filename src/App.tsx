import Dashboard from './pages/Dashboard/Dashboard'
import Header from './components/Header/Header'
import { ToastContainer } from 'react-toastify'

function App() {

  return (
    <>
      <Header />
      <Dashboard />
      <ToastContainer />

    </>
  )
}

export default App
