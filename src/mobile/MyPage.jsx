import React from 'react';
import {Button, Form, Input, Table, Row, Col, Popconfirm, Tooltip, Icon, message, DatePicker,Progress, Select} from 'antd';
import tools from '../common/tools.js';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

let MyPage = React.createClass({

    getInitialState: function () {

        return {
            columnData: [],
            columnDataAfterFilter: [],
            planInfo: {},
            totalCount: 0,
            currentPageNo:1,
            currentPageSize:10,
            loading: false,
            visible: false
        };

    },

    componentDidMount: function () {
        this.loadData();
    },

    queryData: function () {
        this.loadData(false);
    },

    loadData: function (loadAll) {
        let _self = this, query;
        let spidername = this.props.type;
        if (!loadAll) {
            let queryCondition = this.props.form.getFieldsValue();
            queryCondition.title = queryCondition.title || "";
            queryCondition.publisher = queryCondition.publisher || "";
            queryCondition.publishInst = queryCondition.publishInst || "";
            queryCondition.content = queryCondition.content || "";
            if (typeof queryCondition.time != "undefined" && typeof queryCondition.time.length != "undefined") {
                queryCondition.startTime = queryCondition.time[0].format('YYYY-MM-DD ') + '00:00:00';
                queryCondition.endTime = queryCondition.time[1].format('YYYY-MM-DD ') + '23:59:59';
            }
            query = queryCondition;
        }
        // 再打上页数
        query.pageNo = this.state.currentPageNo;
        query.pageSize = this.state.currentPageSize;

        //  加上查询类型
        query.spidername = spidername;

        var params = {
            paramKey: JSON.stringify(query)
        };

        let url = "crawler/webDataList.json",
            opts = {
                loadingMsg: "查询预案数据中...",
                noMsg: true, // 不要成功或错误的解析信息
                type: "GET",
                "success": function (resp) {
                    // console.log("success:" + JSON.stringify(resp) + ".");

                    // 此处兼容服务端请求
                    if (resp.errCode == 0) {
                        // 查询业务成功 data是英语复数

                        // 查询成功
                        _self.setState({columnData: resp.data, columnDataAfterFilter:resp.data, loading: false, totalCount:resp.data.length});
                    } else {
                        // 查询业务失败
                        _self.setState({columnData: [], columnDataAfterFilter:[], loading: false, totalCount:0});
                    }

                },
                "error": function (XHR, status, error) {
                    // 查询失败
                    _self.setState({columnData: [], columnDataAfterFilter:[], loading: false, totalCount:0});
                    message.error("预案webData查询失败。");
                }
            }; // 请求选项
        tools.ajax(url, params, opts);
    },

    editPlanNode: function (record) {
        window.location.hash = "#/monitorConfig/emergencyPlan/PlanGlobalViewEdit/" + record.id; // 跳转编辑
    },

    viewPlan: function (record) {
        window.location.hash = "#/monitorConfig/emergencyPlan/PlanGlobalView/" + record.id; // 打开预览
    },

    editPlan: function (record) {
        // console.log("edit:" + record);
        this.setState({visible: true, planInfo: record});
    },

    onPagiChange:function (page,pageSize) {
        // 分页器改变页数改变控件内全局变量
        this.setState({
            currentPageNo:page,
            currentPageSize:pageSize
        });
    },

    cancelModal: function () {
        this.setState({visible: false});
    },

    cancelModalAndRefresh() {
        this.setState({visible: false});
        this.loadData();
    },

    render: function () {

        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16},
        };
        const formItemLayout2 = {
            labelCol: {span: 4},
            wrapperCol: {span: 20},
        };

        const {getFieldDecorator} = this.props.form;

        // 处理表头
        const columns = [ {
            title: '编号',
            dataIndex: 'id',
        },{
            title: this.props.name,
            dataIndex: 'title',
        },{
            title: '发布人',
            dataIndex: 'author',
        },{
            title: '发布机构',
            dataIndex: 'medianame',
        },{
            title: '发布时间',
            dataIndex: 'pubtime',
        },
        {
            title: '操作',
            dataIndex: 'operator',
            key: 'operator',
            width: 200,
            render: (text, record) => {
                return (
                    <div>
                        <Tooltip title="预览详情">
                            <Icon type="eye-o" className="icon-2x mr10" onClick={this.viewPlan.bind(this, record)}/>
                        </Tooltip>
                    </div>
                )
            }
        }];

        let titleName = this.props.name;
        let titleholder = "请输入" + this.props.name;

        // let total = this.state.total;
        let pagination = {
            simple:true,
            onChange: this.onPagiChange,
            total: this.state.totalCount, //总共
            defaultCurrent: 1 //第一页
        }

        return (
            <div>

                <Form horizontal className="ant-advanced-search-form">

                    <Row>
                        <Col span={6}>
                            <FormItem {...formItemLayout2} label={titleName}>
                                {getFieldDecorator('title')(<Input placeholder={titleholder} style={{width: '100%'}}/>)}
                            </FormItem>
                        </Col>
                        <Col span={6} offset={1}>
                            <FormItem {...formItemLayout} label="发布人：">
                                {getFieldDecorator('publisher')(<Input placeholder="请输入发布人" style={{width: '100%'}}/>)}
                            </FormItem>
                        </Col>
                        <Col span={6} offset={1}>
                            <FormItem {...formItemLayout} label="发布机构：">
                                {getFieldDecorator('publishInst')(<Input placeholder="请输入发布机构" style={{width: '100%'}}/>)}
                            </FormItem>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={6}>
                            <FormItem {...formItemLayout2} label="正文：">
                                {getFieldDecorator('content')(<Input placeholder="请输入关键字" style={{width: '100%'}}/>)}
                            </FormItem>
                        </Col>
                        <Col span={6} offset={2}>
                            <FormItem {...formItemLayout2} label="发布时间:">
                                {getFieldDecorator('time')(
                                    <RangePicker
                                        size="small"
                                        showTime={{format: 'YYYY-MM-DD'}}
                                        format="YYYY-MM-DD"
                                        placeholder={['Start Time', 'End Time']}/>)}
                            </FormItem>
                        </Col>
                        <Col span={6} offset={4}>
                            <Button type="primary" htmlType="button" className={'common-btn'} onClick={this.queryData}>查询</Button>
                        </Col>
                    </Row>
                </Form>

                <Table rowKey={record => record.id} columns={columns}
                       dataSource={this.state.columnDataAfterFilter} size="middle" loading={this.state.loading} pagination={pagination}/>
            </div>
        );
    }

});

MyPage = Form.create()(MyPage);
export default MyPage;