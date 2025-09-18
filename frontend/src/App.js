import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Chat from './components/Chat';
import Checksheet from './components/Checksheet';
import ChecksheetListPage from './components/ChecksheetListPage';
import ChecksheetEditPage from './components/ChecksheetEditPage';
// import SettingsPage from './components/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Checksheet />}>
          {/* Checklist 레이아웃 안에서 보여줄 페이지들 */}
          <Route index element={<ChecksheetListPage />} />
          <Route path="edit" element={<ChecksheetEditPage />} />
          {/* <Route path="settings" element={<SettingsPage />} /> */}
        </Route>

        {/* <Route>
          <Chat userId={1} />
        </Route> */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;
