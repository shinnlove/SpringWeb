import React from 'react';
import {Button, Form, Card, Input, Table, Row, Col, Popconfirm, Tooltip, Icon, message, DatePicker,Progress, Select} from 'antd';
import tools from '../common/tools.js';

const FormItem = Form.Item;

let MyDetailPage = React.createClass({

    getInitialState: function () {
        return {
            id: this.props.params.id, // 传入的id参数
            loading: true,
            info: {} // 这条详情html数据，查询出来
        }
    },

    componentDidMount: function () {
        // 做请求
        // message.info("请求id="+this.state.id+"的数据");
        let query = {
            id: this.state.id
        }, params = {
            paramKey: JSON.stringify(query),
        }, _self = this;

        let url = "crawler/webDataDetail.json",
            opts = {
                loadingMsg: "查询数据中...",
                noMsg: true, // 不要成功或错误的解析信息
                type: "GET",
                "success": function (resp) {
                    // console.log("success:" + JSON.stringify(resp) + ".");

                    // 此处兼容服务端请求
                    if (resp.errCode == 0) {
                        // 查询业务成功 data是英语复数

                        // 查询成功
                        _self.setState({
                            info: resp.data,
                            loading: false
                        });
                    } else {
                        // 查询业务失败
                        _self.setState({
                            info: {},
                            loading: false
                        });
                    }

                },
                "error": function (XHR, status, error) {
                    // 查询失败
                    _self.setState({
                        info: {},
                        loading: false
                    });
                    message.error("webData查询失败。");
                }
            }; // 请求选项
        tools.ajax(url, params, opts);

    },

    closePage: function () {
        window.close();
        // window.history.go(-1); // 回退一格
    },

    formatDate: function (timestamp) {
        let oneDate = new Date();
        oneDate.setTime(timestamp);
        return oneDate.toLocaleString();
    },

    render: function () {

        if (this.state.loading) {
            return (<div>
                数据加载中...
            </div>);
        } else {
            // 数据库里查询info
            let info = this.state.info;

            // 转换日期
            let collectTime = this.formatDate(info.collecttime);
            let pubtime = this.formatDate(info.pubtime)

            // console.log(info);

            // 要塞入content的变量
            let dangerousHtml = {__html: info.content };

            return (
                <div className="wrapper round">
                    <header className="header clearfix">
                        <h1>{info.title}</h1>
                        {/*<hr/>*/}
                        {/*<div className="header-append">*/}
                            {/*<span>发布人：<em>{info.author}</em></span>*/}
                            {/*<span>发布时间：<em>{pubtime}</em></span>*/}
                            {/*<span>发布机构：<em>{info.spidername}</em></span>*/}
                            {/*<span>地域：<em>{info.area}</em></span>*/}
                        {/*</div>*/}
                    </header>
                    <content className="clearfix">
                        <div className="crawler-detail round" dangerouslySetInnerHTML={dangerousHtml}>
                            {/*<!-- 插入内容begin -->*/}
                            {/*<!-- 插入内容end -->*/}
                        </div>
                        <div className="content-append clearfix">
                            <span>地域：<em>{info.area}</em></span>
                            <span>发布来源：<em>{info.source}</em></span>
                        </div>
                    </content>
                    <footer className="footer">
                        <Button type="primary" htmlType="button" className={'common-btn'} onClick={this.closePage}>关闭</Button>
                    </footer>
                </div>
            );
        }
    }
});

export default MyDetailPage;