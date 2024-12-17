import React, {useEffect, useState} from 'react';
import { message } from 'antd';
import { fetchBacklogTasks } from '../api/taskAPI';
import ViewTasks from '../components/ViewTasks';

const Backlog = () => {
    const [tasks, setTasks] = useState([])
    const fetchTasks = async () => {
        try {
            const response = await fetchBacklogTasks();
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
            heading="Backlog Tasks: Catch Up and Clear the Deck"
            description="Here are the tasks that have slipped through the cracks. Let’s take charge, revisit, and complete these tasks to keep your projects on track and stress-free!"
            tasks={tasks}
            type='backlog'
            />
    );
};

export default Backlog;
