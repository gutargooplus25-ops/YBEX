import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home/Home';
import Services from './pages/Services/Services';
import Portfolio from './pages/Portfolio/Portfolio';
import Academy from './pages/Academy/Academy';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import GetStarted from './pages/GetStarted/GetStarted';
import Offerings from './pages/Offerings/Offerings';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/academy" element={<Academy />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/offerings" element={<Offerings />} />
      </Routes>
    </Layout>
  );
}
