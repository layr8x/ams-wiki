import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import HomePage from './pages/HomePage';
import GuidePage from './pages/GuidePage';
import FaqPage from './pages/FaqPage';
import UpdatesPage from './pages/UpdatesPage';
import EditorPage from './pages/EditorPage';
import SearchOverlay from './components/search/SearchOverlay';
import { SearchProvider } from './store/searchStore';

export default function App() {
  return (
    <SearchProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/editor" element={<EditorPage />} />
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/guides/:id" element={<GuidePage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/updates" element={<UpdatesPage />} />
            <Route path="/modules/:moduleId" element={<HomePage />} />
            <Route path="*" element={<HomePage />} />
          </Route>
        </Routes>
        <SearchOverlay />
      </BrowserRouter>
    </SearchProvider>
  );
}