/**
 * @file
 * @author huangzongzhe
 */
/* eslint-disable fecs-camelcase */
import React, { PureComponent } from "react";
import { Menu, Icon, Drawer, Divider } from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import "./header.styles.less";
import { getPathnameFirstSlash } from "@utils/urlUtils";
import { setIsSmallScreen } from "@actions/common";
import Search from "../Search/Search";
import ChainSelect from "../ChainSelect/ChainSelect";
import config, { NETWORK_TYPE } from "../../../config/config";
import CHAIN_STATE from "../../../config/configCMS.json";
import { isPhoneCheck } from "../../utils/deviceCheck";
import HeaderTop from "./HeaderTop";
import IconFont from "../IconFont";
import NetSelect from "../NetSelect/NetSelect";
import { getCMSDelayRequest } from "../../utils/getCMS";

const networkList = [
  {
    title: "AELF Mainnet",
    url: "https://explorer.aelf.io",
    netWorkType: "MAIN",
  },
  {
    title: "AELF Testnet",
    url: "https://explorer-test.aelf.io",
    netWorkType: "TESTNET",
  },
];

const CHAINS_LIST = CHAIN_STATE.chainItem || [];
const { SubMenu } = Menu;

const WIDTH_BOUNDARY = 942;

function isPhoneCheckWithWindow() {
  const windowWidth = window.innerWidth;
  return isPhoneCheck() || windowWidth <= WIDTH_BOUNDARY;
}

class BrowserHeader extends PureComponent {
  constructor() {
    super();
    this.timerInterval = null;
    this.interval = 300;
    this.showSearchTop = 330;
    this.state = {
      showSearch: this.getSearchStatus(),
      showMobileMenu: false,
      chainList: CHAINS_LIST,
      current:
        location.pathname === "/"
          ? "/home"
          : getPathnameFirstSlash(location.pathname),
    };
    this.isPhone = isPhoneCheckWithWindow();
    this.handleResize = this.handleResize.bind(this);
  }

  getSearchStatus() {
    const { pathname } = location;
    let showSearch = false;
    if (pathname === "/" && document.body.offsetWidth > 768) {
      const { scrollTop } = document.documentElement;
      if (scrollTop >= this.showSearchTop) {
        showSearch = true;
      } else {
        showSearch = false;
      }
    } else {
      showSearch = true;
    }
    return showSearch;
  }

  // TODO: 有空的话，回头使用观察者重写一遍，所有跳转都触发Header检测。而不是这种循环。
  setSeleted() {
    this.timerInterval = setInterval(() => {
      let pathname = `/${location.pathname.split("/")[1]}`;
      pathname = pathname === "/" ? "/home" : pathname;
      if (this.state.current !== pathname) {
        // white list
        const whiteList = ["/block", "/address", "/vote", "/voteold"];
        if (whiteList.indexOf(pathname) > -1) {
          pathname = "/blocks";
        }

        const showSearch = this.getSearchStatus();
        this.setState({
          current: pathname,
          showSearch,
        });
      }
    }, this.interval);
  }

  componentDidMount() {
    this.setSeleted();
    this.handleResize();
    this.fetchChainList();

    window.addEventListener("scroll", this.handleScroll.bind(this));
    window.addEventListener("resize", this.handleResize);
  }

  // fetch chain list by network
  async fetchChainList() {
    const data = await getCMSDelayRequest(0);
    if (data && data.chainItem && data.updated_at !== CHAIN_STATE.updated_at)
      this.setState({
        chainList: data.chainItem,
      });
  }

  componentWillUnmount() {
    clearInterval(this.timerInterval);
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll() {
    if (location.pathname === "/") {
      const showSearch = this.getSearchStatus();

      if (showSearch !== this.state.showSearch) {
        this.setState({
          showSearch,
        });
      }
    }
  }

  handleResize() {
    const { setIsSmallScreen, isSmallScreen } = this.props;
    const { offsetWidth } = document.body;

    const newIsMobile = offsetWidth <= 768;

    if (newIsMobile !== isSmallScreen) {
      setIsSmallScreen(newIsMobile);
    }
  }

  handleClick = (e) => {
    clearTimeout(this.timerTimeout);
    this.timerTimeout = setTimeout(() => {
      const { isSmallScreen } = this.props;
      if (isSmallScreen) {
        this.toggleMenu();
      }
      this.setState({
        current: e.key,
      });
    }, this.interval);
  };

  renderPhoneMenu() {
    const networkHTML = networkList.map((item) => {
      let classSelected = "";
      if (NETWORK_TYPE === item.netWorkType) {
        classSelected = "header-chain-selected";
      }
      return (
        <Menu.Item key={item.netWorkType}>
          <a href={item.url} className={classSelected}>
            {item.title}
          </a>
        </Menu.Item>
      );
    });
    return (
      <SubMenu
        popupClassName='common-header-submenu'
        title={<span className='submenu-title-wrapper'>Explorers</span>}
        className='aelf-submenu-container'
      >
        {networkHTML}
      </SubMenu>
    );
  }

  renderMenu(menuMode, showMenu = true) {
    const nodeInfo = JSON.parse(localStorage.getItem("currentChain"));
    const { chain_id } = nodeInfo;

    let voteHTML = "";
    let resourceHTML = "";
    if (chain_id === config.MAINCHAINID) {
      voteHTML = (
        <Menu.Item key='/vote'>
          {/* <Icon type='appstore' /> */}
          <Link to='/vote'>Vote</Link>
          {/* <Link to='/voteold'>VoteOld</Link> */}
          {/* <span>APP CENTER [Building]</span> */}
        </Menu.Item>
      );
      resourceHTML = (
        <Menu.Item key='/resource'>
          {/* <Icon type='appstore' /> */}
          <Link to='/resource'>Resource</Link>
          {/* <span>APP CENTER [Building]</span> */}
        </Menu.Item>
      );
    }

    const menuClass = showMenu ? "aelf-menu" : "aelf-menu  aelf-menu-hidden";
    const isPhone = isPhoneCheckWithWindow();

    return (
      // Add style to solve not responsive collapse in Flex layout
      // Menu will render fully item in flex layout and then collapse it.
      // You need tell flex not consider Menu width to enable responsive
      <Menu
        style={{ minWidth: 0, flex: "auto" }}
        onClick={this.handleClick}
        selectedKeys={[this.state.current]}
        mode={menuMode}
        key='navbar'
        className={menuClass}
        expandIcon={<IconFont className='submenu-right-arrow' type='Down' />}
      >
        <Menu.Item key='/home'>
          <Link to='/'>Home</Link>
        </Menu.Item>
        <SubMenu
          key='BLOCKCHAIN'
          popupClassName='common-header-submenu'
          popupOffset={[0, -7]}
          title={
            <>
              <span className='submenu-title-wrapper'>Blockchain</span>
              {!isPhone && <IconFont className='submenu-arrow' type='Down' />}
            </>
          }
          className='aelf-submenu-container'
        >
          <>
            <SubMenu key='Block' title='Block' popupOffset={[0, -4]}>
              <Menu.Item key='/blocks'>
                <Link to='/blocks'>Blocks</Link>
              </Menu.Item>
              <Menu.Item key='/unconfirmedBlocks'>
                <Link to='/unconfirmedBlocks'>Unconfirmed Blocks</Link>
              </Menu.Item>
            </SubMenu>
          </>
          <>
            <SubMenu key='Transaction' title='Transaction'>
              <Menu.Item key='/txs'>
                <Link to='/txs'>Transactions</Link>
              </Menu.Item>
              <Menu.Item key='/unconfirmedTxs'>
                <Link to='/unconfirmedTxs'>Unconfirmed Transactions</Link>
              </Menu.Item>
            </SubMenu>
          </>
          <>
            <SubMenu key='Address' title='Address'>
              <Menu.Item key='/address'>
                <Link to='/address'>Accounts</Link>
              </Menu.Item>
              <Menu.Item key='/contract'>
                <Link to='/contract'>Contracts</Link>
              </Menu.Item>
            </SubMenu>
          </>
        </SubMenu>

        <Menu.Item key='/token'>
          <Link to='/token'>Token</Link>
        </Menu.Item>
        <SubMenu
          key='GOVERNANCE'
          popupOffset={[0, -7]}
          popupClassName='common-header-submenu'
          title={
            <>
              <span className='submenu-title-wrapper'>Governance</span>
              {!isPhone && <IconFont className='submenu-arrow' type='Down' />}
            </>
          }
          className='aelf-submenu-container'
        >
          <Menu.Item key='/proposal'>
            <Link to='/proposal/proposals'>Proposal</Link>
          </Menu.Item>
          {voteHTML}
          {resourceHTML}
        </SubMenu>
        {isPhone && <Divider className='divider-mobile' />}
        {isPhone && this.renderPhoneMenu()}
        {isPhone && (
          <Menu.Item key='/about'>
            <a
              href='https://www.aelf.io/'
              target='_blank'
              rel='noopener noreferrer'
            >
              About
            </a>
          </Menu.Item>
        )}
      </Menu>
    );
  }

  toggleMenu() {
    this.setState({
      showMobileMenu: !this.state.showMobileMenu,
    });
  }

  renderMobileMore() {
    return (
      <div
        className={`header-navbar-mobile-more ${
          NETWORK_TYPE === "MAIN" ? "header-navbar-main-mobile-more" : ""
        }`}
        onClick={() => this.toggleMenu()}
      >
        <IconFont
          type={NETWORK_TYPE === "MAIN" ? "aelf" : "aelf-test"}
          className='aelf-logo-container'
        />
        <Icon type='menu' />
      </div>
    );
  }

  renderDrawerMenu(menuMode, showMenu = true) {
    return (
      <Drawer
        visible={showMenu}
        placement='right'
        width={"80%"}
        closable={false}
        className={`header-drawer-menu-wrapper ${
          NETWORK_TYPE === "MAIN" ? "header-main-drawer-menu-wrapper" : ""
        }`}
        onClose={() => this.toggleMenu()}
        getContainer={false}
        title={
          <>
            <IconFont
              type={NETWORK_TYPE === "MAIN" ? "aelf" : "aelf-test"}
              className='aelf-logo-container'
            />
            <IconFont
              type='ErrorClose'
              className='close-icon'
              onClick={() => this.toggleMenu()}
            />
          </>
        }
      >
        <NetSelect chainList={this.state.chainList} />
        {this.renderMenu(menuMode, showMenu)}
      </Drawer>
    );
  }

  render() {
    const menuMode = this.isPhone ? "inline" : "horizontal";
    const mobileMoreHTML = this.isPhone ? this.renderMobileMore() : "";
    console.log(this.isPhone, "==this.isPhone");
    let menuHtml;
    if (this.isPhone) {
      menuHtml = this.renderDrawerMenu(menuMode, this.state.showMobileMenu);
    } else {
      menuHtml = this.renderMenu(menuMode);
    }

    const headerClass = this.isPhone
      ? "header-container header-container-mobile"
      : "header-container";
    const networkClass = this.isPhone
      ? NETWORK_TYPE === "MAIN"
        ? " header-main-container-mobile"
        : ""
      : NETWORK_TYPE === "MAIN"
      ? " header-main-container"
      : "";

    return (
      <div className='header-fixed-container'>
        <div>
          {!this.isPhone && (
            <HeaderTop
              showSearch={this.state.showSearch}
              headerClass={headerClass}
              menuMode={menuMode}
              networkList={networkList}
            />
          )}
          <div className={headerClass + networkClass}>
            {mobileMoreHTML}

            <nav className='header-navbar'>
              {menuHtml}
              {this.isPhone && this.state.showSearch && <Search />}
              {!this.isPhone && (
                <ChainSelect chainList={this.state.chainList} />
              )}
            </nav>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ ...state.common });

const mapDispatchToProps = (dispatch) => ({
  setIsSmallScreen: (isSmallScreen) =>
    dispatch(setIsSmallScreen(isSmallScreen)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BrowserHeader);
