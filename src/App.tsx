import Body from './components/Body/Body';
import Header from './components/Header/Header';
import Navbar from './components/Navbar/Navbar';

function App() {
  return (
    <>
        <Navbar/>
        <main className="px-2 w-screen md:w-9/12 mx-auto mt-8">
            <Header/>
            <Body/>
        </main>
    </>
    
  );
}

export default App;
