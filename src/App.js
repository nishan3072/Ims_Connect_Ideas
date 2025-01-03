import './App.css';
import Main from './components/main';
import Login from './components/login';
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from './components/signup';
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Import BrowserRouter
import Voting from './components/voting';
import Rewards from './components/rewards';

function App() {
  return (
    <BrowserRouter> {/* Wrap your Routes with BrowserRouter */}
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/main" element={<Main />} />
          <Route path="/voting" element={<Voting />} />
          <Route path="/rewards" element={<Rewards />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
