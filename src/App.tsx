import { useEffect } from 'react';
import Body from './components/Body/Body';
import Header from './components/Header/Header';
import Navbar from './components/Navbar/Navbar';
import firstLoad from './config/first_load';



function App() {
    
useEffect(firstLoad, [firstLoad])

  return (
    <>
        <Navbar/>
        <main className="px-2 w-screen md:w-9/12 mx-auto my-8">
            <Header/>
            <Body/>
         
        </main>
    </>
    
  );
}

export default App;
