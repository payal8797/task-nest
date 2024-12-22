import React, {useEffect, useState} from 'react';
import { message } from 'antd';
import { fetchUpcomingTasks } from '../api/taskAPI';
import ViewTasks from '../components/ViewTasks';

const Upcoming = () => {

    const [tasks, setTasks] = useState([])
    const fetchTasks = async () => {
        try {
            const response = await fetchUpcomingTasks();
            console.log("response1", response)
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
            heading="Upcoming Tasks: Plan Ahead, Stay Ahead" 
            description="These are the tasks scheduled for the coming days. Get a head start by planning ahead and managing your priorities effectively. A little preparation today leads to a smoother tomorrow!" 
            tasks={tasks}
            type='upcoming'
            />
    );
};

export default Upcoming;
