import React, { useEffect, useState } from 'react';
import { Card, List, Spin } from 'antd';
import {fetchDueTodayTasks} from '../api/taskAPI';

const Notifications = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDueTasks = async () => {
            try {
                const response = await fetchDueTodayTasks();
                setTasks(response);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching notifications:', error);
                setLoading(false);
            }
        };

        fetchDueTasks();
    }, []);

    if (loading) {
        return <Spin />;
    }

    return (
        <Card title={<div>Notifications <i style={{color: 'gray'}}>(Tasks that are due today are listed here)</i></div>} bordered>
            <List
                dataSource={tasks}
                renderItem={task => (
                    <List.Item>
                        <strong>{task.name}</strong>
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default Notifications;
