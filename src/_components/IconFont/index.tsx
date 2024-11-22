/*
 * @Date: 2023-08-14 14:46:18
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-18 14:40:31
 * @Description: iconfont
 */

import createFromIconfontCN from '@ant-design/icons/lib/components/IconFont';

const ICON_FONT_URL =
  'https://lf1-cdn-tos.bytegoofy.com/obj/iconpark/svg_27664_146.cac7d9de78635307276470e2a8608f1c.js';

const IconFont = createFromIconfontCN({
  scriptUrl: ICON_FONT_URL,
});
export default IconFont;
