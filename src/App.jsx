import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './pages/Navbar'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<div>Home Page</div>} />
        {/* Add more routes here */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
