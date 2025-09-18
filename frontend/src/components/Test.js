import React, { useState } from 'react';
import { Button, Card, Checkbox, Input, Select, Flex } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import RichTextEditor from '../RichTextEditor';

const SectionCard = () => {
    const [sectionInfo, setSectionInfo] = useState(null);
    const [checklists, setChecklists] = useState([]);

    const addChecklist = () => {
        const newChecklist = {
            id: Date.now(),
            sort: checklists.length + 1,
            title: `체크리스트 ${checklists.length + 1}`,
            text: '',
            items: []
        };
        setChecklists([...checklists, newChecklist]);
    };

    const addItem = (checklistId) => {
        setChecklists(prev =>
            prev.map(c =>
                c.id === checklistId
                    ? {
                        ...c,
                        items: [
                            ...c.items,
                            { id: Date.now(), title: `항목 ${c.items.length + 1}`, type: 'text', value: '' }
                        ]
                    }
                    : c
            )
        );
    };

    const updateItemValue = (checklistId, itemId, value) => {
        setChecklists(prev =>
            prev.map(c =>
                c.id === checklistId
                    ? {
                        ...c,
                        items: c.items.map(i =>
                            i.id === itemId ? { ...i, value } : i
                        )
                    }
                    : c
            )
        );
    };

    const updateSectionInfo = (key, value) => {

        setSectionInfo(prev => ({
            ...prev,
            [key]: value  // key 변수 값이 키로 사용됨
        }));
    }

    const updateChecklist = (checklistId, key, value) => {

        setChecklists(prev =>
            prev.map(c =>
                c.id === checklistId
                    ? {
                        ...c,
                        [key]: value
                    }
                    : c
            )
        )
    }

    return (
        <Card title={<Input value={sectionInfo?.title} onChange={(e) => updateSectionInfo("title", e.target.value)} placeholder="섹션명 입력" size='large' />} extra={<Button style={{ marginLeft: "10px" }} onClick={addChecklist} icon={<PlusOutlined />}>체크리스트 추가</Button>}>

            <div style={{ padding: "0 30px" }}>
                <div>
                    <RichTextEditor
                        value={sectionInfo?.text}
                        onChange={(val) => updateItemValue("text", val)}
                    />
                </div>
                {checklists.map((cl) => (
                    <Card
                        key={cl.id}
                        type="inner"
                        title={<Checkbox><Input style={{ marginLeft: "10px" }} placeholder="항목명 입력" defaultValue={cl.title} onChange={(e) => updateChecklist(cl.id, "title", e.target.value)} /></Checkbox>}
                        extra={
                            <Button style={{ marginLeft: "10px" }} size="small" onClick={() => addItem(cl.id)}>
                                항목 추가
                            </Button>
                        }
                        style={{ marginBottom: 16 }}
                    >
                        <div>
                            <RichTextEditor
                                value={cl.text}
                                onChange={(val) => updateChecklist(cl.id, "text", val)}
                            />
                        </div>
                        <div style={{ padding: "12px 0", margin: "0 20px" }}>
                            {cl.items.map((item) => (
                                <div key={item.id} style={{ marginBottom: 8 }}>
                                    <span>{item.title}</span>
                                    {item.type === 'text' && (
                                        <Input
                                            placeholder="텍스트 입력"
                                            value={item.value}
                                            onChange={e =>
                                                updateItemValue(cl.id, item.id, e.target.value)
                                            }
                                        />
                                    )}
                                    {item.type === 'textarea' && (
                                        <Input.TextArea
                                            placeholder="내용 입력"
                                            value={item.value}
                                            onChange={e =>
                                                updateItemValue(cl.id, item.id, e.target.value)
                                            }
                                        />
                                    )}
                                    {item.type === 'select' && (
                                        <Select
                                            placeholder="선택"
                                            value={item.value}
                                            onChange={val =>
                                                updateItemValue(cl.id, item.id, val)
                                            }
                                            options={[{ value: 'A' }, { value: 'B' }]}
                                            style={{ width: 120 }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>
                ))}
            </div>
        </Card>
    );
};

export default SectionCard;
