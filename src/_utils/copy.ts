import { message } from 'antd';
import copy from 'copy-to-clipboard';
export function handelCopy(value) {
  message.destroy();
  try {
    copy(value);
    message.success('Copied');
  } catch (e) {
    message.error('Copy failed, please copy by yourself.');
  }
}
