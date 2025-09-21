// import React, { useState, useEffect } from 'react';
// import { Input, Select, Button, Space, message, Modal } from 'antd';
// import axios from 'axios';

// const { Option } = Select;

// const TaskCreateModal = ({ open, onClose, onSuccess }) => {
//   const [title, setTitle] = useState('');
//   const [category, setCategory] = useState('');
//   const [checksheetList, setChecksheetList] = useState([]);
//   const [selectedChecksheet, setSelectedChecksheet] = useState(null);

//   const [messageApi, contextHolder] = message.useMessage();

//   const success = (msg) => messageApi.open({ type: 'success', content: msg });
//   const error = (msg) => messageApi.open({ type: 'error', content: msg });

//   useEffect(() => {
//     if (open) fetchChecksheetList();
//   }, [open]);

//   // 체크시트 리스트 가져오기
//   const fetchChecksheetList = async () => {
//     try {
//       const res = await axios.get('http://localhost:5000/api/checksheet');
//       setChecksheetList(res.data.filter((elm) => elm.status !== "3"));
//     } catch (err) {
//       console.error(err);
//       error('체크시트 목록을 가져오지 못했습니다.');
//     }
//   };

//   // 작업 등록
//   const handleCreateTask = async () => {
//     if (!title || !category || !selectedChecksheet) {
//       return error('작업명, 카테고리, 체크시트를 모두 선택해주세요.');
//     }

//     try {
//       await axios.post('http://localhost:5000/api/tasks', {
//         title,
//         category,
//         checksheet_id: selectedChecksheet.id,
//         creator: null,
//         assignee: null,
//         verifier: null,
//         admin: null,
//       });
//       success('작업이 등록되었습니다.');
//       // 등록 후 초기화
//       setTitle('');
//       setCategory('');
//       setSelectedChecksheet(null);
//       onSuccess?.(); // 등록 완료 시 부모에서 새로고침/리스트 업데이트할 때 사용
//       onClose(); // 모달 닫기
//     } catch (err) {
//       console.error(err);
//       error('작업 등록에 실패했습니다.');
//     }
//   };

//   return (
//     <Modal
//       open={open}
//       title="작업 등록"
//       onCancel={onClose}
//       footer={null}
//     >
//       {contextHolder}
//       <Space direction="vertical" style={{ width: '100%' }} size="large">
//         <Input
//           placeholder="작업명 입력"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />
//         <Input
//           placeholder="카테고리 입력"
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//         />
//         <Select
//           placeholder="체크시트 선택"
//           value={selectedChecksheet?.id}
//           onChange={(id) =>
//             setSelectedChecksheet(checksheetList.find((cs) => cs.id === id))
//           }
//           style={{ width: '100%' }}
//         >
//           {checksheetList.map((cs) => (
//             <Option key={cs.id} value={cs.id}>
//               {cs.checksheetName}
//             </Option>
//           ))}
//         </Select>
//         <Button type="primary" onClick={handleCreateTask} block>
//           등록
//         </Button>
//       </Space>
//     </Modal>
//   );
// };

// export default TaskCreateModal;





import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button, message, Modal } from 'antd';
import axios from 'axios';

const { Option } = Select;

export default function TaskCreateModal({ open, onClose, onSuccess }) {
  const [form] = Form.useForm();
  const [checksheetList, setChecksheetList] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  const success = (msg) => messageApi.open({ type: 'success', content: msg });
  const error = (msg) => messageApi.open({ type: 'error', content: msg });

  // 모달이 열릴 때 체크시트 목록 가져오기
  useEffect(() => {
    
    if (open) {
      fetchChecksheetList();
    } else {
      form.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const fetchChecksheetList = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/checksheet');
      setChecksheetList(res.data.filter((elm) => elm.status !== '3'));
    } catch (err) {
      console.error(err);
      error('체크시트 목록을 가져오지 못했습니다.');
    }
  };

  // 제출 처리
  const handleFinish = async (values) => {
    try {
      await axios.post('http://localhost:5000/api/tasks', {
        title: values.title,
        category: values.category,
        checksheet_id: values.checksheet_id,
        creator: null,
        assignee: null,
        verifier: null,
        admin: null,
      });
      success('작업이 등록되었습니다.');

      form.resetFields(); // 입력 초기화
      onSuccess?.();      // 부모에서 리스트 새로고침
      onClose();          // 모달 닫기
    } catch (err) {
      console.error(err);
      error('작업 등록에 실패했습니다.');
    }
  };

  return (
    <Modal
      open={open}
      title="작업 등록"
      onCancel={onClose}
      footer={null}
    >
      {contextHolder}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item
          label="작업명"
          name="title"
          rules={[{ required: true, message: '작업명을 입력하세요.' }]}
        >
          <Input placeholder="작업명 입력" />
        </Form.Item>

        <Form.Item
          label="카테고리"
          name="category"
          rules={[{ required: true, message: '카테고리를 입력하세요.' }]}
        >
          <Input placeholder="카테고리 입력" />
        </Form.Item>

        <Form.Item
          label="체크시트"
          name="checksheet_id"
          rules={[{ required: true, message: '체크시트를 선택하세요.' }]}
        >
          <Select placeholder="체크시트 선택">
            {checksheetList.map((cs) => (
              <Option key={cs.id} value={cs.id}>
                {cs.checksheetName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            등록
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
