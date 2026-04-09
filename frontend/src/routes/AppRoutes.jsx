import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Offerings from '../pages/Offerings/Offerings';
import Services from '../pages/Services/Services';
import Portfolio from '../pages/Portfolio/Portfolio';
import Academy from '../pages/Academy/Academy';
import Contact from '../pages/Contact/Contact';
import About from '../pages/About/About';
import GetStarted from '../pages/GetStarted/GetStarted';

// Admin
import AdminLogin from '../pages/Admin/AdminLogin';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import AdminEnquiries from '../pages/Admin/AdminEnquiries';
import AdminUsers from '../pages/Admin/AdminUsers';
import AdminSuggestions from '../pages/Admin/AdminSuggestions';
import AdminPlaceholder from '../pages/Admin/AdminPlaceholder';
import AdminRoute from '../components/common/AdminRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/offerings" element={<Offerings />} />
      <Route path="/services" element={<Services />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/academy" element={<Academy />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route path="/get-started" element={<GetStarted />} />

      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<Navigate to="/admin/enquiries" replace />} />
      <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/enquiries" element={<AdminRoute><AdminEnquiries /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
      <Route path="/admin/suggestions" element={<AdminRoute><AdminSuggestions /></AdminRoute>} />
      <Route path="/admin/about-team" element={<AdminRoute><AdminPlaceholder title="About Page Team" icon="🧑‍💼" description="Manage the About page team members." /></AdminRoute>} />
      <Route path="/admin/hiring" element={<AdminRoute><AdminPlaceholder title="Hiring" icon="💼" description="Manage job listings and hiring applications." /></AdminRoute>} />
      <Route path="/admin/influencers" element={<AdminRoute><AdminPlaceholder title="Influencers" icon="🌟" description="Manage influencer profiles and partnerships." /></AdminRoute>} />
      <Route path="/admin/brands" element={<AdminRoute><AdminPlaceholder title="Brands" icon="🏷️" description="Manage brand collaborations and listings." /></AdminRoute>} />
      <Route path="/admin/school-mentors" element={<AdminRoute><AdminPlaceholder title="School Mentors" icon="🎓" description="Manage school mentor profiles and assignments." /></AdminRoute>} />
      <Route path="/admin/success-stories" element={<AdminRoute><AdminPlaceholder title="Success Stories" icon="🏆" description="Manage and publish success stories." /></AdminRoute>} />
      <Route path="/admin/scholarship" element={<AdminRoute><AdminPlaceholder title="Scholarship" icon="🎖️" description="Manage scholarship applications and awards." /></AdminRoute>} />
      <Route path="/admin/activity-logs" element={<AdminRoute><AdminPlaceholder title="Activity Logs" icon="📊" description="View all admin and user activity logs." /></AdminRoute>} />
      <Route path="/admin/invoices" element={<AdminRoute><AdminPlaceholder title="Invoices" icon="🧾" description="Manage and track all invoices." /></AdminRoute>} />
      <Route path="/admin/ybex-story" element={<AdminRoute><AdminPlaceholder title="YBEX Story" icon="📖" description="Manage the YBEX brand story and timeline." /></AdminRoute>} />
      <Route path="/admin/portfolio" element={<AdminRoute><AdminPlaceholder title="Portfolio" icon="🗂️" description="Manage portfolio projects and case studies." /></AdminRoute>} />
      <Route path="/admin/bin" element={<AdminRoute><AdminPlaceholder title="Bin" icon="🗑️" description="Review and restore deleted items." /></AdminRoute>} />
      <Route path="/admin/website-settings" element={<AdminRoute><AdminPlaceholder title="Website Settings" icon="⚙️" description="Configure global website settings and preferences." /></AdminRoute>} />
    </Routes>
  );
};

export default AppRoutes;
