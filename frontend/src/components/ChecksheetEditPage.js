import React, { useState, useEffect } from 'react';
import SectionCard from './Sections/SectionCard';
import { Layout, Input, Button, Space, message } from 'antd';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
const { Header, Content, Footer } = Layout;

const CheckcheetEditPage = () => {
  const location = useLocation();
  const { selectedChecksheet, selectedChecksheetId } = location.state || {};

  const [sectionCards, setSectionCards] = useState([]);
  const [checksheetName, setChecksheetName] = useState('');
  const [category, setCategory] = useState('');

  // -------------------
  // 데이터 불러오기
  // -------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/checksheet/${selectedChecksheetId}`);
        setSectionCards(res.data.sections.map(sec => ({
          id: sec.id,
          data: sec
        })));
        setChecksheetName(res.data.checksheet_name);
      } catch (err) {
        console.error(err);
        message.error('체크시트 불러오기 실패');
      }
    };
    fetchData();
  }, [selectedChecksheetId]);

  // -------------------
  // 1️⃣ 체크시트 정보 업데이트
  // -------------------
  async function updateChecksheet(id, value, data) {
    setChecksheetName(value);
    await axios.put(`http://localhost:5000/api/checksheets/${id}`, {
      category : data.category,
      checksheetName : value,
      status : data.status,

    })
      .then(res => {
        // success('수정이 완료되었습니다.');
      })
      .catch((err) => {
        message.error('체크시트 수정에 실패하였습니다. 다시 시도해주세요');
        console.error(err);
      });
  }

  
  // -------------------
  // 2️⃣ 섹션 추가/삭제
  // -------------------
  const addSectionCard = async () => {
    try {
      const res = await axios.post(`http://localhost:5000/api/checksheet/${selectedChecksheetId}/sections`, {
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

  // -------------------
  // 3️⃣ 섹션 삭제
  // -------------------
  const deleteSectionCard = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/section/${id}`);
      setSectionCards(prev => prev.filter(sc => sc.id !== id));
    } catch (err) {
      console.error(err);
      message.error('섹션 삭제 실패');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ display: 'flex', gap: 12, padding: 10, background: '#f5f5f5' }} >
        <Input
          size='large'
          placeholder="체크시트명을 입력하세요"
          value={checksheetName}
          updateChecksheet
          onChange={e => updateChecksheet(selectedChecksheetId, e.target.value, selectedChecksheet)}
        />
        <Button type="primary" onClick={addSectionCard}>섹션 추가</Button>
      </Header>

      <Content style={{ margin: '0 24px 16px'}}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          {sectionCards.map(sc => (
            <SectionCard
              key={sc.id}
              initialData={sc.data}
              onDelete={() => deleteSectionCard(sc.id)}
            />
          ))}
        </Space>
      </Content>
    </Layout>
  );
};

export default CheckcheetEditPage;
