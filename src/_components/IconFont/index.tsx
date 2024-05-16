/*
 * @Date: 2023-08-14 14:46:18
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-18 14:40:31
 * @Description: iconfont
 */
import createFromIconfontCN from '@ant-design/icons/lib/components/IconFont';
// const createFromIconfontCN = Icons.createFromIconfontCN;
const ICON_FONT_URL = 'https://lf1-cdn-tos.bytegoofy.com/obj/iconpark/svg_27664_77.7b1b1c94a75ff1c23dcf51a8d0d82654.js';

const IconFont = createFromIconfontCN({
  scriptUrl: ICON_FONT_URL,
});
export default IconFont;
