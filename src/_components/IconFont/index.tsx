/*
 * @Date: 2023-08-14 14:46:18
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-18 14:40:31
 * @Description: iconfont
 */

import createFromIconfontCN from '@ant-design/icons/lib/components/IconFont';

const ICON_FONT_URL =
  'https://lf1-cdn-tos.bytegoofy.com/obj/iconpark/svg_27664_120.a7f45669f8ab4023521f2d761a180e05.js';

const IconFont = createFromIconfontCN({
  scriptUrl: ICON_FONT_URL,
});
export default IconFont;
