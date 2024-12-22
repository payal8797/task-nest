import React from 'react';
import { Row, Col } from 'antd';
import PerformanceAnalytics from '../components/PerformanceAnalytics';
import Notifications from '../components/Notifications';

const Dashboard = () => {
    return (
        <div style={{ padding: '24px' }}>
            <Row gutter={[24, 24]}>
                <Col span={12}>
                    <PerformanceAnalytics />
                </Col>
                <Col span={12}>
                    <Notifications />
                </Col>
                
            </Row>
        </div>
    );
};

export default Dashboard;
