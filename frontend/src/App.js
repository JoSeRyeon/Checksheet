import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ChecksheetListPage from './components/ChecksheetListPage';
import ChecksheetEditPage from './components/ChecksheetEditPage';
import TaskListPage from './components/TaskListPage';
import TaskExecutePage from './components/TaskExecutePage';
import Main from './components/Main';
import Layout from './components/Layout';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#6f4af6',
          colorPrimaryHover: '#5a38d0',
          colorPrimaryActive: '#4c2dbd',
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          {/* ✅ 메인 화면: 헤더 없이 단독 렌더링 */}
          <Route path="/" element={<Main />} />

          {/* ✅ 헤더 포함 공통 레이아웃 */}
          <Route element={<Layout />}>
            <Route path="tasks" element={<TaskListPage />} />
            <Route path="checksheet/list" element={<ChecksheetListPage />} />
          </Route>

          {/* ✅ 레이아웃 없이 단독으로 보여줄 페이지들 */}
          <Route path="/edit" element={<ChecksheetEditPage />} />
          <Route path="/tasks/run" element={<TaskExecutePage />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
