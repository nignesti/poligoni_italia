import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import ScrollToTop from './components/ScrollToTop';
import MobileLayout from '@/components/MobileLayout';
import AuthGate from '@/components/AuthGate';
import SearchPage from '@/pages/SearchPage';
import RangeDetailPage from '@/pages/RangeDetailPage';
import BookingPage from '@/pages/BookingPage';
import BookingsPage from '@/pages/BookingsPage';
import DiaryPage from '@/pages/DiaryPage';
import AmmoPage from '@/pages/AmmoPage';
import AddFirearmPage from '@/pages/AddFirearmPage';
import CronografoPage from '@/pages/CronografoPage';
import MedagliePage from '@/pages/MedagliePage';
import ProfilePage from '@/pages/ProfilePage';
import RequestAvailabilityPage from '@/pages/RequestAvailabilityPage';
import LoginPage from '@/pages/LoginPage';
import AuthCallbackPage from '@/pages/AuthCallbackPage';
// Add page imports here

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Pubbliche: nessun account richiesto */}
          <Route path="/accedi" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/poligono/:id" element={<RangeDetailPage />} />
          <Route path="/richiedi/:id" element={<RequestAvailabilityPage />} />
          <Route path="/prenota/:id" element={<BookingPage />} />

          <Route element={<MobileLayout />}>
            <Route path="/" element={<SearchPage />} />
            {/* Account richiesto: dati personali del tiratore */}
            <Route element={<AuthGate />}>
              <Route path="/prenotazioni" element={<BookingsPage />} />
              <Route path="/diario" element={<DiaryPage />} />
              <Route path="/munizioni" element={<AmmoPage />} />
              <Route path="/profilo" element={<ProfilePage />} />
            </Route>
          </Route>
          <Route element={<AuthGate />}>
            <Route path="/armi/aggiungi" element={<AddFirearmPage />} />
            <Route path="/cronografo" element={<CronografoPage />} />
            <Route path="/medaglie" element={<MedagliePage />} />
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
