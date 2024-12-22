import React, { useEffect, useState } from 'react';
import { Card, Calendar, Badge, Spin } from 'antd';
import {fetchAllTasks} from '../api/taskAPI';

const CalendarView = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetchAllTasks();
                setTasks(response);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching calendar tasks:', error);
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const getListData = (value) => {
        const dateStr = value.format('YYYY-MM-DD');
        const dayTasks = tasks.filter(task => new Date(task.dueDate).toISOString().startsWith(dateStr));
        return dayTasks.map(task => ({ type: 'warning', content: task.name }));
    };

    const dateCellRender = (value) => {
        const listData = getListData(value);
        return (
            <ul style={{ padding: 0, listStyle: 'none' }}>
                {listData.map((item, index) => (
                    <li key={index}>
                        <Badge status={item.type} text={item.content} />
                    </li>
                ))}
            </ul>
        );
    };

    if (loading) {
        return <Spin />;
    }

    return (
        <Card title="Calendar View" bordered>
            <Calendar cellRender={dateCellRender} />
        </Card>
    );
};

export default CalendarView;
