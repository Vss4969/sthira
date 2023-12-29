import './App.css';
import Index from './pages/index';
import Teams from './pages/teams';
import {Routes, Route} from "react-router-dom";

function App() {

  return(
    <>
      <Routes>
        <Route path='/' element={<Index/>}/>
        <Route path='/teams' element={<Teams/>}/>
      </Routes>
    </>
  );
  
}

export default App;