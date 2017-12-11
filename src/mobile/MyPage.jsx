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
            loading: true,
            visible: false,
            // 全局变量，防止变态乱来，点了按钮才改变查询条件，否则随便你怎么搞都不变化
            title: "",
            publisher: "",
            content: "",
            startTime: "",
            endTime: ""
        };

    },

    componentDidMount: function () {
        this.loadData(true);
    },

    /**
     * 点了按钮后改变状态、再查询数据。
     **/
    queryData: function () {
        let _self = this;
        let currentCondition = this.props.form.getFieldsValue(); // 当前表单状态
        if (typeof currentCondition.time != "undefined" && typeof currentCondition.time.length != "undefined" && typeof currentCondition.time != "") {
            currentCondition.startTime = currentCondition.time[0].format('YYYY-MM-DD ') + '00:00:00';
            currentCondition.endTime = currentCondition.time[1].format('YYYY-MM-DD ') + '23:59:59';
            // 带时间改变
            _self.setState({
                title: currentCondition.title,
                publisher: currentCondition.publisher,
                content: currentCondition.content,
                startTime: currentCondition.startTime,
                endTime: currentCondition.endTime,
                currentPageNo: 1, // 只要点查询按钮就第一页
                loading:true
            });
        } else {
            // 不带时间改变
            _self.setState({
                title: currentCondition.title,
                publisher: currentCondition.publisher,
                content: currentCondition.content,
                currentPageNo: 1, // 只要点查询按钮就第一页
                loading:true
            });
        }

        // loading=true的时候，开始查询，延时200毫秒保证state变化
        setTimeout(function () {
            _self.loadData(false);
        }, 200);
    },

    handleSelect: function(record, selected, selectedRows) {
        // this.viewPlan(record);
    },

    loadData: function (loadAll) {
        let _self = this, query = {};
        if (loadAll) {
            query.title = "";
            query.publisher = "";
            query.content = "";
            query.startTime = "";
            query.endTime = "";
        } else {
            query.title = this.state.title;
            query.publisher = this.state.publisher;
            query.content = this.state.content;
            query.startTime = this.state.startTime;
            query.endTime = this.state.endTime;
        }

        // 再打上页数
        query.pageNo = this.state.currentPageNo;
        query.pageSize = this.state.currentPageSize;
        //  加上查询类型
        query.spidername = this.props.type;

        console.log("请看查询条件："+JSON.stringify(query));

        var params = {
            paramKey: JSON.stringify(query)
        };
        let url = "crawler/webDataList.json",
            opts = {
                loadingMsg: "查询数据中...",
                noMsg: true, // 不要成功或错误的解析信息
                type: "GET",
                "success": function (resp) {
                    // console.log("success:" + JSON.stringify(resp) + ".");

                    // 此处兼容服务端请求
                    if (resp.errCode == 0) {
                        // 查询业务成功 data是英语复数

                        // 转换日期
                        for (var i = 0; i < resp.data.length; i++) {
                            // var oneDate = new Date();
                            // oneDate.setTime(resp.data[i].pubtime);
                            // resp.data[i].pubtime = oneDate.toLocaleString();
                            // console.log("this is old time" + resp.data[i].pubtime);
                            var pubtime = new Date(resp.data[i].pubtime),
                                y = pubtime.getFullYear(),
                                m = pubtime.getMonth() + 1,
                                d = pubtime.getDate();
                            resp.data[i].pubtime = y + "-" + (m < 10 ? "0" + m :m) +"-" + (d<10?"0"+d:d)+"  "
                                + pubtime.toTimeString().substr(0,8);
                            // console.log("this is new time" + resp.data[i].pubtime);
                        }

                        // 查询成功
                        _self.setState({
                            columnData: resp.data,
                            columnDataAfterFilter:resp.data,
                            totalCount:resp.total,
                            loading: false
                        });
                    } else {
                        // 查询业务失败
                        _self.setState({
                            columnData: [],
                            columnDataAfterFilter:[],
                            totalCount:0,
                            loading: false
                        });
                    }

                },
                "error": function (XHR, status, error) {
                    // 查询失败
                    _self.setState({
                        columnData: [],
                        columnDataAfterFilter:[],
                        totalCount:0,
                        loading: false
                    });
                    message.error("预案webData查询失败。");
                }
            }; // 请求选项
        tools.ajax(url, params, opts);
    },

    viewPlan: function (record) {
        window.open("#/webdata/detail/" + record.id); // 打开标签卡
        // window.location.hash = "#/webdata/detail/" + record.id; // 打开预览
    },

    onPagiChange:function (page,pageSize) {
        let _self = this;
        // 分页器改变页数改变控件内全局变量
        _self.setState({
            currentPageNo:page,
            currentPageSize:pageSize
        });
        // 重新请求数据
        setTimeout(function () {
            _self.loadData();
        }, 100);
    },

    onPagiShowSizeChange: function (current, size) {
        let _self = this;
        // 当前页和每页大小
        _self.setState({
            currentPageNo:current,
            currentPageSize:size
        });
        // 重新请求数据
        setTimeout(function () {
            _self.loadData();
        }, 100);
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
            width: '10%',
        },{
            title: this.props.name,
            dataIndex: 'title',
            width: '40%',
        },{
            title: '发布人',
            dataIndex: 'author',
            width: '20%',
        },{
            title: '发布时间',
            dataIndex: 'pubtime',
            width: '20%',
        },
        {
            title: '操作',
            dataIndex: 'operator',
            key: 'operator',
            width: '10%',
            render: (text, record) => {
                return (
                    <div>
                        <Tooltip title="预览详情">
                            <Icon type="mail" style={{ fontSize: 20}} className="icon-2x mr10" onClick={this.viewPlan.bind(this, record)}/>
                        </Tooltip>
                    </div>
                )
            }
        }];

        // 处理选择
        const rowSelection = {
            onSelect:this.handleSelect,
        };

        let titleName = this.props.name;
        let titleholder = "请输入" + this.props.name;

        // let total = this.state.total;
        let pagination = {
            simple:false,
            total: this.state.totalCount, //总共
            defaultCurrent: 1, // 默认第一页
            defaultPageSize: 10, // 默认每页10条
            current: this.state.currentPageNo,
            pageSize: this.state.currentPageSize,
            pageSizeOptions: ['10', '20', '30', '40', '50'], // 指定每页可以显示多少条
            showQuickJumper: true, // 可以快速跳转某一页
            showSizeChanger: true, // 可以改变页数
            onChange: this.onPagiChange,
            onShowSizeChange: this.onPagiShowSizeChange, // 改变页码事件
        }

        return (
            <div>

                <Form horizontal className="ant-advanced-search-form">

                    <Row>
                        <Col span={6} >
                            <FormItem {...formItemLayout2} label={titleName}>
                                {getFieldDecorator('title')(<Input placeholder={titleholder} style={{width: '100%'}}/>)}
                            </FormItem>
                        </Col>
                        <Col span={6} offset={2}>
                            <FormItem {...formItemLayout2} label="发布人：">
                                {getFieldDecorator('publisher')(<Input placeholder="请输入发布人" style={{width: '100%'}}/>)}
                            </FormItem>
                        </Col>
                        {/*<Col span={6} offset={1}>*/}
                            {/*<FormItem {...formItemLayout} label="发布机构：">*/}
                                {/*{getFieldDecorator('publishInst')(<Input placeholder="请输入发布机构" style={{width: '100%'}}/>)}*/}
                            {/*</FormItem>*/}
                        {/*</Col>*/}
                    </Row>

                    <Row>
                        <Col span={6} >
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
                            <Button type="primary" htmlType="button" className={'common-btn'} loading={this.state.loading} onClick={this.queryData}>查询</Button>
                        </Col>
                    </Row>
                </Form>

                <Table rowKey={record => record.id} columns={columns}
                       dataSource={this.state.columnDataAfterFilter} size="middle" loading={this.state.loading} pagination={pagination} />
            </div>
        );
    }

});

MyPage = Form.create()(MyPage);
export default MyPage;