import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login/login';
import ExpenseManager from './components/ExpenseManager/ExpenseManager';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Expenser" element={<ExpenseManager />} />
      </Routes>
    </Router>
  );
}

export default App;
