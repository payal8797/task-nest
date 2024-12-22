import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Modal, Input, Radio, Form, Dropdown, Menu, message, Space, Row, Select, DatePicker, Card, Tag } from 'antd';
import { PlusOutlined, MoreOutlined, CalendarOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { fetchProjectDetails } from '../api/projectAPI';
import {
    fetchTasksByProject,
    createTask,
    updateTask,
    deleteTask,
    duplicateTaskInSameProject,
    duplicateTaskToAnotherProject,
    moveTaskToAnotherProject,
} from '../api/taskAPI';
import {fetchAllProjects} from '../api/projectAPI';
import moment from 'moment';
import '../App.css';

const ProjectDetails = () => {
    const { id } = useParams();
    const [projectDetails, setProjectDetails] = useState(null);
    const [allProjectsList, setAllProjectsList] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [taskId, setTaskId] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isTaskCopyOrMove, setIsTaskCopyOrMove] = useState('');
    const [allProjectsModal, setViewAllProjectsModal] = useState(false);
    const [taskForm] = Form.useForm();
    const [editingTaskId, setEditingTaskId] = useState(null);
    const { Option } = Select;
    const { confirm } = Modal;
    const [selectedProject, setSelectedProject] = useState('');

    const onChange = (e) => {
      setSelectedProject(e.target.value);
    };
    // Fetch project details and tasks
    useEffect(() => {
        const loadData = async () => {
            try {
                const projectData = await fetchProjectDetails(id);
                setProjectDetails(projectData);

                const tasksData = await fetchTasksByProject(id);
                setTasks(tasksData);
            } catch (error) {
                console.error(error.message);
                message.error("Failed to load data");
            }
        };

        loadData();
    }, [id]);

    // Handle modal open/close
    const showModal = () => {
        setEditingTaskId(null);
        taskForm.resetFields();
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const closeViewAllProjectsModal = () => {
        setViewAllProjectsModal(false)
    };

    useEffect(() => {
        const allProjects = async () => {
            try {
                const projectsList = await fetchAllProjects();
                setAllProjectsList(projectsList);
            } catch (error) {
                console.error(error.message);
                message.error("Failed to load data");
            }
        };

        allProjects();
    }, [allProjectsModal]);
    // Add or Edit Task
    const handleTaskSubmit = async (values) => {
        console.log("editingTaskId", values)
        try {
            if (editingTaskId) {
                const updatedTask = await updateTask(editingTaskId, { ...values, project: id });
                setTasks((prev) =>
                    prev.map((task) => (task._id === editingTaskId ? updatedTask : task))
                );
                message.success("Task updated successfully!");
            } else {
                const newTask = await createTask({ ...values, project: id, status: 'todo' });
                console.log("newTask", newTask)
                setTasks((prev) => [...prev, newTask]);
                message.success("Task created successfully!");
            }
            closeModal();
        } catch (error) {
            console.error(error.message);
            message.error("Failed to save task.");
        }
    };
    // Delete Task
    const handleDeleteTask = (taskId) => {
        confirm({
            title: 'Are you sure you want to delete this task?',
            icon: <ExclamationCircleOutlined />,
            content: 'This action cannot be undone.',
            onOk: async () => {
                try {
                    await deleteTask(taskId);
                    message.success('Task deleted successfully');
                    setTasks((prev) => prev.filter((task) => task._id !== taskId));
                } catch (error) {
                    message.error('Failed to delete task');
                }
            },
        });
    };

    // duplicate task in same project
    const handleDuplicateTaskInSameProject = async (taskId) => {
        try {
            await duplicateTaskInSameProject(taskId);
            message.success("Task duplicated successfully!");
            const updatedTasks = await fetchTasksByProject(id);
            setTasks(updatedTasks);
        } catch (error) {
            console.error(error.message);
            message.error("Failed to duplicate task.");
        }
    };

    // copy or move task to another project
    const handleCopyOrMoveToAnotherProject = async () => {
        try {
            isTaskCopyOrMove === 'copy' && await duplicateTaskToAnotherProject(taskId,selectedProject );
            isTaskCopyOrMove === 'move' && await moveTaskToAnotherProject(taskId,selectedProject );
            message.success("Task duplicated successfully!");
            setViewAllProjectsModal(false);
        } catch (error) {
            console.error(error.message);
            message.error("Failed to duplicate task.");
        }
    };
    
    const copyOrMoveToAnotherProject = async (taskId, action) => {
        setViewAllProjectsModal(true);
        setTaskId(taskId);
        setIsTaskCopyOrMove(action);
    };
    

    // Edit Task
    const handleEditTask = (task) => {
        taskForm.setFieldsValue({
            name: task.name,
            description: task.description,
            dueDate: task.dueDate ? moment(task.dueDate) : null,
            priority: task.priority,
            status: task.status,
        });
        setIsModalVisible(true);
    };

    // Dropdown Menu for Edit/Delete
    const renderTaskActions = (task) => (
        <Space>

        <Space direction='vertical'>
            <Space style={{color: '#808080'}}> Status </Space>
            {task.status === 'todo' ? 
            <Tag color='red'>{'Todo'}</Tag>:task.status === 'inprogress' ? 
            <Tag color='blue'>{'In progress'}</Tag>:task.status === 'done' ? 
            <Tag color='green'>{'Done'}</Tag>: 'none'} 
        </Space>

        <Space direction='vertical'>
        <Space style={{color: '#808080'}}> Priority </Space>
        {task.priority === 'low' ? 
            <Tag color='green'>{'Low'}</Tag>:
        task.priority === 'medium' ? 
            <Tag color='blue'>{'Medium'}</Tag>:
        task.priority === 'high' ? 
            <Tag color='red'>{'High'}</Tag>: 
            'none'
        }
        </Space>
        <Dropdown
            overlay={
                <Menu>
                    <Menu.ItemGroup title="Modify Task">
                        <Menu.Item 
                            key="edit" 
                            onClick={() => {
                                setEditingTaskId(task._id);
                                handleEditTask(task);
                            }}
                            style={{ padding: '8px 16px' }}
                        >
                            ✏️ Edit
                        </Menu.Item>
                        <Menu.Item 
                            key="duplicateTaskInSameProject" 
                            onClick={() => handleDuplicateTaskInSameProject(task._id)} 
                            style={{ padding: '8px 16px' }}
                        >
                            📋 Duplicate
                        </Menu.Item>
                    </Menu.ItemGroup>

                    <Menu.Divider />

                    <Menu.ItemGroup title="Relocate Task">
                        <Menu.Item 
                            key="copyTaskToAnotherProject" 
                            onClick={() => copyOrMoveToAnotherProject(task._id, 'copy')} 
                            style={{ padding: '8px 16px' }}
                        >
                            📂 Copy to Another Project
                        </Menu.Item>
                        <Menu.Item 
                            key="moveTaskToAnotherProject" 
                            onClick={() => copyOrMoveToAnotherProject(task._id, 'move')} 
                            style={{ padding: '8px 16px' }}
                        >
                            🚚 Move to Another Project
                        </Menu.Item>
                    </Menu.ItemGroup>

                    <Menu.Divider />

                    <Menu.Item 
                        key="delete" 
                        onClick={() => handleDeleteTask(task._id)} 
                        style={{ padding: '8px 16px', color: 'red' }}
                    >
                        🗑️ Delete
                    </Menu.Item>
                </Menu>
            }
            trigger={['hover']}
        >
            <MoreOutlined 
                style={{ 
                    cursor: 'pointer', 
                    fontSize: '18px', 
                    color: '#333' 
                }} 
            />
        </Dropdown>

        </Space>
    );

    if (!projectDetails) {
        return <div>Loading...</div>;
    }
    const modalTitle = editingTaskId 
        ? "Edit Task" 
        : "Add Task";

    const okButtonText = editingTaskId 
        ? "Update Task" 
        : "Create Task";

    return (
        <div style={{ padding: '20px' }}>
        <Row justify={'space-between'} align={'middle'}> 
            <h1>{projectDetails.name}</h1>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={showModal}
                style={{ marginBottom: '20px' }}
            >
                Add Task
            </Button>
        </Row>
        <i>{projectDetails.description}</i>
        <br/>
        <br/>
        {tasks.map((task) => (
            <Card key={task._id} style={{marginBottom: '5px'}}>
                <Row align={'middle'} justify={'space-between'}>
                    {task.name}
                    {renderTaskActions(task)}
                </Row>
                <p><i> {task.description}</i></p>
                <CalendarOutlined/> {moment(task.dueDate).format('DD-MM-YYYY')}
            </Card>
        ))}


        {/* Task Modal */}
        <Modal
            title={modalTitle}
            open={isModalVisible}
            onCancel={closeModal}
            okText={okButtonText}
            onOk={async () => {
                try {
                    const values = await taskForm.validateFields();
                    handleTaskSubmit(values);
                } catch (error) {
                    console.error("Form validation failed:", error);
                }
            }}
        >
            <Form form={taskForm} layout="vertical">
                <Form.Item
                    name="name"
                    rules={[{ required: true, message: 'Please enter task name' }]}
                >
                    <Input placeholder="Enter task name" />
                </Form.Item>

                <Form.Item name="description">
                    <Input.TextArea placeholder="Enter task description" />
                </Form.Item>

                <Form.Item name="dueDate">
                    <DatePicker placeholder="Select Due Date" style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item name="priority">
                    <Select placeholder="Select Priority" >
                        <Option value="low">Low</Option>
                        <Option value="medium">Medium</Option>
                        <Option value="high">High</Option>
                    </Select>
                </Form.Item>

                {(editingTaskId) && (
                    <Form.Item name="status">
                        <Select placeholder="Select Status" >
                            <Option value="todo">Todo</Option>
                            <Option value="inprogress">In Progress</Option>
                            <Option value="done">Done</Option>
                        </Select>
                    </Form.Item>
                )}
            </Form>
        </Modal>
        <Modal 
            title={isTaskCopyOrMove === 'copy' ? "Copy Task to Another Project" : isTaskCopyOrMove === 'move' ? "Move Task to Another Project": 'Copy task'}
            open={allProjectsModal}
            onOk={handleCopyOrMoveToAnotherProject}
            onCancel={closeViewAllProjectsModal}
            okText={isTaskCopyOrMove === 'copy' ? "Copy Task" : isTaskCopyOrMove === 'move' ? 'Move Task' : 'Ok'}
            cancelText="Cancel"
            centered
        >
            <p style={{ marginBottom: '10px', color: '#555' }}>

            {isTaskCopyOrMove === 'copy' ? 
                "Select a project to which you want to copy this task. Your current project is excluded." : 
            isTaskCopyOrMove === 'move' ? 
                "Select a project to which you want to move this task. Your current project is excluded." : 
                'Select a project'
            }
            </p>
            <Radio.Group onChange={onChange} value={selectedProject} style={{ width: '100%' }}>
                <Space direction="vertical" size="middle">
                    {allProjectsList
                        .filter((project) => project._id !== id)
                        .map((project) => (
                            <Radio 
                                key={project._id} 
                                value={project._id}
                                
                            >
                                <span style={{ fontWeight: 500, color: '#333' }}>{project.name}</span>
                            </Radio>
                        ))}
                </Space>
            </Radio.Group>
        </Modal>

        </div>
    );
};

export default ProjectDetails;
