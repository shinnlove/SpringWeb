import React from 'react';
import {Button, Modal, message, Tabs} from 'antd';
import MyPage from './MyPage';
import img from '../../images/logo.png'

const TabPane = Tabs.TabPane;

let FirstTry = React.createClass({

    getInitialState: function () {
        return {
            visible: false
        };
    },

    showModal: function () {
        this.setState({
            visible:true
        });
    },

    closeModal: function () {
        this.setState({
            visible:false
        });
    },

    handleOk:function () {
        message.info("我是胡睿，点了确定，开始执行ajax");
        this.closeModal();
    },

    handleCancel: function () {
        message.warn("你居然取消了，不执行ajax");
        this.closeModal();
    },

    // tabChange: function (key) {
    //     message.info("切换到第"+key+"页。");
    // },

    render: function () {
        return (
            <div>
                {/*<Button type="primary" onClick={this.showModal}>打开对话框</Button>*/}
                {/*<Modal title="高级胡睿Modal" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>*/}
                    {/*<p>我是胡睿</p>*/}
                    {/*<p>我在学习react和antd</p>*/}
                    {/*<p>其实也是蛮简单的</p>*/}
                {/*</Modal>*/}

                <div style={{position:"relative"}}>
                    <img src={img} style={{display:"inline-block"}}/>
                    <h1 style={{display:"inline-block", marginLeft:"20px", position:"absolute", top:"10px"}}>中国移动交流网站</h1>
                </div>

                <Tabs defaultActiveKey="1" onChange={this.tabChange}>
                    <TabPane tab="最新通知" key="1">
                        <MyPage name="标题" type="cmccyz_n"/>
                    </TabPane>
                    <TabPane tab="最新调查" key="2">
                        <MyPage name="调查主题" type="cmccyz"/>
                    </TabPane>
                </Tabs>

            </div>
        );
    }

});

export default FirstTry;