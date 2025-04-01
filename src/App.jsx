import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppRoutes from './AppRoutes';

function App() {
  return (
    <div className="min-h-screen bg-[#111124] text-[#eaeaea] overflow-x-hidden">
      <BrowserRouter>
        <Navbar />
        <AppRoutes />
      </BrowserRouter>
    </div>
  );
}

export default App;