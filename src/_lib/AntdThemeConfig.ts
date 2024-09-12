import { ThemeConfig } from 'antd';
export const PREFIXCLS = 'explorer';

export const THEME_CONFIG: ThemeConfig = {
  token: {
    colorPrimary: '#266CD3',
    colorPrimaryHover: '#327DEC',
    colorPrimaryActive: '#155ABF',
    colorBorder: '#D0D0D0',
    colorPrimaryBorder: '#D0D0D0',
    colorTextDisabled: '#D6D6D6',
  },
  components: {
    Descriptions: {
      itemPaddingBottom: 0,
    },
    Tag: {
      defaultBg: '#fafafa',
      defaultColor: 'rgba(0, 0, 0, 0.88)',
    },
  },
};
