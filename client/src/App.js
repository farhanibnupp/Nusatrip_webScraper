import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";

import Awal from "./components/awal";
import Dashboard from "./components/dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Awal />} />
        <Route path="/Dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
