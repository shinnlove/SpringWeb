import React from 'react';
import {Button, Form, Card, Input, Table, Row, Col, Popconfirm, Tooltip, Icon, message, DatePicker,Progress, Select} from 'antd';
import tools from '../common/tools.js';

const FormItem = Form.Item;

let MyDetailPage = React.createClass({

    getInitialState: function () {
        return {
            id: this.props.params.id, // 传入的id参数
            info: {} // 这条详情html数据，查询出来
        }
    },

    componentDidMount: function () {
        // 做请求
        message.info("请求id="+this.state.id+"的数据");

        let fuck = "我艹"+'<table align="center" border="1" cellpadding="4" cellspacing="0" width="100%">\n' +
            '<tr>\n' +
            '<th colspan="4">关于请各省做好咪咕包月业务封存遗留问题处理工作的通知</th>\n' +
            '</tr>\n' +
            '<tr>\n' +
            '<td width="80">发布人：</td>\n' +
            '<td width="130">余兆成</td>\n' +
            '<td width="60">发布时间：</td>\n' +
            '<td width="130">2017-9-5 11:02:00</td>\n' +
            '</tr>\n' +
            '<tr id="f1">\n' +
            '<td width="80">附 件：</td>\n' +
            '<td colspan="3" width="480"><a href="/Attachments_Upload/JLWZ_Notify/%7B89EC9EF1-D50C-42C5-AE9B-559CDD15D73C%7D/%E5%92%AA%E5%92%95%E5%8C%85%E6%9C%88%E4%B8%9A%E5%8A%A1%E5%B0%81%E5%AD%98%E8%B7%9F%E8%B8%AA%E8%A1%A8.docx" target="_blank"><img src="http://218.206.191.179/public/cmschema/Notify/images/clip.gif"/>咪咕包月业务封存跟踪表.docx</a>(14.15KB)</td>\n' +
            '</tr>\n' +
            '<tr id="f2"><td>分省附件列表</td><td colspan="3">\n' +
            '<script>document.getElementById(\'f2\').style.display=\'none\';</script>\n' +
            '</td></tr>\n' +
            '<tr>\n' +
            '<td width="80">接收省：</td>\n' +
            '<td colspan="3" width="480">全部省</td>\n' +
            '</tr>\n' +
            '<tr>\n' +
            '<td colspan="4">内 容：</td>\n' +
            '</tr>\n' +
            '<tr>\n' +
            '<td colspan="4">\n' +
            '\t\t\t\n' +
            '\t\t各省业务支撑部门<br/>    针对咪咕包月业务计费优化工作，总部下文部署了相关工作安排，在各省大力配合下，基本完成第一阶段的业务封存操作，但根据咪咕平台统计，8月1日-8月31日仍有封存计费点在BOSS侧产生新增订购，目前各省还存在新增订购业务情况。<br/>    请各省速查本省存在的问题，并在在9月8日前全部停止新增订购。并在2017-9-12前将处理结果反馈至总部联系人邮箱；<br/>    yuzhaocheng@chinamobile.com;<br/>    yanguoyou@migu.cn<br/><br/>具体统计信息如下<br/><br/>\t动漫\t互娱\t视讯\t数媒\t音乐<br/>北京\t0\t0\t0\t0\t1<br/>广东\t0\t0\t1\t2\t4<br/>上海\t256\t0\t0\t0\t8<br/>天津\t0\t0\t0\t0\t0<br/>重庆\t0\t0\t0\t0\t0<br/>辽宁\t10\t10\t17\t0\t15<br/>江苏\t0\t9\t22\t4\t445<br/>湖北\t3\t0\t7\t0\t11<br/>四川\t2\t7\t0\t1\t106<br/>陕西\t0\t0\t0\t0\t2<br/>河北\t3\t2\t0\t0\t0<br/>山西\t0\t0\t1\t0\t5<br/>河南\t3\t0\t1\t2\t13<br/>吉林\t110\t0\t0\t40\t7<br/>黑龙江\t0\t0\t0\t2\t2<br/>内蒙古\t1084\t41\t9605\t0\t0<br/>山东\t40\t0\t0\t13\t0<br/>安徽\t0\t3\t2\t1\t6<br/>浙江\t0\t0\t0\t1\t10<br/>福建\t2828\t0\t30\t1\t0<br/>湖南\t0\t12\t0\t0\t58<br/>广西\t8\t11\t276\t3328\t8236<br/>江西\t0\t0\t0\t1\t9<br/>贵州\t0\t0\t0\t0\t0<br/>云南\t0\t0\t0\t12\t84<br/>西藏\t6\t0\t2\t1\t65<br/>海南\t0\t0\t0\t0\t0<br/>甘肃\t13\t2\t0\t0\t36<br/>宁夏\t0\t0\t6\t0\t2<br/>青海\t0\t2\t0\t117\t112<br/>新疆\t0\t173\t0\t0\t0<br/>总计\t4366\t272\t9970\t3526\t9237<br/>\n' +
            '</td>\n' +
            '</tr>\n' +
            '<tr>\n' +
            '<td align="center" colspan="4"><font color="red">附件下载提示：</font>在附件链接上点击鼠标右键，从弹出菜单上选择“目标另存为...”即可。</td>\n' +
            '</tr>\n' +
            '<tr>\n' +
            '<td align="center" bgcolor="#eeeeee" colspan="4">[ <a href="javascript:close()">关闭</a> ]</td>\n' +
            '</tr>\n' +
            '</table>';

        this.setState({
            info: fuck
        })

    },

    closePage: function () {
        window.history.go(-1);
    },

    render: function () {

        // 数据库里查询info
        let info = this.state.info;

        // 要塞入content的变量
        let dangerousHtml = {__html: info };

        return (
            <div className="wrapper round">
                <header className="header clearfix">
                    <h1>关于CC导演作品获奖的通知</h1>
                    <hr/>
                        <div className="header-append">
                            <span>发布人：<em>信运部方老师</em></span>
                            <span>发布时间：<em>2017-11-30 08:30:00</em></span>
                            <span>发布机构：<em>信运部</em></span>
                            <span>地域：<em>上海/浦东新区</em></span>
                        </div>
                </header>
                <content className="clearfix">
                    <div className="crawler-detail round" dangerouslySetInnerHTML={dangerousHtml}>
                        {/*<!-- 插入内容begin -->*/}
                        {/*<!-- 插入内容end -->*/}
                    </div>
                    <div className="content-append clearfix">
                        <span>发布来源：<em>www.baidu.com</em></span>
                        <span>回复数：<em>10086</em></span>
                        <span>阅读数：<em>20026</em></span>
                    </div>
                </content>
                <footer className="footer">
                    <input type="button" name="close-btn" className="close-btn" value="关闭" onClick={this.closePage.bind(this)}/>
                </footer>
            </div>
        );
    }
});

export default MyDetailPage;