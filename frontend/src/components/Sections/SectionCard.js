import React, { useState, useEffect } from 'react';
import { Card, Button, Checkbox, Input, Select, Space, message, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import '../../custom.css'
import axios from 'axios';
import RichTextEditor from '../RichTextEditor';
import ChecksheetItemForm from 'components/Forms/ChecksheetItemForm';

// 체크리스트 항목 컴포넌트
const ChecklistItem = ({ item, onChange, onDelete }) => (
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
    <span style={{ marginRight: 8 }}>{item.title}</span>
    {item.type === 'input' && (
      <Input
        placeholder="텍스트 입력"
        value={item.value}
        onChange={e => onChange('value', e.target.value)}
        style={{ flex: 1, marginRight: 8 }}
      />
    )}
    {item.type === 'textarea' && (
      <Input.TextArea
        placeholder="내용 입력"
        value={item.value}
        onChange={e => onChange('value', e.target.value)}
        style={{ flex: 1, marginRight: 8 }}
      />
    )}
    {item.type === 'select' && (
      <Select
        placeholder="선택"
        value={item.value}
        onChange={val => onChange('value', val)}
        options={item.options && item.options.map((elm) => ({value : elm}))}
        style={{ width: 120, marginRight: 8 }}
      />
    )}
    <Button type="text" danger icon={<DeleteOutlined />} onClick={onDelete} />
  </div>
);

const SectionCard = ({ initialData, onDelete }) => {
  const [sectionInfo, setSectionInfo] = useState(initialData || { title: '', text: '' });
  const [checklists, setChecklists] = useState(initialData?.checklists || []);
  const [selectedChecklist, setSelectedChecklist] = useState(null);  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddItem = (item, checklistId) => {
    addItem(checklistId, item);
    setIsModalOpen(false);
  };

  // -------------------------------
  // 섹션 수정 API
  // -------------------------------
  const updateSectionInfoAPI = async (key, value) => {
    try {
      setSectionInfo(prev => ({ ...prev, [key]: value }));
      await axios.put(`http://localhost:5000/api/section/${sectionInfo.id}`, {
        ...sectionInfo,
        [key]: value
      });
      message.success('섹션 저장 완료');
    } catch (err) {
      console.error(err);
      message.error('섹션 저장 실패');
    }
  };

  // -------------------------------
  // 체크리스트 추가/삭제/수정
  // -------------------------------
  const addChecklist = async () => {
    try {
      const res = await axios.post(`http://localhost:5000/api/section/${sectionInfo.id}/checklists`, {
        title: '새 체크리스트',
        text: '',
        sort_order: checklists.length,
      });
      setChecklists(prev => [...prev, {...res.data, items : []}]);
    } catch (err) {
      console.error(err);
      message.error('체크리스트 추가 실패');
    }
  };

  const updateChecklistAPI = async (checklistId, key, value) => {
    try {
      setChecklists(prev => prev.map(c => (c.id === checklistId ? { ...c, [key]: value } : c)));
      await axios.put(`http://localhost:5000/api/checklist/${checklistId}`, { [key]: value });
      // setChecklists(prev => prev.map(c => (c.id === checklistId ? { ...c, [key]: value } : c)));
      message.success('체크리스트 저장 완료');
    } catch (err) {
      console.error(err);
      message.error('체크리스트 저장 실패');
    }
  };

  const deleteChecklistAPI = async (checklistId) => {
    try {
      await axios.delete(`http://localhost:5000/api/checklist/${checklistId}`);
      setChecklists(prev => prev.filter(c => c.id !== checklistId));
      message.success('체크리스트 삭제 완료');
    } catch (err) {
      console.error(err);
      message.error('체크리스트 삭제 실패');
    }
  };

  // -------------------------------
  // 항목 추가/삭제/수정
  // -------------------------------
    const addItem = async (checklistId, data) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/checklist/${checklistId}/items`, {
        title: data.title,
        type: data.type,
        value: null,
        options: data.options,
        sort_order: checklists.find(c => c.id === checklistId).items.length
      });
      setChecklists(prev =>
        prev.map(c =>
          c.id === checklistId ? { ...c, items: [...c.items, res.data] } : c
        )
      );
    } catch (err) {
      console.error(err);
      message.error('항목 추가 실패');
    }
  };

  const updateItemAPI = async (checklistId, itemId, key, value) => {
    try {
        setChecklists(prev =>
        prev.map(c =>
          c.id === checklistId
            ? { ...c, items: c.items.map(i => (i.id === itemId ? { ...i, [key]: value } : i)) }
            : c
        )
      );
      await axios.put(`http://localhost:5000/api/item/${itemId}`, { title: "새 항목", [key]: value });
      // setChecklists(prev =>
      //   prev.map(c =>
      //     c.id === checklistId
      //       ? { ...c, items: c.items.map(i => (i.id === itemId ? { ...i, [key]: value } : i)) }
      //       : c
      //   )
      // );
      message.success('항목 저장 완료');
    } catch (err) {
      console.error(err);
      message.error('항목 저장 실패');
    }
  };

  const deleteItemAPI = async (checklistId, itemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/item/${itemId}`);
      setChecklists(prev =>
        prev.map(c =>
          c.id === checklistId
            ? { ...c, items: c.items.filter(i => i.id !== itemId) }
            : c
        )
      );
      message.success('항목 삭제 완료');
    } catch (err) {
      console.error(err);
      message.error('항목 삭제 실패');
    }
  };

  return (
    <Card
      title={
        <Space>
          <Checkbox className='big-checkbox' checked/>
          <Input
            placeholder="섹션 제목 입력"
            variant="filled"
            size='large'
            style={{
              width: 400,
            }}
            value={sectionInfo.title}
            onChange={e => updateSectionInfoAPI('title', e.target.value)}
          />
        </Space>
      }
      extra={<Button danger onClick={onDelete}>삭제</Button>}
      style={{ marginBottom: 16 }}
    >
      <div style={{ marginBottom: 12 }}>
        <RichTextEditor
          value={sectionInfo.text}
          onChange={val => updateSectionInfoAPI('text', val)}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        {checklists.map(cl => (
          <Card
            key={cl.id}
            type="inner"
            title={
              <Space>
                <Checkbox checked/>
                <Input
                  placeholder="체크리스트 제목"
                  variant="filled"
                  style={{
                    width: 385,
                  }}
                  value={cl.title}
                  onChange={e => updateChecklistAPI(cl.id, 'title', e.target.value)}
                />
              </Space>
            }
            extra={
              <Space>
                <Button size="small" style={{padding : "15px 8px"}} onClick={() => { setIsModalOpen(true); setSelectedChecklist(cl.id); }}>항목 추가</Button>
                <Button danger size="small" style={{padding : "15px 8px"}} onClick={() => deleteChecklistAPI(cl.id)}>삭제</Button>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <div style={{ padding : "0 23px"}}>
            {cl.items.map(item => (
              <ChecklistItem
                key={item.id}
                item={item}
                onChange={(key, val) => updateItemAPI(cl.id, item.id, key, val)}
                onDelete={() => deleteItemAPI(cl.id, item.id)}
              />
            ))}
            </div>
          </Card>
        ))}
      </div>

      <Button type="dashed" onClick={addChecklist} block icon={<PlusOutlined />}>
        체크리스트 추가
      </Button>

      <Modal
        title="항목 추가"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null} // 모달 하단 버튼 제거, AddItemForm의 버튼 사용
        width={600}
      >
        <ChecksheetItemForm onSubmit={handleAddItem} selectedChecklistKey={selectedChecklist} />
      </Modal>

    </Card>
  );
};

export default SectionCard;
