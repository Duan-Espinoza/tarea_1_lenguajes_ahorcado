import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Game from './components/Game';
import History from './components/History';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/historial" element={<History />} />
      </Routes>
    </Router>
  );
}

export default App;