import { HashRouter, Routes, Route } from "react-router-dom"
import { Home } from "./pages/Home"
import { GMView } from "./pages/GMView"
import PLView from "./pages/PLView"

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gm/:sessionId" element={<GMView />} />
        <Route path="/play/:sessionId" element={<PLView />} />
      </Routes>
    </HashRouter>
  )
}

export default App
