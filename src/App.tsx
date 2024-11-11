import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AddUser from './pages/AddUser';
import ManageUser from './pages/ManageUser';
import EditUser from './pages/EditUser';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/manage-user" element={<ManageUser />} />
          <Route path="/edit-user/:userId" element={<EditUser />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
