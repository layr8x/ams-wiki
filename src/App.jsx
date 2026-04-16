import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Layout from './components/common/Layout';
import HomePage from './pages/HomePage';
import GuideListPage from './pages/GuideListPage';
import GuidePage from './pages/GuidePage';
import FaqPage from './pages/FaqPage';
import UpdatesPage from './pages/UpdatesPage';
import EditorPage from './pages/EditorPage';
import FeedbackPage from './pages/FeedbackPage';
import ErrorPage from './pages/ErrorPage';
import SearchOverlay from './components/search/SearchOverlay';
import { SearchProvider } from './store/searchStore';
import { I18nProvider } from './store/i18nStore';
import { AuthProvider } from './store/authStore';

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <SearchProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/editor" element={<EditorPage />} />
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/guides" element={<GuideListPage />} />
              <Route path="/guides/:id" element={<GuidePage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/updates" element={<UpdatesPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/modules/:moduleId" element={<GuideListPage />} />
              <Route path="/404" element={<ErrorPage statusCode={404} message="찾을 수 없는 페이지입니다. 홈으로 돌아가주세요." />} />
              <Route path="*" element={<ErrorPage statusCode={404} message="찾을 수 없는 페이지입니다. 홈으로 돌아가주세요." />} />
            </Route>
          </Routes>
          <SearchOverlay />
        </BrowserRouter>
        <SpeedInsights />
      </SearchProvider>
    </AuthProvider>
  </I18nProvider>
  );
}