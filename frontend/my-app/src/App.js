import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Search from './pages/search';
import Report from './pages/report';
import EditUser from './pages/edit';

function App() {
  return (
    <div className="App">
      
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/search' element={<Search />}/>
          <Route path='/report' element={<Report />}/>
          <Route path='/edit/:id' element={<EditUser />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
