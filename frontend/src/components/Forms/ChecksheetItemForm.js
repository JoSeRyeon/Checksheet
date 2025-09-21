import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Select, Space, Button, List } from 'antd';

const ChecksheetItemForm = ({ onSubmit, initialValues, selectedChecklistKey }) => {
  const [form] = Form.useForm();
  const [options, setOptions] = useState([]);
  const [buttons, setButtons] = useState([]);

  const optionInputRef = useRef(null);
  const buttonInputRef = useRef(null);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setOptions(initialValues.options || []);
      setButtons(initialValues.buttons || []);
    } else {
      form.resetFields();
      setOptions([]);
      setButtons([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues, form]);

  const addOption = (value) => {
    if (!value) return;
    setOptions(prev => [...prev, value]);
    if (optionInputRef.current) optionInputRef.current.input.value = '';
  };

  const addButtonLabel = (value) => {
    if (!value) return;
    setButtons(prev => [...prev, value]);
    if (buttonInputRef.current) buttonInputRef.current.input.value = '';
  };

  const handleFinish = (values) => {
    onSubmit(
      {
        ...values,
        options: values.type === 'select' ? options : undefined,
        buttons: values.type === 'button' ? buttons : undefined,
      },
      selectedChecklistKey
    );
    form.resetFields();
    setOptions([]);
    setButtons([]);
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Form.Item
        name="title"
        label="항목 이름"
        rules={[{ required: true, message: '항목 이름을 입력하세요' }]}
      >
        <Input placeholder="예: 이메일 입력, 연락처 선택박스 등" />
      </Form.Item>

      <Form.Item
        name="type"
        label="항목 타입"
        rules={[{ required: true, message: '항목 타입을 선택하세요' }]}
      >
        <Select
          // placeholder="셀렉트박스 / 인풋 / 텍스트에리아 / 버튼"
          placeholder="짧은 메모 / 긴 메모 / 선택박스"
          onChange={() => {
            setOptions([]);
            setButtons([]);
            form.setFieldsValue({ placeholder: '', label: '' });
          }}
        >
          <Select.Option value="input">짧은 메모</Select.Option>
          <Select.Option value="textarea">긴 메모</Select.Option>
          <Select.Option value="select">선택박스</Select.Option>
          {/* <Select.Option value="button">버튼</Select.Option> */}
        </Select>
      </Form.Item>

      {/* {['input', 'textarea'].includes(form.getFieldValue('type')) && (
        <Form.Item
          name="placeholder"
          label="플레이스홀더"
          rules={[{ required: true, message: '플레이스홀더를 입력하세요' }]}
        >
          <Input placeholder="플레이스홀더 입력" />
        </Form.Item>
      )} */}

      {form.getFieldValue('type') === 'select' && (
        <div style={{ marginBottom: 16 }}>
          <label>옵션 관리</label>
          <Space style={{ marginBottom: 8 }}>
            <Input
              placeholder="옵션 추가"
              ref={optionInputRef}
              onPressEnter={(e) => addOption(e.target.value)}
            />
            <Button onClick={() => addOption(optionInputRef.current.input.value)}>추가</Button>
          </Space>
          <List
            size="small"
            bordered
            dataSource={options}
            renderItem={(opt, idx) => (
              <List.Item
                actions={[
                  <Button type='text' onClick={() => setOptions(prev => prev.filter((_, i) => i !== idx))}>
                    삭제
                  </Button>,
                ]}
              >
                {opt}
              </List.Item>
            )}
          />
        </div>
      )}

      {form.getFieldValue('type') === 'button' && (
        <div style={{ marginBottom: 16 }}>
          <label>버튼 라벨 관리</label>
          <Space style={{ marginBottom: 8 }}>
            <Input
              placeholder="버튼 라벨 추가"
              ref={buttonInputRef}
              onPressEnter={(e) => addButtonLabel(e.target.value)}
            />
            <Button onClick={() => addButtonLabel(buttonInputRef.current.input.value)}>추가</Button>
          </Space>
          <List
            size="small"
            bordered
            dataSource={buttons}
            renderItem={(btn, idx) => (
              <List.Item
                actions={[
                  <Button type='text' onClick={() => setButtons(prev => prev.filter((_, i) => i !== idx))}>삭제</Button>,
                ]}
              >
                {btn}
              </List.Item>
            )}
          />
        </div>
      )}

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          저장
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ChecksheetItemForm;
