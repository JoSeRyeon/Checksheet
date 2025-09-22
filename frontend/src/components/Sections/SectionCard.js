import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Checkbox, Input, Select, Space, message, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import '../../custom.css';
import api from '../../api/axios';
import RichTextEditor from '../RichTextEditor';
import ChecksheetItemForm from '../Forms/ChecksheetItemForm';

/* -------------------------------
 * ChecklistItem
 * -----------------------------*/
const ChecklistItem = ({ item, sectionId, checklistId, taskId, mode, onChange, onDelete }) => {
  const saveTaskItem = async (value) => {
    await api.post('/task/item', {
      taskId,
      sectionId,
      checklistId,
      itemId: item.id,
      value,
    });
  };

  const handleChange = async (val) => {
    onChange('value', val);
    if (mode === 'execute') {
      try {
        console.log(sectionId, checklistId)
        await saveTaskItem(val);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const renderInput = () => {
    const commonProps = {
      value: item.value || '',
      onChange: (e) => handleChange(e.target.value),
      style: { flex: 1, marginRight: 8 },
    };

    switch (item.type) {
      case 'input':
        return <Input placeholder="텍스트 입력" {...commonProps} />;
      case 'textarea':
        return <Input.TextArea placeholder="내용 입력" {...commonProps} />;
      case 'select':
        return (
          <Select
            placeholder="선택"
            value={item.value || null}
            onChange={handleChange}
            options={item.options?.map((opt) => ({ value: opt }))}
            style={{ width: 120, marginRight: 8 }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
      <span style={{ marginRight: 8 }}>{item.title}</span>
      {renderInput()}
      {mode === 'edit' && (
        <Button type="text" danger icon={<DeleteOutlined />} onClick={onDelete} />
      )}
    </div>
  );
};

/* -------------------------------
 * SectionCard
 * -----------------------------*/
const SectionCard = ({ initialData, taskId, mode = 'edit', onDelete }) => {
  const [sectionInfo, setSectionInfo] = useState(initialData || { title: '', text: '' });
  const [checklists, setChecklists] = useState(initialData?.checklists || []);
  const [taskSectionCheck, setTaskSectionCheck] = useState({ checked: false, checkedAt: null });
  const [taskChecklistCheck, setTaskChecklistCheck] = useState([]);
  const [selectedChecklist, setSelectedChecklist] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* ---------- helpers ---------- */
  const nowISO = (checked) =>
    checked ? new Date().toLocaleString('sv', { timeZone: 'Asia/Seoul' }) : null;

  const fetchTaskData = useCallback(async () => {
    try {
      const res = await api.get(
        `/task/${taskId}/section/${sectionInfo.id}`
      );
      const { section, checklists: taskChecklists, items } = res.data;

      if (section) {
        setTaskSectionCheck({
          id: section.id,
          checked: !!section.checkedAt,
          checkedAt: section.checkedAt || null,
        });
      }

      if (taskChecklists) {
        setTaskChecklistCheck(
          taskChecklists.map((cl) => ({
            id: cl.taskChecklistId,
            sectionId: cl.sectionId,
            checklistId: cl.checklistId,
            checked: !!cl.checkedAt,
            checkedAt: cl.checkedAt || null,
          }))
        );
      }

      if (items) {
        console.log(items);
        setChecklists((prev) =>
          prev.map((cl) => ({
            ...cl,
            items: cl.items.map((item) => {
              const taskItem = items.find((ti) => ti.itemId === item.id);
              return taskItem ? { ...item, value: taskItem.value } : item;
            }),
          }))
        );
      }
    } catch (err) {
      console.error(err);
    }
  }, [taskId, sectionInfo.id]);

  useEffect(() => {
    if (mode !== 'edit') fetchTaskData();
  }, [fetchTaskData, mode]);

  /* ---------- API actions ---------- */
  const updateSectionInfoAPI = async (key, value) => {
    if (mode !== 'edit') return;
    setSectionInfo((prev) => ({ ...prev, [key]: value }));
    try {
      await api.put(
        `/checksheet/section/${sectionInfo.id}`,
        { ...sectionInfo, [key]: value }
      );
      message.success('섹션 저장 완료');
    } catch {
      message.error('섹션 저장 실패');
    }
  };

  const toggleSectionCheck = async (checked) => {
    const checkedAt = nowISO(checked);
    setTaskSectionCheck({ checked, checkedAt });
    try {
      await api.post('/task/section', {
        taskId,
        sectionId: sectionInfo.id,
        checked,
        checkedAt,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const toggleChecklistCheck = async (sectionId, clId, checked) => {
    const checkedAt = nowISO(checked);
    setTaskChecklistCheck((prev) =>
      prev.some((c) => c.checklistId === clId)
        ? prev.map((c) =>
            c.checklistId === clId ? { ...c, checked, checkedAt } : c
          )
        : [...prev, { id: null, sectionId: sectionId, checklistId: clId, checked, checkedAt }]
    );
    try {
      await api.post('/task/checklist', {
        taskId,
        sectionId,
        checklistId: clId,
        checkedAt,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const addChecklist = async () => {
    if (mode !== 'edit') return;
    try {
      const res = await api.post(
        `/checksheet/section/${sectionInfo.id}/checklists`,
        { title: '새 체크리스트', text: '', sort_order: checklists.length }
      );
      setChecklists((prev) => [...prev, { ...res.data, items: [] }]);
      setTaskChecklistCheck((prev) => [
        ...prev,
        { id: res.data.id, checked: false, checkedAt: null },
      ]);
    } catch {
      message.error('체크리스트 추가 실패');
    }
  };

  const updateChecklistAPI = async (checklistId, key, value) => {
    if (mode !== 'edit') return;
    setChecklists((prev) =>
      prev.map((c) => (c.id === checklistId ? { ...c, [key]: value } : c))
    );
    try {
      await api.put(
        `/checksheet/checklist/${checklistId}`,
        { [key]: value }
      );
      message.success('체크리스트 저장 완료');
    } catch {
      message.error('체크리스트 저장 실패');
    }
  };

  const deleteChecklistAPI = async (checklistId) => {
    if (mode !== 'edit') return;
    try {
      await api.delete(
        `/checksheet/checklist/${checklistId}`
      );
      setChecklists((prev) => prev.filter((c) => c.id !== checklistId));
      setTaskChecklistCheck((prev) => prev.filter((c) => c.id !== checklistId));
      message.success('체크리스트 삭제 완료');
    } catch {
      message.error('체크리스트 삭제 실패');
    }
  };

  const updateItemAPI = async (checklistId, itemId, key, value) => {
    setChecklists((prev) =>
      prev.map((c) =>
        c.id === checklistId
          ? {
              ...c,
              items: c.items.map((i) =>
                i.id === itemId ? { ...i, [key]: value } : i
              ),
            }
          : c
      )
    );

    try {
      if (mode === 'edit') {
        await api.put(`/checksheet/item/${itemId}`, {
          [key]: value,
        });
        message.success('항목 저장 완료');
      }
    } catch {
      message.error('항목 저장 실패');
    }
  };

  const deleteItemAPI = async (checklistId, itemId) => {
    if (mode !== 'edit') return;
    try {
      await api.delete(`/checksheet/item/${itemId}`);
      setChecklists((prev) =>
        prev.map((c) => ({
          ...c,
          items: c.items.filter((i) => i.id !== itemId),
        }))
      );
      message.success('항목 삭제 완료');
    } catch {
      message.error('항목 삭제 실패');
    }
  };

  const handleAddItem = (item, checklistId) => {
    // 기존 addItem 내부 통합
    api.post(
        `/checksheet/checklist/${checklistId}/items`,
        {
          title: item.title,
          type: item.type,
          value: null,
          options: item.options,
          sort_order: checklists.find((c) => c.id === checklistId).items.length,
        }
      )
      .then((res) =>
        setChecklists((prev) =>
          prev.map((c) =>
            c.id === checklistId
              ? { ...c, items: [...c.items, res.data] }
              : c
          )
        )
      )
      .catch(() => message.error('항목 추가 실패'));
    setIsModalOpen(false);
  };

  /* ---------- render ---------- */
  return (
    <Card
      title={
        <Space
          direction="horizontal"
          style={{ width: '100%', justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
              checked={taskSectionCheck.checked}
              onChange={(e) => toggleSectionCheck(e.target.checked)}
              className="big-checkbox"
            />
            {mode === 'edit' ? (
              <Input
                placeholder="섹션 제목 입력"
                size="large"
                style={{ width: 400, marginLeft: 10 }}
                value={sectionInfo.title}
                onChange={(e) => updateSectionInfoAPI('title', e.target.value)}
              />
            ) : (
              <div style={{ fontSize: 'large', width: 400, marginLeft: 10 }}>
                {sectionInfo.title || (
                  <span style={{ color: '#aaa' }}>제목 없음</span>
                )}
              </div>
            )}
          </div>

          {mode !== 'edit' && taskSectionCheck.checkedAt && (
            <div style={{ fontSize: 12, color: '#555', marginLeft: 28 }}>
              {new Date(taskSectionCheck.checkedAt).toLocaleString()}
            </div>
          )}
        </Space>
      }
      extra={mode === 'edit' && <Button danger onClick={onDelete}>삭제</Button>}
      style={{ marginBottom: 16 }}
    >
      <div style={{ marginBottom: 12 }}>
        <RichTextEditor
          value={sectionInfo.text}
          onChange={(val) => updateSectionInfoAPI('text', val)}
          readOnly={mode !== 'edit'}
          editable={mode === 'edit'}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        {checklists.map((cl) => {
          const taskCl =
            taskChecklistCheck.find((tc) => tc.checklistId === cl.id) || {
              checked: false,
              checkedAt: null,
            };
          return (
            <Card
              key={cl.id}
              type="inner"
              title={
                <Space
                  direction="horizontal"
                  style={{ width: '100%', justifyContent: 'space-between' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                      checked={taskCl.checked}
                      onChange={(e) =>
                        toggleChecklistCheck(sectionInfo.id, cl.id, e.target.checked)
                      }
                    />
                    {mode === 'edit' ? (
                      <Input
                        placeholder="체크리스트 제목"
                        style={{ width: 385, marginLeft: 10 }}
                        value={cl.title}
                        onChange={(e) =>
                          updateChecklistAPI(cl.id, 'title', e.target.value)
                        }
                      />
                    ) : (
                      <div style={{ width: 385, marginLeft: 10 }}>
                        {cl.title || (
                          <span style={{ color: '#aaa' }}>제목 없음</span>
                        )}
                      </div>
                    )}
                  </div>

                  {mode !== 'edit' && taskCl.checkedAt && (
                    <div style={{ fontSize: 12, color: '#555', marginLeft: 28 }}>
                      {new Date(taskCl.checkedAt).toLocaleString()}
                    </div>
                  )}
                </Space>
              }
              extra={
                mode === 'edit' && (
                  <Space>
                    <Button
                      size="small"
                      onClick={() => {
                        setIsModalOpen(true);
                        setSelectedChecklist(cl.id);
                      }}
                    >
                      항목 추가
                    </Button>
                    <Button
                      danger
                      size="small"
                      onClick={() => deleteChecklistAPI(cl.id)}
                    >
                      삭제
                    </Button>
                  </Space>
                )
              }
              style={{ marginBottom: 16 }}
            >
              <div style={{ padding: '0 23px' }}>
                {cl.items.map((item) => (
                  <ChecklistItem
                    key={item.id}
                    item={item}
                    sectionId={sectionInfo.id}
                    checklistId={cl.id}
                    taskId={taskId}
                    mode={mode}
                    onChange={(key, val) =>
                      updateItemAPI(cl.id, item.id, key, val)
                    }
                    onDelete={() => deleteItemAPI(cl.id, item.id)}
                  />
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {mode === 'edit' && (
        <Button type="dashed" onClick={addChecklist} block icon={<PlusOutlined />}>
          체크리스트 추가
        </Button>
      )}

      <Modal
        title="항목 추가"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <ChecksheetItemForm
          onSubmit={handleAddItem}
          selectedChecklistKey={selectedChecklist}
        />
      </Modal>
    </Card>
  );
};

export default SectionCard;
