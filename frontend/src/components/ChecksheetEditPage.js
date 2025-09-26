import React, { useState, useEffect } from 'react';
import SectionCard from './Sections/SectionCard';
import { Layout, Button, Space, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import api from '../api/axios';
import '../custom.css';
import { useLocation, useNavigate } from 'react-router-dom';
const { Header, Content } = Layout;

const CheckcheetEditPage = () => {
  const location = useLocation();
   const navigate = useNavigate();
  const { selectedChecksheetId } = location.state || {};

  const [sectionCards, setSectionCards] = useState([]);
  const [checksheetName, setChecksheetName] = useState('');

  // -------------------
  // 데이터 불러오기
  // -------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/checksheet/${selectedChecksheetId}`);
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
  // async function updateChecksheet(id, value, data) {
  //   setChecksheetName(value);
  //   await api.put(`/checksheet/${id}`, {
  //     category : data.category,
  //     checksheetName : value,
  //     status : data.status,

  //   })
  //     .then(res => {
  //       // success('수정이 완료되었습니다.');
  //     })
  //     .catch((err) => {
  //       message.error('체크시트 수정에 실패하였습니다. 다시 시도해주세요');
  //       console.error(err);
  //     });
  // }

  
  // -------------------
  // 2️⃣ 섹션 추가
  // -------------------
  const addSectionCard = async () => {
    try {
      const res = await api.post(`/checksheet/${selectedChecksheetId}/sections`, {
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
      await api.delete(`/checksheet/section/${id}`);
      setSectionCards(prev => prev.filter(sc => sc.id !== id));
    } catch (err) {
      console.error(err);
      message.error('섹션 삭제 실패');
    }
  };

    const handleGoBack = () => {
    navigate(-1); // 이전 페이지로
  };

  return (
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'fixed', width: '100%', top: 0, zIndex: 1000, background: '#fff', boxShadow: '0 2px 8px #f0f1f2' }}>
          <Button icon={<ArrowLeftOutlined />} onClick={handleGoBack}>뒤로가기</Button>
          <Space  direction="horizontal">
            <span className='checksheet-title'>{checksheetName}</span>
            <Button type='primary' onClick={addSectionCard}>섹션 추가</Button>
          </Space>
          
        </Header>

      <Content style={{ marginTop: 64, padding: '24px' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          {sectionCards.map(sc => (
            <SectionCard
              key={sc.id}
              initialData={sc.data}
              mode="edit"
              onDelete={() => deleteSectionCard(sc.id)}
            />
          ))}
        </Space>
      </Content>
      </Layout>
  );
};

export default CheckcheetEditPage;
