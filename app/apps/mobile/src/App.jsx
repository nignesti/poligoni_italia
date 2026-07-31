import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import MobileLayout from '@/components/MobileLayout';
import SearchPage from '@/pages/SearchPage';
import RangeDetailPage from '@/pages/RangeDetailPage';
import BookingPage from '@/pages/BookingPage';
import BookingsPage from '@/pages/BookingsPage';
import DiaryPage from '@/pages/DiaryPage';
import AmmoPage from '@/pages/AmmoPage';
import AddFirearmPage from '@/pages/AddFirearmPage';
import ProfilePage from '@/pages/ProfilePage';
import RequestAvailabilityPage from '@/pages/RequestAvailabilityPage';
// Add page imports here

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route element={<MobileLayout />}>
        <Route path="/" element={<SearchPage />} />
        <Route path="/prenotazioni" element={<BookingsPage />} />
        <Route path="/diario" element={<DiaryPage />} />
        <Route path="/munizioni" element={<AmmoPage />} />
        <Route path="/profilo" element={<ProfilePage />} />
      </Route>
      <Route path="/poligono/:id" element={<RangeDetailPage />} />
      <Route path="/prenota/:id" element={<BookingPage />} />
      <Route path="/richiedi/:id" element={<RequestAvailabilityPage />} />
      <Route path="/armi/aggiungi" element={<AddFirearmPage />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App