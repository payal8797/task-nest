import React, {} from 'react';
import { Typography, Row, Tag, Card, Space } from 'antd';
import moment from 'moment';
import {CalendarOutlined} from '@ant-design/icons';
import { Divider } from 'antd';
import { CheckCircleOutlined, SyncOutlined, HourglassOutlined } from '@ant-design/icons';

const { Title } = Typography;

const ViewTasks = ({ heading, description, tasks, type }) => {
    const statusGroups = {
        todo: tasks?.filter((t) => t.status === 'todo'),
        inprogress: tasks?.filter((t) => t.status === 'inprogress'),
        ...(type !== 'backlog' && { done: tasks?.filter((t) => t.status === 'done') }),
    };
    
    const renderTaskActions = (task) => (
        <Space>
            <Space direction='vertical'>
                <Space style={{ color: '#808080' }}>Priority</Space>
                {task.priority === 'low' ? (
                    <Tag color='green'>Low</Tag>
                ) : task.priority === 'medium' ? (
                    <Tag color='blue'>Medium</Tag>
                ) : task.priority === 'high' ? (
                    <Tag color='red'>High</Tag>
                ) : (
                    'none'
                )}
            </Space>
        </Space>
    );

    const getStatusTitle = (status) => {
        switch (status) {
            case 'todo':
                return (
                    <Divider orientation="left" style={{ fontSize: '16px', color: '#1890ff' }}>
                        <HourglassOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                        To Do
                    </Divider>
                );
            case 'inprogress':
                return (
                    <Divider orientation="left" style={{ fontSize: '16px', color: '#fa8c16' }}>
                        <SyncOutlined spin style={{ marginRight: '8px', color: '#fa8c16' }} />
                        In Progress
                    </Divider>
                );
            case 'done':
                return (
                    <Divider orientation="left" style={{ fontSize: '16px', color: '#52c41a' }}>
                        <CheckCircleOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                        Done
                    </Divider>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <Title level={2}>{heading}</Title>
            <i>{description}</i>
            <br />
            <br/>
            <div style={{ display: 'flex', gap: '16px' }}>
                {Object.entries(statusGroups)?.map(([status, group]) => (
                    <div key={status} style={{ flex: 1 }}>
                    {getStatusTitle(status)}
                        {group?.map((task) => (
                            <Card key={task._id} style={{ marginBottom: '5px' }}>
                                <Row align={'middle'} justify={'space-between'}>
                                    {task.name}
                                    {renderTaskActions(task)}
                                </Row>
                                <p>
                                    <i>{task.description}</i>
                                </p>
                                <CalendarOutlined /> {moment(task.dueDate).format('DD-MM-YYYY')}
                            </Card>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewTasks;

