import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigationType,
  useNavigate
} from "react-router-dom";
import { useAppContext } from "./contexts/AppContext";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import UserRegister from "./pages/user/Register";
import AgencyRegister from "./pages/agency/Register";
import UmrahGroupRegister from "./pages/umrah-group/Register";
import PackageSearch from "./pages/PackageSearch";
import PackageDetails from "./pages/PackageDetails";
import BookingFunnel from "./pages/BookingFunnel";
import BookingConfirmation from "./pages/BookingConfirmation";
import AddPackage from "./pages/AddPackage";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import AuthCallback from "./pages/AuthCallback";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
import AgencySearch from "./pages/AgencySearch";
import UmrahGroupSearch from './pages/UmrahGroupSearch';
import AgencyDetails from './pages/AgencyDetails';
import GroupDetails from './pages/GroupDetails';
import PilgrimageGuides from './pages/PilgrimageGuides';
import Resources from './pages/Resources';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/admin/Dashboard';
import UserDashboard from './pages/user/Dashboard';
import { useEffect, useRef } from "react";
import { AuthProvider } from './contexts/AuthContext';

// Add NavigationHandler component
const NavigationHandler = () => {
  const navigationType = useNavigationType();
  const location = useLocation();
  const navigate = useNavigate();
  const hasHandledNavigation = useRef(false);

  useEffect(() => {
    if (navigationType === 'POP' && !hasHandledNavigation.current) {
      hasHandledNavigation.current = true;
      // Instead of reloading, re-navigate to the same route with a refresh flag
      navigate(location.pathname + location.search, {
        replace: true,
        state: { refresh: true }
      });
    }
  }, [navigationType, location, navigate]);

  return null;
};

// Add ScrollToTop component
const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
};

const App = () => {
  const { isLoggedIn } = useAppContext();
  
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-white">
          <ScrollToTop />
          <NavigationHandler />
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user/register" element={<UserRegister />} />
            <Route path="/agency/register" element={<AgencyRegister />} />
            <Route path="/umrah-group/register" element={<UmrahGroupRegister />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/auth-callback" element={<AuthCallback />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Package Routes - Public View */}
            <Route path="/packages" element={<PackageSearch />} />
            <Route path="/packages/hajj" element={<PackageSearch type="hajj" />} />
            <Route path="/packages/umrah" element={<PackageSearch type="umrah" />} />
            <Route path="/packages/:id" element={<PackageDetails />} />
            
            {/* Agency Routes - Public View */}
            <Route path="/agencies" element={<AgencySearch />} />
            <Route path="/agencies/:id" element={<AgencyDetails />} />
            <Route path="/agencies/:id/packages" element={<AgencyDetails defaultTab="packages" />} />
            <Route path="/agencies/:id/groups" element={<AgencyDetails defaultTab="groups" />} />
            
            {/* Group Routes - Public View */}
            <Route path="/groups" element={<UmrahGroupSearch />} />
            <Route path="/groups/:id" element={<GroupDetails />} />
            
            {/* Information Routes - Public */}
            <Route path="/guides" element={<PilgrimageGuides />} />
            <Route path="/resources" element={<Resources />} />
            
            {/* Protected User Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/user/dashboard" element={
              <Navigate to="/dashboard" replace />
            } />
            
            <Route path="/packages/:id/book" element={
              <ProtectedRoute requiredRole="user">
                <BookingFunnel />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute requiredRole="user">
                <Profile />
              </ProtectedRoute>
            } />
            
            {/* Protected Agency Routes */}
            <Route path="/agency/dashboard" element={
              <ProtectedRoute requiredRole="agency">
                <div>Agency Dashboard</div>
              </ProtectedRoute>
            } />
            
            <Route path="/agency/add-package" element={
              <ProtectedRoute requiredRole="agency">
                <AddPackage />
              </ProtectedRoute>
            } />
            
            {/* Protected Umrah Group Routes */}
            <Route path="/umrah-group/dashboard" element={
              <ProtectedRoute requiredRole="umrah_group">
                <div>Umrah Group Dashboard</div>
              </ProtectedRoute>
            } />
            
            <Route path="/umrah-group/create" element={
              <ProtectedRoute requiredRole="umrah_group">
                <div>Create Umrah Group</div>
              </ProtectedRoute>
            } />
            
            <Route path="/umrah-group/manage" element={
              <ProtectedRoute requiredRole="umrah_group">
                <div>Manage Umrah Groups</div>
              </ProtectedRoute>
            } />
            
            <Route path="/umrah-group/members" element={
              <ProtectedRoute requiredRole="umrah_group">
                <div>Group Members</div>
              </ProtectedRoute>
            } />
            
            {/* Protected Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/users" element={
              <ProtectedRoute requiredRole="admin">
                <div>User Management</div>
              </ProtectedRoute>
            } />
            
            <Route path="/admin/packages" element={
              <ProtectedRoute requiredRole="admin">
                <div>Package Management</div>
              </ProtectedRoute>
            } />

            {/* Protected Routes */}
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />

            {/* Catch-all redirect for authenticated users */}
            <Route path="*" element={
              isLoggedIn ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />
            } />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
