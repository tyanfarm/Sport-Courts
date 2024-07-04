import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ListCategories from './components/Category';
import SideBar from './components/Sidebar';
import NewCategory from './components/Add/Category';
import EditCategory from './components/Edit/Category';

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
            <Route path='/Category' element={<ListCategories />} />
            <Route path='/Add/Category' element={<NewCategory />} />
            <Route path='/Edit/Category/:Id' element={<EditCategory />} />
          </Routes>
        </SideBar>
      </BrowserRouter>
      <Footer/>
    </div>
  );
}

export default App;
