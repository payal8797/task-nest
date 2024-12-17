import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Modal, Input, Form, Dropdown, Menu, message, Space, Row, Select, DatePicker, Card, Tag } from 'antd';
import { PlusOutlined, MoreOutlined, CalendarOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { fetchProjectDetails } from '../api/projectAPI';
import {
    fetchTasksByProject,
    createTask,
    updateTask,
    deleteTask,
} from '../api/taskAPI';
import moment from 'moment';
import '../App.css';

const ProjectDetails = () => {
    const { id } = useParams();
    const [projectDetails, setProjectDetails] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [taskForm] = Form.useForm();
    const [editingTaskId, setEditingTaskId] = useState(null);
    const { Option } = Select;
    const { confirm } = Modal;

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
            overlay={<Menu>
                <Menu.Item 
                    key="edit" 
                    onClick={() => {
                        setEditingTaskId(task._id);
                        handleEditTask(task);
                    }}
                >
                    Edit
                </Menu.Item>
                <Menu.Item key="delete" onClick={() => handleDeleteTask(task._id)}>
                    Delete
                </Menu.Item>
            </Menu>}
            trigger={['hover']}
        >
            <MoreOutlined style={{ cursor: 'pointer' }} />
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

        </div>
    );
};

export default ProjectDetails;
