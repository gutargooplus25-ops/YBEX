// src/components/layout/Layout.jsx
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '64px' }}>
        {children}
      </main>
    </>
  );
}