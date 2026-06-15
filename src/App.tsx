import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import AppShell from './components/layout/AppShell';
import Dashboard from './components/dashboard/Dashboard';
import Analytics from './components/dashboard/Analytics';
import VocabList from './components/vocabulary/VocabList';
import ReviewSession from './components/review/ReviewSession';
import Reader from './components/reader/Reader';
import AIPractice from './components/ai/AIPractice';
import Settings from './components/settings/Settings';
import { useSettingsStore } from './stores/settingsStore';
import './App.css';

function App() {
  const darkMode = useSettingsStore((state) => state.darkMode);

  useEffect(() => {
    useSettingsStore.getState().loadSettings();
  }, []);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <BrowserRouter basename="/viet-learn/">
        <AppShell>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/vocabulary" element={<VocabList />} />
            <Route path="/review" element={<ReviewSession />} />
            <Route path="/reader" element={<Reader />} />
            <Route path="/practice" element={<AIPractice />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </div>
  );
}

export default App;
