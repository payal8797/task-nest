import React, { useEffect, useState } from 'react';
import { Card, Spin } from 'antd';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { fetchAllTasks } from '../api/taskAPI';

const COLORS = ['#FF6B6B', '#FFD93D', '#6BCB77'];

const PerformanceAnalytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetchAllTasks();
                const tasks = response;

                const priorityData = [
                    { name: 'High Priority', value: tasks.filter(task => task.priority === 'high').length },
                    { name: 'Medium Priority', value: tasks.filter(task => task.priority === 'medium').length },
                    { name: 'Low Priority', value: tasks.filter(task => task.priority === 'low').length },
                ];

                const statusData = [
                    { name: 'To Do', value: tasks.filter(task => task.status === 'todo').length },
                    { name: 'In Progress', value: tasks.filter(task => task.status === 'inprogress').length },
                    { name: 'Completed', value: tasks.filter(task => task.status === 'done').length },
                ];

                const overdueCount = tasks.filter(task => new Date(task.dueDate) < new Date()).length;

                setData({ priorityData, statusData, overdueCount });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching tasks:', error);
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    if (loading) {
        return <Spin />;
    }

    return (
        <Card title="Performance Analytics" bordered style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ marginBottom: '24px' }}>
                <h3 style={{ color: '#333', fontSize: '18px' }}>Task Priority Distribution</h3>
                <PieChart width={800} height={300}>
                    <Pie
                        data={data?.priorityData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        innerRadius={60}
                        label={({ name, value }) => `${name}: ${value}`}
                        fill="#8884d8"
                        stroke="#fff"
                        strokeWidth={2}
                    >
                        {data?.priorityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} tasks`} />
                    <Legend verticalAlign="bottom" align="center" />
                </PieChart>
                <p style={{ textAlign: 'center', marginTop: '10px', color: '#666' }}>
                    This chart shows the number of tasks categorized by their priority levels.
                </p>
            </div>
            <div style={{ marginBottom: '24px' }}>
                <h3 style={{ color: '#333', fontSize: '18px' }}>Task Status Overview</h3>
                <BarChart width={500} height={300} data={data?.statusData} barSize={50}>
                    <XAxis dataKey="name" tick={{ fontSize: 14 }} />
                    <YAxis tick={{ fontSize: 14 }} />
                    <Tooltip formatter={(value) => `${value} tasks`} />
                    <Legend verticalAlign="top" align="center" />
                    <Bar dataKey="value" fill="#1890FF" radius={[10, 10, 0, 0]} />
                </BarChart>
                <p style={{ textAlign: 'center', marginTop: '10px', color: '#666' }}>
                    This chart illustrates the number of tasks grouped by their current status.
                </p>
            </div>
            <div>
                <h3 style={{ color: '#333', fontSize: '18px' }}>Overdue Tasks</h3>
                <div
                    style={{
                        textAlign: 'center',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: data?.overdueCount > 0 ? '#FF6B6B' : '#6BCB77',
                        marginTop: '10px',
                    }}
                >
                    {data?.overdueCount} tasks are overdue.
                </div>
            </div>
        </Card>
    );
};

export default PerformanceAnalytics;
