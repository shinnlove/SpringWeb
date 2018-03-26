import React from 'react';
import WrapperDynamicForm from '../module/WrapperDynamicForm';

let DynamicView = React.createClass({

    getInitialState: function () {
        return {

        };

    },

    componentDidMount: function () {

    },

    render: function () {
        return (
            <div>
                <WrapperDynamicForm info={"测试动态生成表单"} />
            </div>
        );
    }

});

export default DynamicView;