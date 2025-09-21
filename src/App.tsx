import { ConfigProvider, theme as antdTheme } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import Home from '@/pages/Home';
import ArticlePage from '@/pages/Article';
import TablePage from '@/pages/Table';
import './assets/styles/global.css';
import './assets/styles/fonts.css';
import './assets/styles/theme.css';

const qc = new QueryClient();

export default function App() {
  return (
    <ConfigProvider theme={{ algorithm: antdTheme.defaultAlgorithm }}>
      <QueryClientProvider client={qc}>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/article" element={<ArticlePage />} />
              <Route path="/table" element={<TablePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ConfigProvider>
  );
}
