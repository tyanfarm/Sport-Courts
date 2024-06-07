import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <div>
      <Header />
      <Home/>
      <Login/>
      <Register/>
      <Footer/>
    </div>
  );
}

export default App;
