import React from 'react';
import {Button, Modal, message, Tabs} from 'antd';
import MyPage from './MyPage';

const TabPane = Tabs.TabPane;

let HelloOne = React.createClass({

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

    tabChange: function (key) {
        message.info("切换到第"+key+"页。");
    },

    render: function () {
        return (
            <div>
                这是helloOne的路由
            </div>
        );
    }

});

export default HelloOne;