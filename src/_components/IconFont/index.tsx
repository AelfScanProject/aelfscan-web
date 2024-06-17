/*
 * @Date: 2023-08-14 14:46:18
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-18 14:40:31
 * @Description: iconfont
 */

import createFromIconfontCN from '@ant-design/icons/lib/components/IconFont';
// const createFromIconfontCN = Icons.createFromIconfontCN;
const ICON_FONT_URL = 'https://lf1-cdn-tos.bytegoofy.com/obj/iconpark/svg_27664_78.b7054d5d6e4cbaad8ff8b3c59c213539.js';

const IconFont = createFromIconfontCN({
  scriptUrl: ICON_FONT_URL,
});
export default IconFont;
