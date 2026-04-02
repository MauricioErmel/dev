import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ComparisonTool from './pages/ComparisonTool';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-base-100">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/compare" element={<ComparisonTool />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
