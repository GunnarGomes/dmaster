import { HashRouter, Routes, Route } from "react-router-dom"
import { Home } from "./pages/Home"
import { GMView } from "./pages/GMView"

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gm/:sessionId" element={<GMView />} />
      </Routes>
    </HashRouter>
  )
}

export default App
