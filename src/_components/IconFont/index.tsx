/*
 * @Date: 2023-08-14 14:46:18
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-18 14:40:31
 * @Description: iconfont
 */

import createFromIconfontCN from '@ant-design/icons/lib/components/IconFont';

const ICON_FONT_URL =
  'https://lf1-cdn-tos.bytegoofy.com/obj/iconpark/svg_27664_137.65ab4bac7c7ae87f34d0f1e662516436.js';

const IconFont = createFromIconfontCN({
  scriptUrl: ICON_FONT_URL,
});
export default IconFont;
