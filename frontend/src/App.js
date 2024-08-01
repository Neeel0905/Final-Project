import './App.css';
import Navbar from './components/Navbar/Navbar';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import ShopCategory from './pages/ShopCategory';
import Cart from './pages/Cart';
import Login from './pages/Login';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Navbar/>
      <Routes>
          <Route path= '/' element={<shop/>}/>
          <Route path= '/mens' element={<ShopCategory category='mens'/>}/>
          <Route path= '/womens' element={<ShopCategory  category='womes'/>}/>
          <Route path= '/kids' element={<ShopCategory  category='kids'/>}/>
          <Route path= "/product" element ={<Product/>}>
          <Route path=':ProductID' element ={<Product/>}/>
          </Route>

          <Route path= '/cart' element={<Cart/>}/>
          <Route path= '/login' element={<Login/>}/>

      </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
