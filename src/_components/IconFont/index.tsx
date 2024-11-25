/*
 * @Date: 2023-08-14 14:46:18
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-18 14:40:31
 * @Description: iconfont
 */

import createFromIconfontCN from '@ant-design/icons/lib/components/IconFont';

const ICON_FONT_URL =
  'https://lf1-cdn-tos.bytegoofy.com/obj/iconpark/svg_27664_147.43dab013578026cdd68dea6efbfc988b.js';

const IconFont = createFromIconfontCN({
  scriptUrl: ICON_FONT_URL,
});
export default IconFont;
