import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Flex, Table, Tag, Modal, message } from 'antd';
import { useNavigate, Outlet } from 'react-router-dom';
import ChecksheetInputForm from './Forms/ChecksheetInputForm';

const columns = [
    { title: '카테고리', dataIndex: 'category' },
    { title: '체크시트명', dataIndex: 'checksheetName' },
    {
        title: '스테이터스', dataIndex: 'statusLabel',
        render: (status, record) => (
            <span>
                <Tag color={record.statusColor} key={status}>
                    {status.toUpperCase()}
                </Tag>
            </span>
        ),
    },
    { title: '작성자', dataIndex: 'author' },
    { title: '등록일자', dataIndex: 'createdAt' },
    { title: '수정일자', dataIndex: 'updatedAt' },
];

const CheckcheetListPage = () => {
    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [messageApi, contextHolder] = message.useMessage();

    const hasSelected = selectedRowKeys.length > 0;

    const success = (msg) => {
        messageApi.open({
            type: 'success',
            content: msg || '정상적으로 처리되었습니다.',
        });
    };
    const error = (msg) => {
        messageApi.open({
            type: 'error',
            content: msg || '다시 시도해주세요.',
        });
    };

    const warning = (msg) => {
        messageApi.open({
            type: 'warning',
            content: msg || '다시 시도해주세요.',
        });
    };

    useEffect(() => {
        fetchChecksheetList();
    }, []);

    /* =============================================================================== 
    ============================== API 요청용 함수 START ============================== */
    // 체크시트 리스트 취득
    async function fetchChecksheetList(data) {
        axios.get('http://localhost:5000/api/checksheets')
            .then(res => {
                setData(res.data);
            })
            .catch(console.error);
    }

    // 신규 체크시트를 디비에 등록
    async function createChecksheet(data) {
        console.log(data);

        await axios.post('http://localhost:5000/api/checksheets', data)
            .then(res => {
                success('체크시트가 등록되었습니다.');
            })
            .catch((err) => {
                error('체크시트 등록에 실패하였습니다.');
                console.error(err);
            });
    }

    // 체크시트 업데이트
    async function updateChecksheet(data) {
        console.log(data);
        const id = data.id;
        await axios.put(`http://localhost:5000/api/checksheets/${id}`, data)
            .then(res => {
                success('수정이 완료되었습니다.');
            })
            .catch((err) => {
                error('체크시트 수정에 실패하였습니다. 다시 시도해주세요');
                console.error(err);
            });
    }
    /* ============================== API 요청용 함수 END ============================ 
    ================================================================================= */

    const onSelectChange = newSelectedRowKeys => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const handleButtonClick = (status) => {
        navigate('/edit');
    };

    const handleCreateButtonClick = () => {
        setIsEdit(false);
        showModal();
    }

    const handleEditButtonClick = () => {
        if (!hasSelected) {
            return warning('목록에서 편집할 체크시트를 선택한 후 버튼을 눌러 주세요.');
        }
        setIsEdit(true);
        showModal();
    }

    // 모달창 컨트롤러
    const showModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    }

    const handleOk = async (values, isSave, isEdit) => {
        if (isSave) {
            if (isEdit) {
                // 업데이트
                await updateChecksheet(values);
            } else {
                // 신규 등록
                await createChecksheet(values);
            }
            fetchChecksheetList();
        }
        closeModal();
    };

    const handleCancel = () => {
        closeModal();
    };

    // 체크시트 상세 작성 버튼 클릭 핸들러
const handleDetailButtonClick = () => {
    if (!hasSelected) {
        return warning('목록에서 체크시트를 선택한 후 버튼을 눌러 주세요.');
    }

    // 선택된 체크시트 정보 찾기
    const selectedChecksheet = data.find(elm => elm.id === selectedRowKeys[0]);

    // /edit 페이지로 state 전달
    navigate('/edit', { state: { 
        selectedChecksheet, 
        selectedChecksheetId: selectedChecksheet.id 
    } });
};


    return (
        <>
            {contextHolder}

            <Flex gap="middle" vertical>
                <Flex align="center" gap="middle">
                </Flex>

                <Table rowKey="id" rowSelection={{ type: 'radio', ...rowSelection }} columns={columns} dataSource={data} />

                <Flex align="center" gap="middle">
                    <Button type="primary" onClick={handleCreateButtonClick}>신규작성</Button>
                    <Button onClick={handleEditButtonClick}>편집</Button>
                    <Button onClick={handleDetailButtonClick}>체크시트 상세 작성</Button>

                </Flex>
            </Flex>

            <Modal
                title="체크시트 신규 등록"
                closable={{ 'aria-label': 'Custom Close Button' }}
                styles={{
                    body: { marginTop: 20 },
                }}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <ChecksheetInputForm
                    isEditMode={isEdit}
                    onClose={handleOk}
                    selectedData={selectedRowKeys && data.find(elm => elm.id === selectedRowKeys[0])} />
            </Modal>
        </>
    );
};
export default CheckcheetListPage;