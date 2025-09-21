import React, { useEffect, useState } from 'react';
import { Table, Button, message, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TaskCreateModal from './Modals/TaskCreateModal';
import TaskEditModal from './Modals/TaskEditModal';
import StickyPageHeader from './StickyPageHeader';

const TaskListPage = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const success = (msg) => messageApi.open({ type: 'success', content: msg });
  const error = (msg) => messageApi.open({ type: 'error', content: msg });

  useEffect(() => {
    fetchTasks();
  }, []);

  // 작업 리스트 가져오기
  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      error('작업 목록을 가져오지 못했습니다.');
    }
  };

  // 선택 변경
  const onSelectChange = (newSelectedRowKeys) =>
    setSelectedRowKeys(newSelectedRowKeys);
  const rowSelection = { selectedRowKeys, onChange: onSelectChange };

  // ✅ 삭제 처리
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      success('삭제되었습니다.');
      fetchTasks();
    } catch (err) {
      console.error(err);
      error('삭제 중 오류가 발생했습니다.');
    }
  };

  const columns = [
    {
      title: '작업명',
      dataIndex: 'title',
      key: 'title',
      // ✅ 작업명을 클릭하면 편집 모달 열기
      render: (_, record) => (
        <Button
          type="link"
          onClick={(e) => {
            e.stopPropagation();            // row select와 중복 방지
            setEditingTask(record);
            setEditModalOpen(true);
          }}
        >
          {record.title}
        </Button>
      ),
    },
    { title: '카테고리', dataIndex: 'category', key: 'category' },
    { title: '체크시트', dataIndex: 'checksheetName', key: 'checksheetName' },
    { title: '등록일자', dataIndex: 'createdAt', key: 'createdAt', render: (t) => t || '' },
    { title: '수정일자', dataIndex: 'updatedAt', key: 'updatedAt', render: (t) => t || '' },

    {
      title: '옵션',
      key: 'delete',
      // ✅ 삭제 버튼
      render: (_, record) => (
        <Popconfirm
          title="정말 삭제하시겠습니까?"
          okText="삭제"
          cancelText="취소"
          onConfirm={(e) => {
            e?.stopPropagation();
            handleDelete(record.id);
          }}
          onCancel={(e) => e?.stopPropagation()}
        >
          <Button type="link" danger onClick={(e) => e.stopPropagation()}>
            delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const handleRunTasks = () => {
    if (selectedRowKeys.length === 0)
      return error('실시할 작업을 선택해주세요.');
    const selectedTasks = tasks.filter((t) => selectedRowKeys.includes(t.id));
    navigate('/tasks/run', { state: { selectedTasks } });
  };

  return (
    <div>
      {contextHolder}

      <StickyPageHeader
        title="작업 일람"
        subtitle={`${tasks.length} Total`}
        width="calc(100% - 90px)"
        actions={[
          {
            label: '작업 등록',
            type: 'dashed',
            icon: <PlusOutlined />,
            onClick: () => setIsModalOpen(true),
          },
          {
            label: '작업 실시',
            type: 'primary',
            onClick: handleRunTasks,
          },
        ]}
      />

      <div style={{ marginTop: 60 }}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={tasks}
          pagination={{ pageSize: 10 }}
          rowSelection={{ type: 'radio', ...rowSelection }}
          onRow={(record) => ({
            onClick: () => setSelectedRowKeys([record.id]),
          })}
        />
      </div>

      <TaskCreateModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={async () => {
          await fetchTasks();
          success('성공적으로 등록하였습니다.');
        }}
      />

      {/* 편집 모달 */}
      <TaskEditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        task={editingTask}
        onSuccess={async () => {
          await fetchTasks();
          success('수정이 완료되었습니다.');
        }}
      />
    </div>
  );
};

export default TaskListPage;
