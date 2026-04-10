// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/home/Home';

const Services = () => <div className="min-h-screen flex items-center justify-center text-2xl">Services Page</div>;
const GetStarted = () => <div className="min-h-screen flex items-center justify-center text-2xl">Get Started Page</div>;

export default function App() {
  return (
    <Routes>
      <Route path="/" element={
        <Layout>
          <Home />
        </Layout>
      } />
      <Route path="/services" element={
        <Layout>
          <Services />
        </Layout>
      } />
      <Route path="/get-started" element={
        <Layout>
          <GetStarted />
        </Layout>
      } />
    </Routes>
  );
}