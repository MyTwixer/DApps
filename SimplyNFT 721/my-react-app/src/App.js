import {useState} from 'react';
import './App.css';
import NavBar from "./Navbar";
import MainMint from './MainMint';


function App() {
  const [accounts, setAccounts] = useState([]);

  return (
    <div className='overlay'>
      <div className="App">
          <NavBar accounts = {accounts} setAccounts = {setAccounts}/>
          <MainMint accounts = {accounts} setAccounts = {setAccounts}/>
      </div>
      <div className='moving-backgraund'></div>
    </div>
  );
}

export default App;
