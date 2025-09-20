// TaskEditModal.jsx
import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import axios from 'axios';

export default function TaskEditModal({ open, onClose, task, onSuccess }) {
  const [form] = Form.useForm();

  // 선택된 task 가 바뀌거나, 모달이 열릴 때마다 form 초기화
  useEffect(() => {
    if (task && open) {
      form.setFieldsValue(task);
    }
  }, [task, form, open]);

  const handleSubmit = async (values) => {
    try {
      // API 호출
      await axios.put(`http://localhost:5000/api/tasks/${task.id}`,
        { ...task, ...values }
      )
      onSuccess();   // 성공 후 목록 갱신
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal
      title="작업 수정"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="작업명"
          name="title"
          rules={[{ required: true, message: '작업명을 입력하세요' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="카테고리"
          name="category"
          rules={[{ required: true, message: '카테고리를 입력하세요' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="체크시트"
          name="checksheetName"
        >
          <Input disabled />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            저장
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
