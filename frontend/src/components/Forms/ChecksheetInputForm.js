import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Button, Form, Input, Select, Space, message } from 'antd';
const { Option } = Select;

const ChecksheetInputForm = ({ onClose, isEditMode, selectedData }) => {
  const [form] = Form.useForm();
  const [statusCode, setStatusCode] = useState([]);

  // 상태 코드 불러오기
  useEffect(() => {
    api.get('/code', { 
      params: { category: 'checksheet_status' } 
    })
    .then(res => setStatusCode(res.data))
    .catch(console.error);
  }, []);

  // 신규/편집 초기값 세팅
    useEffect(() => {
    if (isEditMode && selectedData) {
      form.setFieldsValue({
        id : selectedData.id,
        category: selectedData.category,
        checksheetName: selectedData.checksheetName,
        status: selectedData.status,
      });
    } else {
      onReset();
      form.setFieldsValue({ status: '1' }); // 기본값 설정
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, selectedData, form]);

  const onFinish = async (values) => {
    try {
      onClose(values, true, isEditMode); // 모달 닫기 + 상위에 값 전달
      onReset();
    } catch (err) {
      console.error(err);
      message.error('저장 중 오류가 발생했습니다.');
      onClose(values, false); // 모달 닫기 + 상위에 값 전달
    }
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <Form
      layout="vertical"
      form={form}
      name="control-hooks"
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
    >
      {/* 숨겨진 ID 필드 */}
      <Form.Item
        name="id"
        hidden={true}   // 화면에 표시되지 않음
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="category"
        label="카테고리"
        rules={[{ required: true, message: '카테고리를 선택하세요' }]}
      >
        <Select placeholder="카테고리를 선택하세요">
          <Option value="new">신규</Option>
          <Option value="maintenance">유지/보수</Option>
          <Option value="emergency">긴급대응</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="checksheetName"
        label="체크시트명"
        rules={[{ required: true, message: '체크시트명을 입력하세요' }]}
        allowClear
      >
        <Input placeholder="체크시트명을 입력하세요"/>
      </Form.Item>

      <Form.Item
        name="status"
        label="스테이터스"
        rules={[{ required: true }]}
      >
        <Select placeholder="스테이터스를 선택하세요">
          {statusCode.map(elm => (
            <Option key={elm.code} value={elm.code}>{elm.name}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item style={{ textAlign: 'end' }}>
        <Space>
          <Button type="primary" htmlType="submit">
            {isEditMode ? '수정' : '등록'}
          </Button>
          <Button onClick={() => { onClose(); }}>
            취소
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ChecksheetInputForm;
