import React, { useEffect, useState } from 'react';
import { Layout, Menu, Button, Modal, Input, Select, Switch, List, Typography, message, Dropdown, Form } from 'antd';
import { PlusOutlined, StarFilled, ExclamationCircleOutlined, MoreOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import * as Icons from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { fetchAllProjects, addProject, updateProject, deleteProject } from '../api/projectAPI';  


const { Sider } = Layout;
const { Option } = Select;
const { Text } = Typography;
const { confirm } = Modal;

const Sidebar = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditingProject, setIsEditingProject] = useState(false);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);  
    const [currentProject, setCurrentProject] = useState(null);
    const [selectedKey, setSelectedKey] = useState('today');

    const navigate = useNavigate();
    const [form] = Form.useForm();

    const iconOptions = [
        'SmileOutlined',
        'HeartOutlined',
        'HomeOutlined',
        'SettingOutlined',
        'BookOutlined',
        'ClockCircleOutlined',
        'FlagOutlined',
        'CheckCircleOutlined',
        'FolderOutlined',
        'FireOutlined',
        'ThunderboltOutlined',
        'ToolOutlined',
        'TrophyOutlined',
        'TeamOutlined',
        'WalletOutlined',
        'StarOutlined',
        'BugOutlined',
        'CodeOutlined',
        'GiftOutlined',
        'CameraOutlined',
    ];

    const handleEdit = (project) => {
        setCurrentProject(project);
        setIsModalVisible(true);
        setIsEditingProject(true);

        form.setFieldsValue({
            name: project.name,
            description: project.description,
            icon: project.icon,
            fav: project.fav,
        });
    };

    const handleDelete = (projectId) => {
        confirm({
            title: 'Are you sure you want to delete this project?',
            icon: <ExclamationCircleOutlined />,
            content: 'This action cannot be undone.',
            onOk: async () => {
                try {
                    await deleteProject(projectId);
                    message.success('Project deleted successfully');
                    fetchProjects();
                } catch (error) {
                    message.error('Failed to delete project');
                }
            },
        });
    };

    const handleEditSubmit = async () => {
        try {
            const values = await form.validateFields();

            await updateProject(currentProject._id, values);
            message.success('Project updated successfully');
            setIsModalVisible(false);
            fetchProjects();
            resetForm();
        } catch (error) {
            console.error("Edit error:", error);
            message.error('Failed to update project');
        }
    };

    const getActionMenu = (project) => (
        <Menu>
            <Menu.Item key="edit" onClick={() => handleEdit(project)}>
                Edit
            </Menu.Item>
            <Menu.Item key="delete" onClick={() => handleDelete(project._id)}>
                Delete
            </Menu.Item>
        </Menu>
    );
    const handleProjectClick = (item) => {
        navigate(`/project/${item._id}`);
    };
    // Fetch projects
    const fetchProjects = async () => {
        try {
            const response = await fetchAllProjects();
            setProjects(response);
        } catch (error) {
            console.error(error);
            message.error('Failed to load projects');
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    // Show modal
    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleMenuClick = (key) => {
        setSelectedKey(key);
    };

    const handleProjectItemClick = (item) => {
        setSelectedKey(item._id); // Use project ID or unique key for selection
        handleProjectClick(item);
    };
    // Hide modal
    const handleCancel = () => {
        setIsModalVisible(false);
        setIsEditingProject(false);
        resetForm();
    };

    // Reset form
    const resetForm = () => {
        form.resetFields();
    };

    // Submit project
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            setLoading(true);
            const response = await addProject(values);
            setProjects([...projects, response]);
            message.success('Project added successfully!');
            setIsModalVisible(false);
            resetForm();
        } catch (error) {
            console.error(error);
            message.error('Failed to add project.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Sider width={300} style={{ background: '#fff', padding: '10px' }}>
            <Menu mode="inline"  selectedKeys={[selectedKey]} defaultSelectedKeys={['today']} style={{ borderRight: 0 }}>
                <Menu.Item key="today" icon={<Icons.ScheduleOutlined />} onClick={() => handleMenuClick('today')}>
                    <Link to="/today">Today</Link>
                </Menu.Item>
                <Menu.Item key="upcoming" icon={<Icons.ClockCircleOutlined />} onClick={() => handleMenuClick('upcoming')}>
                    <Link to="/upcoming">Upcoming</Link>
                </Menu.Item>
                <Menu.Item key="backlog" icon={<Icons.FileTextOutlined />} onClick={() => handleMenuClick('backlog')}>
                    <Link to="/backlog">Backlog</Link>
                </Menu.Item>
            </Menu>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <Text strong style={{ fontSize: '16px' }}>My Projects</Text>
                <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={showModal} />
            </div>

            {/* Project List */}
            {projects && (
                <List
                    itemLayout="horizontal"
                    dataSource={projects}
                    renderItem={(item) => {
                        const IconComponent = Icons[item.icon];
                        return (
                            <List.Item
                                style={{
                                    cursor: 'pointer',
                                    background: selectedKey === item._id ? '#e6f7ff' : 'transparent',
                                    borderRadius: '4px',
                                    padding: '8px',
                                }}
                                onClick={() => handleProjectItemClick(item)}
                                actions={[
                                    <Dropdown overlay={getActionMenu(item)} trigger={['hover']}>
                                        <MoreOutlined style={{ fontSize: '18px', cursor: 'pointer' }} />
                                    </Dropdown>,
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={
                                        IconComponent ? (
                                            <IconComponent style={{ fontSize: '20px', color: '#1890ff' }} />
                                        ) : null
                                    }
                                    title={
                                        <Text>
                                            {item.name}
                                            {item.fav ? (
                                                <StarFilled style={{ color: '#fadb14', marginLeft: '8px' }} />
                                            ) : null}
                                        </Text>
                                    }
                                />
                            </List.Item>
                        );
                    }}
                />
            )}


            {/* Add/Edit Project Modal */}
            <Modal
                title={isEditingProject ? "Edit Project" : "Add New Project"}
                open={isModalVisible}
                onOk={isEditingProject ? handleEditSubmit : handleSubmit}
                onCancel={handleCancel}
                okText={isEditingProject ? "Save" : "Add"}
                confirmLoading={loading}
            >
                <Form form={form} layout="horizontal">
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Please enter the project name' }]}
                    >
                        <Input placeholder="Project Name" disabled={isEditingProject}/>
                    </Form.Item>
                    <Form.Item
                        name="description"
                    >
                        <Input.TextArea placeholder="Project Description" />
                    </Form.Item>
                    <Form.Item
                        name="icon"
                        rules={[{ required: true, message: 'Please select an icon' }]}
                    >
                        <Select placeholder="Select an Icon">
                            {iconOptions.map((icon) => (
                                <Option key={icon} value={icon}>
                                    {React.createElement(Icons[icon])} {icon}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="fav" label="Favorite" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </Sider>
    );
};

export default Sidebar;
