
import assign from 'object-assign';
import util from './util';
import {message} from 'antd';

function doConfig(config) {
  const originalError = config.error;
  const originalSuccess = config.success;
  //主要拦截通信层错误
  config.success = (...args)=> {
    const d = args[0];
      /*if (d && d.redirect) {
      util.redirectToLogin();
    } else {

      if (d && d.error) {
        message.error(d.error || '失败');
        return;
      }
      if (d && d.success) {
        originalSuccess.apply(this, args);
        return;
      }
     
      if (d && 'success' in d && d.success !== true) { // 关注产品。后端只返回了是否关注 success:true,false,该判断后期要该
        message.error(d.resultMsg || d.msg || '获取数据失败');
        return;
      }
       }
      */
      //失败原因改由业务调用组件直接暴露
      originalSuccess.apply(this, args);
   
  };
  config.error = (xhr) => {
    if (originalError) {
      originalError(xhr);
    }
    if (xhr.status === 302 || xhr.status === 0) {
      util.redirectToLogin();
    }
    if (xhr.status === 404 ) {
      //未完全联调，暂时关闭报错提示信息
      message.error('404 未找到相关数据');
    }
  };
  config.data = assign({}, config.data, {
    _input_charset: 'utf-8',
    _: new Date().getTime(),
  });
  return config;
}

function request(config) {
  return $.ajax(doConfig(config));
}

export default request;
