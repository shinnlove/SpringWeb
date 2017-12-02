/**
 * Alipay.com Inc.
 * Copyright (c) 2004-2017 All Rights Reserved.
 *
 * 封装可以自定义的jQueryXHR请求。
 *
<<<<<<< HEAD
 * 使用说明:
 *
=======
>>>>>>> origin/master
 * @author shinnlove.jinsheng
 * @version $Id: jqXHR.js, v 0.1 2017年4月09日 下午2:49:55 shinnlove.jinsheng Exp $
 */
import {
    message
} from 'antd';
import jQuery from 'jquery';

let jqXHR = {
    /**
     * jQuery ajax get请求
     * @param url 请求路径
     * @param data 参数(可选)
     * @param callback 响应成功回调函数(可选)
     * @param dataType 服务端返回内容的格式(可选)
     */
    get: function(url, data, callback, dataType) {
        var dataType = dataType || "json",
            opts = {
                noMsg: true, // 不要成功或错误的解析信息
                noDefaultLoading: true, // 这个页面不要默认的Loading
                type: "GET",
                dataType: dataType,
                success: callback,
            };
        this.ajax(url, data, opts);
    },
    /**
     * jQuery ajax post请求
     * @param url 请求路径
     * @param data 参数(可选)
     * @param callback 响应成功回调函数(可选)
     * @param dataType 服务端返回内容的格式(可选)
     */
    post: function(url, data, callback, dataType) {
        var dataType = dataType || "json",
            opts = {
                noMsg: true, // 不要成功或错误的解析信息
                noDefaultLoading: true, // 这个页面不要默认的Loading
                type: "POST",
                dataType: dataType,
                success: callback,
            };
        this.ajax(url, data, opts);
    },
    /**
     * ajax 请求
     * 特别注意：如果要多线程，则使用ajax前要在别的地方init cache,一般在utils会帮忙处理。
     *
     * @param url
     * @param data
     * @param opts
     * @returns {boolean}
     */
    ajax: function(url, data, opts) {

        message.config({
            top: 200
        }); // Antd消息loading默认高度

        var opts = opts || {},
            requestIndex = opts.requestIndex || 0, // jsXHR线程默认从0开始
            loadingTimer = null;
        opts.requestIndex = requestIndex;

        // 处理url,加上ajax请求标志和时间戳
        url = url.indexOf('?') === -1 ? url + '?' : url + '&';
        url = url.replace(/\&resType\=[^\&]+/g, '') + 'resType=json';
        url = url.replace(/\&isAjax\=1/g, '') + '&isAjax=1';
        url = url.replace(/\&timestamp\=[^\&]+/g, '') + '&timestamp=' + new Date().getTime();

        var ajaxOpts = {
            _input_charset: opts.charset || 'utf-8', // 默认utf8请求json
            url: url,
            data: data,
            async: typeof opts.async == "undefined" ? true : opts.async,
            cache: opts.cache || false, // false不缓存请求
            processData: opts.isUpload,
            contentType: opts.isUpload ? false : 'application/x-www-form-urlencoded',
            type: opts.type || (typeof data != "undefined" && data != null ? 'POST' : 'GET'),
            dataType: opts.dataType || 'json', // 默认json
            timeout: opts.timeout || 30000,
            jsonp: opts.dataType === 'jsonp' ? 'callback' : null,
            jsonpCallback: opts.dataType === 'jsonp' ? opts.success : null, // 将success函数作为jsonp的回调函数
            beforeSend: function(XHR, option) {
                if (opts.requestIndex) {
                    if (opts.requestMode == 'block') {
                        if (jQuery.ajax._requestCache[opts.requestIndex]) {
                            return false; // XHR线程存在直接返回，不做提交
                        }
                    } else if (opts.requestMode == 'abort') {
                        if (jQuery.ajax._requestCache[opts.requestIndex]) {
                            jQuery.ajax._requestCache[opts.requestIndex].abort(); // 阻止某线程提交
                        }
                    }
                }

                var result = true;
                if (typeof opts.beforeSend == 'function') {
                    result = opts.beforeSend(XHR, option, opts.requestIndex); // 执行请求前钩子，如果钩子函数return false则不提交ajax
                }

                // beforeSend并不一定非要返回true
                if (result != false) {
                    jQuery.ajax._requestCache[opts.requestIndex] = XHR;
                    if (typeof opts.noDefaultLoading == "undefined" || opts.noDefaultLoading == false) {
                        loadingTimer = setTimeout(function() {
                            var loadingMsg = opts.loadingMsg || "loading";
                            message.loading(loadingMsg, 9999); // antd的请求等待
                        }, 100);
                    }
                }

                return result;
            },
            success: function(result, textStatus, XHR) {
                clearTimeout(loadingTimer);

                message.destroy(); // 取消等待,antd独有

                if (result == null && !opts.noMsg) {
                    var msg = '您的网络有些问题，请稍后再试 [code:1]';
                    message.error(msg);
                }

                if (typeof result !== 'object') {
                    result = jQuery.parseJSON(result);
                }

                if (typeof opts.success == 'function') {
                    opts.success(result, textStatus, XHR, opts.requestIndex); // 成功钩子带上线程id
                }

                if (result) {
                    // 有返回结果的情况下
                    if (result.errCode && result.errMsg) {
                        // 如果是标准格式返回情况
                        if (!opts.noMsg) {
                            // 如果需要提示
                            if (result.errCode == 0) {
                                // 标准返回结果正确
                                message.info(result.errMsg);
                            } else {
                                // 错误结果提示
                                var msg = result.errMsg + '<span style="display:none;">' + result.errCode + '</span>';
                                message.error(msg);
                            }
                        }
                    } else {
                        // 数据格式解析失败，返回的不是标准格式
                        if (!opts.noMsg) {
                            // 如果需要提示，告知数据解析失败
                            var msg = '数据解析失败，请稍后再试 [code:2]';
                            message.error(msg);
                        }
                    }
                }

            },
            error: function(XHR, textStatus, errorThrown) {

                clearTimeout(loadingTimer);

                message.destroy(); // 取消等待,antd独有

                // 执行error肯定ready的State不会为4
                if (XHR.readyState == 0 || XHR.status == 0) {
                    if (!opts.noMsg) {
                        var msg = '您的网络有些问题，请稍后再试[code:4]';
                        message.error(msg);
                    }
                } else if (textStatus != 'abort' && !opts.noMsg) {
                    if (!opts.noMsg) {
                        var msg = '';
                        switch (textStatus) {
                            case 'timeout':
                                msg = '对不起，请求服务器网络超时';
                                break;
                            case 'error':
                                msg = '网络出现异常，请求服务器错误';
                                break;
                            case 'parsererror':
                                msg = '网络出现异常，服务器返回错误';
                                break;
                            case 'notmodified':
                            default:
                                msg = '您的网络有些问题，请稍后再试[code:3]';
                        }
                        message.error(msg);
                    }
                }
                if (typeof opts.error == 'function') {
                    opts.error(XHR, textStatus, errorThrown, opts.requestIndex); // 执行error钩子带上请求id
                }
            },
            complete: function(XHR, status) {
                if (opts.requestIndex) {
                    if (jQuery.ajax._requestCache[opts.requestIndex]) {
                        jQuery.ajax._requestCache[opts.requestIndex] = null; // 如果使用多线程提交，回收该线程
                    }
                }
                if (typeof opts.complete == 'function') {
                    opts.complete(XHR, status, opts.requestIndex); // 执行完成钩子
                }
            }
        };
        jQuery.ajax(ajaxOpts);

        return false;
    },
}

export default jqXHR;