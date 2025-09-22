import React, { useState, useEffect } from 'react';
import SectionCard from './Sections/SectionCard'; // 동일한 섹션 표시 컴포넌트 활용
import { Layout, Button, Space, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import api from '../api/axios';
import { useLocation, useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;

const TaskExecutePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedTasks } = location.state || {}; // TaskListPage에서 navigate할 때 {state:{selectedTasks: …}}

  const [sectionCards, setSectionCards] = useState([]); // 체크시트 섹션 구조
  const [checksheetName, setChecksheetName] = useState('');

  const [messageApi, contextHolder] = message.useMessage();
  const success = (msg) => messageApi.open({ type: 'success', content: msg });
  const error = (msg) => messageApi.open({ type: 'error', content: msg });

  // -------------------
  // 데이터 불러오기 (선택된 작업의 체크시트 포맷)
  // -------------------
  useEffect(() => {
    if (!selectedTasks || selectedTasks.length === 0) {
      error('선택된 작업이 없습니다.');
      navigate('/tasks');
      return;
    }

    // 예: 여러 작업 중 첫번째 작업의 checksheetId로 기본 포맷 가져오기
    const firstChecksheetId = selectedTasks[0].checksheetId;
    fetchChecksheet(firstChecksheetId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchChecksheet = async (checksheetId) => {
    try {
      const res = await api.get(`/checksheet/${checksheetId}`);
      setSectionCards(res.data.sections.map(sec => ({
        id: sec.id,
        data: sec
      })));
      setChecksheetName(res.data.checksheet_name);
    } catch (err) {
      console.error(err);
      error('체크시트 불러오기 실패');
    }
  };

  // -------------------
  // 사용자 입력값 바꿀 때 섹션/체크리스트/아이템 내부 value를 업데이트
  // -------------------
  const handleItemChange = (sectionId, checklistId, itemId, value) => {
    setSectionCards(prev =>
      prev.map(sc => {
        if (sc.id !== sectionId) return sc;
        const newSection = { ...sc.data };
        newSection.checklists = newSection.checklists.map(cl => {
          if (cl.id !== checklistId) return cl;
          return {
            ...cl,
            items: cl.items.map(it => (it.id === itemId ? { ...it, value } : it))
          };
        });
        return { ...sc, data: newSection };
      })
    );
  };

  // -------------------
  // 작업 실시 데이터 저장
  // -------------------
  const handleSave = async () => {
    try {
      await api.post('/tasks/execute', {
        tasks: selectedTasks.map(task => ({
          taskId: task.id,
          sections: sectionCards.map(sc => sc.data)
        }))
      });
      success('작업이 저장되었습니다.');
      navigate('/tasks');
    } catch (err) {
      console.error(err);
      error('작업 저장에 실패했습니다.');
    }
  };

  const handleGoBack = () => navigate(-1);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {contextHolder}
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'fixed',
          width: '100%',
          top: 0,
          zIndex: 1000,
          background: '#fff',
          boxShadow: '0 2px 8px #f0f1f2'
        }}
      >
        <Button icon={<ArrowLeftOutlined />} onClick={handleGoBack}>뒤로가기</Button>
        <div style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 10px' }}>{checksheetName}</div>
        <Button type="primary" onClick={handleSave}>작업 저장</Button>
      </Header>

      <Content style={{ marginTop: 64, padding: '24px' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          {sectionCards.map(sc => (
            <SectionCard
              key={sc.id}
              initialData={sc.data}
              taskId={selectedTasks[0].id}
              mode="execute"
              // 편집 모드에서는 섹션 추가/삭제가 있지만
              // 여기서는 단순히 내부 아이템 값만 바꿀 수 있도록 props 추가
              onItemChange={handleItemChange}
            />
          ))}
        </Space>
      </Content>
    </Layout>
  );
};

export default TaskExecutePage;
