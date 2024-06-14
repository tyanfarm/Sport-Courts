import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ListCourts from './components/ListCourts';
import Court from './components/Court';
import Cart from './components/Cart';
import { CartProvider } from './contexts/cartContext';
import Profile from './components/Profile';

function App() {
  return (
    <div>
      <CartProvider>
        <Header/>
        <BrowserRouter>
          <Routes>
            <Route index element={<Home/>} />
            <Route path='/home' element={<Home/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/register' element={<Register/>} />
            <Route path='/courts/sport/:name' element={<ListCourts/>}/>
            <Route path='/courts/sport/:sportname/:courtId' element={<Court/>}></Route>
            <Route path='/cart' element={<Cart/>}></Route>
            <Route path='/profile' element={<Profile/>}></Route>
          </Routes>
        </BrowserRouter>
        <Footer/>
      </CartProvider>
    </div>
  );
}

export default App;
