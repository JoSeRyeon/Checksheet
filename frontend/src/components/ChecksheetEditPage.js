import React, { useState, useEffect } from 'react';
import SectionCard from './Sections/SectionCard';
import { Layout, Input, Button, Space, message } from 'antd';
import axios from 'axios';
const { Header, Content, Footer } = Layout;

const CheckcheetEditPage = ({ checklistId = 22 }) => {
  const [sectionCards, setSectionCards] = useState([]);
  const [checksheetName, setChecksheetName] = useState('');
  const [category, setCategory] = useState('');

  // -------------------
  // 1️⃣ 데이터 불러오기
  // -------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/checksheet/${checklistId}`);
        setSectionCards(res.data.sections.map(sec => ({
          id: sec.id,
          data: sec
        })));
        setChecksheetName(res.data.checksheet_name);
        setCategory(res.data.category);
      } catch (err) {
        console.error(err);
        message.error('체크시트 불러오기 실패');
      }
    };
    fetchData();
  }, [checklistId]);

  // -------------------
  // 2️⃣ 섹션 추가/삭제
  // -------------------
  const addSectionCard = async () => {
    try {
      const res = await axios.post(`http://localhost:5000/api/checksheet/${checklistId}/sections`, {
        title: '새 섹션',
        text: '',
        sort_order: sectionCards.length
      });
      setSectionCards(prev => [...prev, { id: res.data.id, data: res.data }]);
    } catch (err) {
      console.error(err);
      message.error('섹션 추가 실패');
    }
  };

  const deleteSectionCard = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/section/${id}`);
      setSectionCards(prev => prev.filter(sc => sc.id !== id));
    } catch (err) {
      console.error(err);
      message.error('섹션 삭제 실패');
    }
  };

  // -------------------
  // 3️⃣ SectionCard 내부 변경
  // -------------------
  const updateSectionData = async (id, data) => {
    try {
      // Section 수정 API 호출
      await axios.put(`http://localhost:5000/api/section/${id}`, {
        title: data.title,
        text: data.text,
        sort_order: data.sort_order || 0
      });
      setSectionCards(prev =>
        prev.map(sc => (sc.id === id ? { ...sc, data } : sc))
      );
    } catch (err) {
      console.error(err);
      message.error('섹션 업데이트 실패');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* <Header style={{ display: 'flex', gap: 12, padding: 10 }}> */}
        <Header style={{ display: 'flex', gap: 12, padding: 10, background: '#f5f5f5' }} >
        <Input
          size='large'
          placeholder="체크시트명을 입력하세요"
          value={checksheetName}
          onChange={e => setChecksheetName(e.target.value)}
        />
        <Button type="primary" onClick={addSectionCard}>섹션 추가</Button>
      </Header>

      {/* <Content style={{ margin: '24px 16px', padding: 24 }}> */}
      <Content style={{ margin: '0 24px 16px'}}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          {sectionCards.map(sc => (
            <SectionCard
              key={sc.id}
              initialData={sc.data}
            //   onChange={(data) => updateSectionData(sc.id, data)}
              onDelete={() => deleteSectionCard(sc.id)}
            />
          ))}
        </Space>
      </Content>

      <Footer style={{ textAlign: 'right' }}>
        <Button type="primary" onClick={() => message.info('변경사항은 자동 저장됩니다.')}>
          변경사항 저장
        </Button>
      </Footer>
    </Layout>
  );
};

export default CheckcheetEditPage;
