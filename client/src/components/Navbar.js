import React from 'react';
import { Layout, Typography } from 'antd';
import { Link } from 'react-router-dom';

const { Header } = Layout;
const { Title } = Typography;

const Navbar = () => {
    return (
        <Header
            style={{
                background: '#282c34',
                padding: '0 30px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                height: '70px',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Title
                    level={3}
                    style={{
                        color: '#fff',
                        margin: 0,
                        fontWeight: 'bold',
                        fontSize: '28px',
                        letterSpacing: '1px',
                        fontFamily: "'Roboto', sans-serif",
                    }}
                >
                    <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>
                        TaskNest
                    </Link>
                </Title>
            </div>
        </Header>
    );
};

export default Navbar;
