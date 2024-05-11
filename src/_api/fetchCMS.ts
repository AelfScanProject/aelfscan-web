import request from '@_api';

const showPath = ['blockchain', '/tokens', '/nfts', '/contracts', '/address'];
const showLabel = ['Blocks', 'Transactions', 'Contracts', 'Top Accounts'];
export async function fetchCMS() {
  const result = await request.cms.getGlobalConfig();
  const { data } = result;
  const headerMenuList = data.headerMenuList.filter((item) => {
    if (item.headerMenu_id.path === 'blockchain') {
      item.headerMenu_id.children = item.headerMenu_id.children.filter((child) => {
        return showLabel.includes(child.label);
      });
    }
    return showPath.includes(item.headerMenu_id?.path);
  });
  data.headerMenuList = headerMenuList;
  return data;
}
