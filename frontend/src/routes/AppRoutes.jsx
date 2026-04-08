import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Offerings from '../pages/Offerings/Offerings';
import Services from '../pages/Services/Services';
import Portfolio from '../pages/Portfolio/Portfolio';
import Academy from '../pages/Academy/Academy';
import Contact from '../pages/Contact/Contact';
import About from '../pages/About/About';
import GetStarted from '../pages/GetStarted/GetStarted';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/offerings" element={<Offerings />} />
      <Route path="/services" element={<Services />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/academy" element={<Academy />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route path="/get-started" element={<GetStarted />} />
    </Routes>
  );
};

export default AppRoutes;
