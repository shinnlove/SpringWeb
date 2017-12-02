import {Message} from 'antd';

function padding2(v) {
  let ret = v;
  if ((v + '').length < 2) {
    ret = '0' + v;
  }
  return ret;
}

const util = {
  redirectToLogin() {
    Message.error('长时间不操作，将重新刷新页面');
    setTimeout(() => {
      location.reload();
    }, 1500);
  },
  getMonthStr(date) {
    const year = date.getFullYear();
    const month = padding2(date.getMonth() + 1);
    return `${year}-${month}`;
  },
};

export default util;
