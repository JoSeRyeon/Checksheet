import React from 'react';
import { Flex, Space, Button, Typography, Select } from 'antd';

const { Text, Title } = Typography;

export default function StickyPageHeader({
  title = "Title",
  subtitle,
  selectOptions,
  defaultSelectValue,
  onSelectChange,
  actions = [],
  width = "1200px",    // 최대 폭
}) {
  return (
    <div
      className="sticky-header"
      style={{
        position: 'fixed',
        top: 80,
        left: '50%',
        transform: 'translateX(-50%)',
        width,
        zIndex: 1000,
        background: '#fff',
        border: '1px solid #eee',
        borderRadius: 8,
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
        padding: 'clamp(12px, 2vw, 16px) clamp(16px, 4vw, 24px)',
      }}
    >
      <Flex
        justify="space-between"
        align="center"
        wrap   // 👈 antd Flex의 wrap 옵션
      >
        <Space align="baseline" style={{ flexWrap: 'wrap', gap: 8 }}>
          <Title level={4} style={{ margin: 0, fontWeight: 600, fontSize: 'clamp(16px, 3vw, 20px)' }}>
            {title}
          </Title>
          {subtitle && (
            <Text type="secondary" style={{ fontSize: 'clamp(12px, 2.5vw, 14px)' }}>
              {subtitle}
            </Text>
          )}
        </Space>

        <Space size="middle" wrap>
          {selectOptions && (
            <Select
              defaultValue={defaultSelectValue || selectOptions[0]?.value}
              style={{ width: 180, minWidth: 120 }}
              options={selectOptions}
              onChange={onSelectChange}
            />
          )}
          {actions.map((action, idx) => (
            <Button
              key={idx}
              type={action.type || 'default'}
              icon={action.icon}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </Space>
      </Flex>
    </div>
  );
}
