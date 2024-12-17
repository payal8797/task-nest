import React, {useEffect, useState} from 'react';
import { message } from 'antd';
import { fetchDueTodayTasks } from '../api/taskAPI';
import ViewTasks from '../components/ViewTasks';

const Today = () => {
    const [tasks, setTasks] = useState([])
    const fetchTasks = async () => {
        try {
            const response = await fetchDueTodayTasks();
            setTasks(response);
        } catch (error) {
            console.error(error);
            message.error('Failed to load projects');
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);
    return (
        <ViewTasks 
            heading="Today's Tasks: Stay Focused, Stay Productive" 
            description="Here’s a list of all the tasks that need your attention today. Let’s tackle them one at a time and make the most of your day. Stay organized and check them off as you go!"
            tasks={tasks}
            type='today'
            />
    );
};

export default Today;
