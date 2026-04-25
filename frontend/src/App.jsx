import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AdminRoute from './components/common/AdminRoute';

// Public pages
import Home from './pages/Home/Home';
import Services from './pages/Services/Services';
import Portfolio from './pages/Portfolio/Portfolio';
import Academy from './pages/Academy/Academy';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import GetStarted from './pages/GetStarted/GetStarted';
import Offerings from './pages/Offerings/Offerings';
import Invoice from './pages/Invoice/Invoice';

// Admin pages
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminEnquiries from './pages/Admin/AdminEnquiries';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminAboutTeam from './pages/Admin/AdminAboutTeam';
import AdminInfluencers from './pages/Admin/AdminInfluencers';
import AdminBrands from './pages/Admin/AdminBrands';
import AdminPlaceholder from './pages/Admin/AdminPlaceholder';
import AdminInvoices from './pages/Admin/AdminInvoices';
import SubAdminDashboard from './pages/Admin/SubAdminDashboard';

// Wraps public pages with Navbar + Footer
function PublicLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default function App() {
  return (
    <Routes>
      {/* ── Public routes (with Navbar + Footer) ── */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/academy" element={<Academy />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/offerings" element={<Offerings />} />
        <Route path="/invoice" element={<Invoice />} />
      </Route>

      {/* ── Admin routes (NO Navbar/Footer) ── */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<Navigate to="/admin/enquiries" replace />} />
      <Route path="/sub-admin/dashboard" element={<AdminRoute><SubAdminDashboard /></AdminRoute>} />
      <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/enquiries" element={<AdminRoute><AdminEnquiries /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
      <Route path="/admin/about-team" element={<AdminRoute><AdminAboutTeam /></AdminRoute>} />
      <Route path="/admin/hiring" element={<AdminRoute><AdminPlaceholder title="Hiring" icon="💼" description="Manage job listings and hiring applications." /></AdminRoute>} />
      <Route path="/admin/influencers" element={<AdminRoute><AdminInfluencers /></AdminRoute>} />
      <Route path="/admin/brands" element={<AdminRoute><AdminBrands /></AdminRoute>} />
      <Route path="/admin/school-mentors" element={<AdminRoute><AdminPlaceholder title="School Mentors" icon="🎓" description="Manage school mentor profiles and assignments." /></AdminRoute>} />
      <Route path="/admin/success-stories" element={<AdminRoute><AdminPlaceholder title="Success Stories" icon="🏆" description="Manage and publish success stories." /></AdminRoute>} />
      <Route path="/admin/scholarship" element={<AdminRoute><AdminPlaceholder title="Scholarship" icon="🎖️" description="Manage scholarship applications and awards." /></AdminRoute>} />
      <Route path="/admin/activity-logs" element={<AdminRoute><AdminPlaceholder title="Activity Logs" icon="📊" description="View all admin and user activity logs." /></AdminRoute>} />
      <Route path="/admin/invoices" element={<AdminRoute><AdminInvoices /></AdminRoute>} />
      <Route path="/admin/ybex-story" element={<AdminRoute><AdminPlaceholder title="YBEX Story" icon="📖" description="Manage the YBEX brand story and timeline." /></AdminRoute>} />
      <Route path="/admin/portfolio" element={<AdminRoute><AdminPlaceholder title="Portfolio" icon="🗂️" description="Manage portfolio projects and case studies." /></AdminRoute>} />
      <Route path="/admin/bin" element={<AdminRoute><AdminPlaceholder title="Bin" icon="🗑️" description="Review and restore deleted items." /></AdminRoute>} />
      <Route path="/admin/website-settings" element={<AdminRoute><AdminPlaceholder title="Website Settings" icon="⚙️" description="Configure global website settings and preferences." /></AdminRoute>} />
    </Routes>
  );
}
