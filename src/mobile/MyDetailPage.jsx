import React from 'react';
import {Button, Form, Card, Input, Table, Row, Col, Popconfirm, Tooltip, Icon, message, DatePicker,Progress, Select} from 'antd';
import tools from '../common/tools.js';

const FormItem = Form.Item;

let MyDetailPage = React.createClass({
    render: function () {

        return(
            <div style={{ background: '#ECECEC', padding: '30px' }}>

                {/*********标题**********/}
                <Row gutter={16}>
                    <Col span={8}>
                        <Card title="标题" bordered={true}>Card content</Card>
                    </Col>
                </Row>
                {/*发布人 + 发布时间*/}
                <Row gutter={16}>
                    <Col span={8}>
                        <Card title="发布人" bordered={false}>Card content</Card>
                    </Col>
                    <Col span={8}>
                        <Card title="发布时间" bordered={false}>Card content</Card>
                    </Col>
                </Row>
                {/*发布机构+地域*/}
                <Row gutter={16}>
                    <Col span={8}>
                        <Card title="发布机构" bordered={false}>Card content</Card>
                    </Col>
                    <Col span={8}>
                        <Card title="地域" bordered={false}>Card content</Card>
                    </Col>
                </Row>
                {/*内容：*/}
                <Row gutter={16}>
                    <Col span={8}>
                        <Card title="内容" bordered={false}>Card content</Card>
                    </Col>
                </Row>
                {/*发布来源：*/}
                <Row gutter={16}>
                    <Col span={8}>
                        <Card title="发布来源" bordered={false}>Card content</Card>
                    </Col>
                </Row>
                {/*回复数+阅读数*/}
                <Row gutter={16}>
                    <Col span={8}>
                        <Card title="回复数" bordered={false}>Card content</Card>
                    </Col>
                    <Col span={8}>
                        <Card title="阅读数" bordered={false}>Card content</Card>
                    </Col>
                </Row>
            </div>

        )
    }
})

MyDetailPage = Form.create()(MyDetailPage);
export default MyDetailPage;