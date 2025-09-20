import React from 'react';
import { Flex, Space, Button, Typography, Select } from 'antd';

const { Text, Title } = Typography;

/**
 * 뷰포트 상단에, 원하는 폭으로만 고정되는 헤더
 */
export default function StickyPageHeader({
  title = "Title",
  subtitle,
  selectOptions,
  defaultSelectValue,
  onSelectChange,
  actions = [],
  width = "100%"
}) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 80,          // 상단 네비게이션 높이에 맞게 조정
        left: '50%',      // 가운데 정렬을 위해
        transform: 'translateX(-50%)',
        width,            // 고정 박스 자체의 폭을 직접 지정
        zIndex: 1000,
        background: '#fff',
        border: '1px solid #eee',
        borderRadius: 8,
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
        padding: '16px 24px',
      }}
    >
      <Flex justify="space-between" align="center">
        {/* 왼쪽 : 타이틀 + 서브텍스트 */}
        <Space align="baseline">
          <Title level={4} style={{ margin: 0, fontWeight: 600 }}>
            {title}
          </Title>
          {subtitle && (
            <Text type="secondary" style={{ fontSize: 14 }}>
              {subtitle}
            </Text>
          )}
        </Space>

        {/* 오른쪽 : 셀렉트 + 버튼 그룹 */}
        <Space size="middle">
          {selectOptions && (
            <Select
              defaultValue={defaultSelectValue || selectOptions[0]?.value}
              style={{ width: 180 }}
              options={selectOptions}
              onChange={onSelectChange}
            />
          )}

          {actions.map((action, idx) => (
            action.color && action.variant ? (
              <Button
                key={idx}
                color={action.color}
                variant={action.variant}
                icon={action.icon}
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            ) : (
              <Button
                key={idx}
                type={action.type || 'default'}
                icon={action.icon}
                onClick={action.onClick}
              >
                {action.label}
              </Button>)
          ))}

        </Space>
      </Flex>
    </div>
  );
}
