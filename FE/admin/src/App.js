import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ListCategories from './components/Category';
import SideBar from './components/Sidebar';
import NewCategory from './components/Add/Category';
import EditCategory from './components/Edit/Category';
import DeleteCategory from './components/Delete/Category';

function App() {
  return (
    <div>
      <Header/>
      
      <BrowserRouter>
        <SideBar>
          <Routes>
            {/* <Route index element={<Home/>} />
            <Route path='/home' element={<Home/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/register' element={<Register/>} />
            <Route path='/courts/sport/:name' element={<ListCourts/>}/>
            <Route path='/courts/sport/:sportname/:courtId' element={<Court/>}></Route>
            <Route path='/cart' element={<Cart/>}></Route> */}
            {/* <Route index element={<Home/>} />
            <Route path='/' element={<Home/>} /> */}
            {/* <Route path='/login' element={<Login/>} /> */}
            <Route path='/Category' element={<ListCategories />} />
            <Route path='/Add/Category' element={<NewCategory />} />
            <Route path='/Delete/Category/:Id' element={<DeleteCategory />} />
            {/* <Route path='/Court' element={<ListCourts />} />
            <Route path='/Add/Court' element={<NewCourt />} />
            <Route path='/Delete/Court/:Id' element={<DeleteCourt />} />
            <Route path='/Order' element={<ListOrders />} />
            <Route path='/Add/Order' element={<NewOrder />} />
            <Route path='/Delete/Order/:Id' element={<DeleteOrder />} /> */}
          </Routes>
        </SideBar>
      </BrowserRouter>
      <Footer/>
    </div>
  );
}

export default App;
