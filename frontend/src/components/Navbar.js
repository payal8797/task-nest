import React from 'react';
import { Layout, Typography } from 'antd';
import { Link } from 'react-router-dom';

const { Header } = Layout;
const { Title } = Typography;

const Navbar = () => {
    return (
        <Header style={{ background: '#001529', padding: '0 20px', display: 'flex', alignItems: 'center' }}>
            <Title level={3} style={{ color: '#fff', margin: 0 }}>
                <Link to="/today" style={{ color: '#fff', textDecoration: 'none' }}>
                    Todo App
                </Link>
            </Title>
        </Header>
    );
};

export default Navbar;
