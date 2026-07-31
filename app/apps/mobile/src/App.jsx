import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
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

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <ScrollToTop />
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
      </Router>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
