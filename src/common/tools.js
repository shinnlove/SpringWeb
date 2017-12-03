import {
  message,
  notification
} from 'antd';
import request from './Request';
import Queue from './Queue.js';
import jQuery from 'jquery';
import jqXHR from './jqXHR';

const tools = {
  Queue: Queue,
  evbus: function(eventName, callback) {
    $('body').on(eventName, callback)
  },
  isDev() {
    return /localhost/gi.test(location.host) || /10\.(\d+)\.(\d+)\.(\d+)/gi.test(location.host) || /127\.0\.0\.1\./gi.test(location.host)
  },
  mock(url) {
    if (this.isDev()) {
        return 'mock/springweb/' + url;
    } else {
        return url;
    }
  },
  get(url, query, desc, defaultErrorMessage) {
    var _self = this;
    return new Promise(function(resolve, reject) {
      if (typeof url == 'string') {
        url = _self.mock(url);
      } else {
        url = _self.mock(url.online, url.dev);
      }
      request({
        url: url,
        type: 'GET',
        traditional: true,
        data: query,
        dataType: 'json',
        success: (res) => {
          if (res.success || res.actionResult || defaultErrorMessage) {
            resolve(res.result);
          } else {
            message.error((desc || '') + '失败：' + (res.resultCode || ' ') + ' ' + (res.resultMsg || ' '));
            console.log('reject:' + reject);
            if (reject) {
              reject(res);
            }
          }
        },
        error: function(e) {
          console.debug("get请求异常", e);
        }
      });
    });
  },
    dacuget(url, query, desc, defaultErrorMessage) {
        var _self = this;
        return new Promise(function(resolve, reject) {
            if (typeof url == 'string') {
                url = _self.mock(url);
            } else {
                url = _self.mock(url.online, url.dev);
            }
            request({
                url: url,
                type: 'GET',
                traditional: true,
                data: query,
                dataType: 'json',
                success: (res) => {
                    if (res.success || res.actionResult || defaultErrorMessage) {
                        resolve(res.result);
                    } else {
                        // message.error((desc || '') + '失败：' + (res.resultCode || ' ') + ' ' + (res.resultMsg || ' '));
                        // console.log('reject:' + reject);
                        if (reject) {
                            reject(res);
                        }
                    }
                },
                error: function(e) {
                    console.debug("get请求异常", e);
                }
            });
        });
    },
  get2(url, query, desc) {
    var _self = this;
    return new Promise(function(resolve, reject) {
      url = _self.mock(url);
      request({
        url: url,
        type: 'GET',
        traditional: true,
        data: query,
        dataType: 'json',
        success: (res) => {

          if (res.queryResultCode) {
            message.error((desc || '') + '失败：' + (res.queryResultCode || ' ') + ' ' + ('系统错误，请与管理员联系'));
            console.log('reject:' + reject);
            if (reject) {
              reject(res);
            }
          } else {
            resolve(res.queryResult);
          }
        },
        error: function() {
          console.log("get请求异常");
          //message.error('网络通信异常');
        }
      });
    });
  },

  getForQueryResult(url, query, desc) {
    var _self = this;
    return new Promise(function(resolve, reject) {
      url = _self.mock(url);
      request({
        url: url,
        type: 'GET',
        traditional: true,
        data: query,
        dataType: 'json',
        success: (res) => {
          if (res.customizedReportVO || res.queryResult) {
            resolve(res);

          } else {
            message.error((desc || '') + '失败：' + (res.queryResultCode || ' ') + ' ' + ('系统错误，请与管理员联系'));
            console.log('reject:' + reject);
            if (reject) {
              reject(res);
            }
          }
        },
        error: function() {
          console.log("get请求异常");
          //message.error('网络通信异常');
        }
      });
    });
  },

  getLocalData(url) {
    return new Promise(function(resolve, reject) {
      resolve('localdata/' + url);
    });
  },
  post(url, postData, desc) {
    var _self = this;
    return new Promise(function(resolve, reject) {
      url = _self.mock(url);
      request({
        url: url,
        type: 'POST',
        traditional: true,
        data: postData,
        dataType: 'json',
        success: (res) => {
          if (res.success || res.actionResult) {
            resolve(res.result);
          } else {
            message.error((desc || '') + '失败：' + (res.resultCode || ' ') + ' ' + (res.resultMsg || ' '));
            if (reject) {
              reject(res);
            }
          }
        },
        error: function() {
          console.log("post请求异常");
          //message.error('网络异常');
        }
      });
    });
  },
  formatDate(strTime) {
    var date = new Date(strTime);
    return date;
  },

  getFormatGmtDate(strTime, formatter = "") {
    if (!strTime) {
      return "";
    }
    // 服务器端传来的Date 时区是CST，直接用 new Date(strTime) 会导致时间改变，@raymond.zxn 20170718加入如下转换
    strTime = strTime.replace('CST', 'GMT +0800');

    return this.getformatDate(strTime, formatter);
  },

  //formatter = "yyyy-MM-dd HH:mm:ss"
  //formatter = "yyyyMMddHHmmss"
  //formatter = "yyyyMMddHH"
  //或者 自行组合自定义格式
  getformatDate(strTime, formatter = "") {
    if (!strTime) {
      return "";
    }

    let date = new Date(strTime);
    let keyWordList = {
      'yyyy': date.getFullYear(),
      'MM': date.getMonth() + 1,
      'dd': date.getDate(),
      'HH': date.getHours(),
      'mm': date.getMinutes(),
      'ss': date.getSeconds()
    };

    //个位数补0，目前只针对补一个0的情况
    for (let key in keyWordList) {
      if (key.length != keyWordList[key].toString().length) {
        keyWordList[key] = '0' + keyWordList[key];
      } else {
        keyWordList[key] = keyWordList[key].toString();
      }
    }

    for (let key in keyWordList) {
      formatter = formatter.replace(key, keyWordList[key]);
    }
    return formatter;
  },

  //计算时间间隔
  dateBeforeMillsec(startTime, endTime) {
    var startDate = new Date(startTime);
    var endDate = new Date(endTime);
    var df = endDate.getTime() - startDate.getTime();
    if (isNaN(df)) {
      throw Error("invalid dates arguments in function tools.dateBeforeMinutes");
    }
    return df;
  },
  dateBefore(startTime, endTime, type) {
    var df = this.dateBeforeMillsec(startTime, endTime);
    var sec = df / 1000;
    var min = sec / 60;
    if (type && type == 'sec') {
      return sec;
    } else {
      return min.toFixed(2);
    }
  },
  //返回调用ID
  setTimer(func, interval) {
    return setInterval(func, interval);
  },
  clearTimer(intervalID) {
    return clearInterval(intervalID);
  },
  //数组中删除一个元素(数组内容)
  deleteInArray(array = [], val) {
    var index = array.indexOf(val);
    if (index > -1) {
      array.splice(index, 1);
    }
  },
  //数组冒泡排序
  bubbleSortInArray(array = []) {
    if (array.length <= 0) {
      return;
    }
    for (let index_i = array.length - 1; index_i >= 0; --index_i) {
      var pointer = array[index_i];
      for (let index_j = 0; index_j < index_i + 1; ++index_j) {
        if (pointer['key'] < array[index_j]['key']) {
          let temp = array[index_j];
          array[index_j] = pointer;
          pointer = temp;
        }
      }
      array[index_i] = pointer;
    }
  },
  sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
  },
  //输出提示信息，指定秒数后执行回调函数
  sleepThen(status = 'info', msg = '', delay = 0, func) {
    if (status && 'success' == status) {
      message.success(msg);
    } else if (status && 'fail' == status) {
      message.error(msg);
    } else if (status && 'info' == status) {
      message.info(msg);
    } else if (status && 'loading' == status) {
      message.loading(msg);
    }
    if (func) {
      setTimeout(func, delay);
    }
  },
  //对java里的特殊字符进行转义
  convertSpecialChar(str) {
    if (!!str) {
      str = str.replace(/&quot;/g, "\"");
      str = str.replace(/&amp;/g, "&");
      str = str.replace(/&lt;/g, "<");
      str = str.replace(/&gt;/g, ">");
      str = str.replace(/&nbsp;/g, " ");
      str = str.replace(/&#39;/g, "\'");
      str = str.replace(/&lsquo;/g, "\‘");
      str = str.replace(/&rsquo;/g, "\’");
      str = str.replace(/&ldquo;/g, "\“");
      str = str.replace(/&rdquo;/g, "\”");
      str = str.replace(/&iquest;/g, "ß");

    }
    return str;
  },
  // 对java里的特殊字符进行转义
  escapeSpecialChar(str) {
    if (!!str) {
      str = str.replace(new RegExp("\/", 'gm'), "\\\/");
      str = str.replace(new RegExp("\"", 'gm'), "\\\"");
      str = str.replace(new RegExp("\“", 'gm'), "\\\“");
      str = str.replace(new RegExp("\”", 'gm'), "\\\”");
      str = str.replace(new RegExp("\〝", 'gm'), "\\\〝");
      str = str.replace(new RegExp("\〞", 'gm'), "\\\〞");
    }
    return str;
  },
  supergwMessageSpecialChar(str) {
    if (!!str) {
      str = str.replace(/\\0/g, " ");
      str = str.replace(/\\\d+/g, " ");
    }
    return str;
  },
  fillZero(number, digits) {
    number = String(number);
    var length = number.length;
    if (number.length < digits) {
      for (var i = 0; i < digits - length; i++) {
        number = "0" + number;
      }
    }
    return number;
  },
  // 转换预案的特殊文本变成html格式
  planSpecialCharConvert(originText) {
    return unescape(originText).replace(/\n/g, "<br/>");
  },
  // 快速排序，比较对象中的value值,从大到小排序
  quickSort: function(arr, value) {
    if (arr.length <= 1) {
      return arr;
    }
    var pivotIndex = Math.floor(arr.length / 2);
    var pivot = arr.splice(pivotIndex, 1)[0];
    var left = [];
    var right = [];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][value] > pivot[value]) {
        left.push(arr[i]);
      } else {
        right.push(arr[i]);
      }
    }
    return this.quickSort(left, value).concat([pivot], this.quickSort(right, value));
  },

  // // 该函数获取人员所属域信息，取第0个，存进state里面
  // queryUserDomain(self) {
  //   let _self = self;
  //   this.get('common/getCurrentUser.json').then(function (datas) {
  //     let domain = null;
  //
  //     if (!datas) {
  //       message.error("查询所属域失败，未找到人员信息")
  //
  //     } else if (!datas.domainList || datas.domainList.length < 1) {
  //       message.error("查询所属域失败，未找到域信息")
  //
  //     } else {
  //       let domainList = datas.domainList;
  //       if (domainList.length > 1) {
  //         message.error("人员所属域信息不唯一，请联系管理员确认")
  //       }
  //       domain = domainList[0];
  //     }
  //
  //     if (domain) {
  //       _self.setState({domain});
  //     }
  //   });
  // },

  queryCurrentDomain(self, callback) {
    let _self = self;
    let domain = "";
    this.get('/servicecomponent/queryCurrentDomain.json').then(function(data) {
      if (!data) {
        message.error("查询当前域信息失败，结果为空")
      }
      domain = data;
      _self.setState({
        domain: data
      });
    }).then(function() {
      if (callback) {
        callback(domain);
      }
    });
  },

  //判断是否为金融域内用户
  isDomainOfFin(domain) {
    if (domain != null && domain != '') {
      let arr = domain.split('_');
      if (arr.length > 0) {
        if (arr[0] == 'FIN') {
          return true;
        }
      }
    }
    return false;
  },

  getRootDomain(domain) {
    if (domain != null && domain != undefined && domain != '') {
      let arr = domain.split('_');
      if (arr.length > 0) {
        return arr[0];
      }
    }
    return '';
  },

  /**
   * 封装公共工具类。
   *
   * @author shinnlove.jinsheng
   * @version $Id: utils.js, v 0.1 2017年4月09日 下午3:20:16 shinnlove.jinsheng Exp $
   */
  jsonPort: 3000,
  setDevJsonPort: function(port) {
    if (isNaN(port)) {
      console.log("端口设置参数必须为整数");
      return false;
    }
    try {
      var portInteger = ~~port;
      if (portInteger < 1024) {
        console.log("端口设置参数不能为公共端口");
        return false;
      }
      if (portInteger == 3306 || portInteger == 8000 || portInteger == 7777) {
        console.log("端口设置参数不能与sofa或antd重合");
        return false;
      }
    } catch (ex) {
      console.log("端口设置参数有问题");
      return false;
    }
    var port = port || 3000;
    this.jsonPort = port;
  },
  utilsGet: function(url, data, callback, dataType) {
    this.typeAjax(url, data, callback, dataType, "GET");
  },
  utilsPost: function(url, data, callback, dataType) {
    this.typeAjax(url, data, callback, dataType, "POST");
  },
  typeAjax: function(url, data, callback, dataType, requestType) {
    jQuery.extend(jQuery.ajax, {
      _requestCache: {}
    });
    if (requestType == "GET") {
      jqXHR.get(this.mock(url), data, callback, dataType);
    } else if (requestType == "POST") {
      jqXHR.post(this.mock(url), data, callback, dataType);
    }
  },
  ajax: function(url, data, opts) {
    jQuery.extend(jQuery.ajax, {
      _requestCache: {}
    }); // 扩展ajax请求缓存
    jqXHR.ajax(this.mock(url), data, opts); // 真正调用jQuery的ajax
  },

    ajax2: function(url, data, opts) {
        jQuery.extend(jQuery.ajax, {
            _requestCache: {}
        }); // 扩展ajax请求缓存
        jqXHR.ajax(url, "", opts); // 真正调用jQuery的ajax
    },
  /**
   * 原来ES6的请求数据方式。
   */
  load: function() {
    // 等待补充
  },
  // json-server的四个方法
  getJson: function(url, callback) {
    request
      .get(url)
      .end(function(err, resp) {
        if (err) {
          message.error('查询失败！', err);
          return;
        }
        if (typeof callback == "function") {
          callback(resp.body); // 没有错误执行回调
        }
      });
  },
  jsonAdd: function(url, data, callback) {
    request
      .post(url)
      .set('Content-Type', 'application/json')
      .send(data)
      .end(function(err, resp) {
        if (err) {
          message.error('添加失败！', err);
          return;
        }
        if (typeof callback == "function") {
          callback(resp.body); // 没有错误执行回调
        }
      });
  },
  jsonModify: function(url, data, callback) {
    var url = url + "/" + data.id;
    var opts = {
      noDefaultLoading: true,
      noMsg: true,
      type: 'PUT',
      success: callback
    };
    jqXHR.ajax(url, data, opts);
  },
  jsonDelete: function(url, data, callback) {
    request
      .del(url + "/" + data.id)
      .end(function(err, resp) {
        if (err) {
          message.error('删除失败！', err);
          return;
        }
        if (typeof callback == "function") {
          callback(resp.body); // 没有错误执行回调
        }
      });
  },
  clone: function(data) {
    return JSON.parse(JSON.stringify(data));
  }

};

export default tools;