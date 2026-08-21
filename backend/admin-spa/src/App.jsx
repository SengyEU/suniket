import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, ProtectedRoute } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TimelinePage from "./pages/TimelinePage";
import ConcertsPage from "./pages/ConcertsPage";
import AlbumsPage from "./pages/AlbumsPage";
import NewsPage from "./pages/NewsPage";
import PhotosPage from "./pages/PhotosPage";
import MembersPage from "./pages/MembersPage";
import VideosPage from "./pages/VideosPage";
import ContactPage from "./pages/ContactPage";
import Layout from "./components/Layout";

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/timeline" element={<TimelinePage />} />
                <Route path="/concerts" element={<ConcertsPage />} />
                <Route path="/albums" element={<AlbumsPage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/photos" element={<PhotosPage />} />
                <Route path="/members" element={<MembersPage />} />
                <Route path="/videos" element={<VideosPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </HashRouter>
  );
}
