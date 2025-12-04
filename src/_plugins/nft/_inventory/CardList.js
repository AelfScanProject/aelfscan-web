var _excluded = ["loading", "pageNum", "pageSize", "defaultCurrent", "total", "showTopSearch", "topSearchProps", "pageChange", "emptyType", "pageSizeChange", "options", "headerTitle", "emptyText", "headerLeftNode", "dataSource"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
import React from 'react';
import { Card, Spin } from 'antd';
import "./index.css";
import { Pagination } from 'aelf-design';
import EPSearch from '@_components/EPSearch';
import clsx from 'clsx';
import { isReactNode } from '@_utils/typeUtils';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import EPTooltip from '@_components/EPToolTip';
import { useMobileAll } from '@_hooks/useResponsive';
import NFTImage from '@_components/NFTImage';
import CommonEmpty from '@_components/Table/empty';
function NftCardList(props) {
  var searchParams = useSearchParams();
  var chain = searchParams.get('chainId');
  var list = props.list;
  return /*#__PURE__*/React.createElement("div", {
    className: "collection-detail-inventory"
  }, list.map(function (itemObj, index) {
    var _itemObj$item, _itemObj$item2;
    return /*#__PURE__*/React.createElement("div", {
      key: index,
      className: "collection-detail-inventory-item"
    }, /*#__PURE__*/React.createElement(Link, {
      href: "/nftItem?chainId=".concat(chain, "&&itemSymbol=").concat(itemObj === null || itemObj === void 0 || (_itemObj$item = itemObj.item) === null || _itemObj$item === void 0 ? void 0 : _itemObj$item.symbol)
    }, /*#__PURE__*/React.createElement(Card, {
      hoverable: true,
      cover: /*#__PURE__*/React.createElement(NFTImage, {
        className: "rounded object-cover",
        src: itemObj === null || itemObj === void 0 || (_itemObj$item2 = itemObj.item) === null || _itemObj$item2 === void 0 ? void 0 : _itemObj$item2.imageUrl
      })
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      className: "text-xs leading-5 text-base-200"
    }, "Symbol:"), /*#__PURE__*/React.createElement("span", {
      className: "ml-1 text-xs leading-5 text-base-100"
    }, itemObj.item.symbol)), /*#__PURE__*/React.createElement("div", {
      className: "item-center flex text-xs leading-5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-[58px] text-base-200"
    }, "Last Sale:"), itemObj.lastSalePrice === -1 ? /*#__PURE__*/React.createElement("span", {
      className: "text-base-100"
    }, "N/A") :  itemObj.lastTransactionId ? /*#__PURE__*/React.createElement(EPTooltip, {
      mode: "dark",
      title: "Click to see transaction with last sale price of $".concat(itemObj.lastSalePriceInUsd, " (").concat(itemObj.lastSalePrice, " ").concat(itemObj.lastSaleAmountSymbol || '', ")")
    }, /*#__PURE__*/React.createElement(Link, {
      className: "inline-block truncate",
      href:   "/".concat(chain, "/tx/").concat(itemObj.lastTransactionId)
    }, /*#__PURE__*/React.createElement("span", {
      className: "mx-1"
    }, "$", itemObj.lastSalePriceInUsd), /*#__PURE__*/React.createElement("span", null, "(", itemObj.lastSalePrice, " ", itemObj.lastSaleAmountSymbol, ")"))) : /*#__PURE__*/ React.createElement(
      'span',
      {
        className: 'inline-block truncate',
      },
      /*#__PURE__*/ React.createElement(
        'span',
        {
          className: 'mx-1',
        },
        '$',
        itemObj.lastSalePriceInUsd,
      ),
      /*#__PURE__*/ React.createElement(
        'span',
        null,
        '(',
        itemObj.lastSalePrice,
        ' ',
        itemObj.lastSaleAmountSymbol,
        ')',
      ),
    ),))));
  }));
}
var MemoNftCardList = /*#__PURE__*/React.memo(NftCardList);
function HeaderTitle(props) {
  if (props.multi) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "total-text text-sm font-normal leading-22 text-base-100"
    }, props.multi.title), /*#__PURE__*/React.createElement("div", {
      className: "bottom-text text-xs font-normal leading-5 text-base-200"
    }, props.multi.desc));
  } else {
    var _props$single;
    return /*#__PURE__*/React.createElement("div", {
      className: "single align-center flex"
    }, /*#__PURE__*/React.createElement("div", {
      className: "total-tex ml-1 text-sm font-normal leading-22  text-base-100 "
    }, (_props$single = props.single) === null || _props$single === void 0 ? void 0 : _props$single.title));
  }
}
export default function CardList(_ref) {
  var _ref$loading = _ref.loading,
    loading = _ref$loading === void 0 ? false : _ref$loading,
    pageNum = _ref.pageNum,
    pageSize = _ref.pageSize,
    defaultCurrent = _ref.defaultCurrent,
    total = _ref.total,
    showTopSearch = _ref.showTopSearch,
    topSearchProps = _ref.topSearchProps,
    pageChange = _ref.pageChange,
    emptyType = _ref.emptyType,
    pageSizeChange = _ref.pageSizeChange,
    options = _ref.options,
    headerTitle = _ref.headerTitle,
    emptyText = _ref.emptyText,
    headerLeftNode = _ref.headerLeftNode,
    dataSource = _ref.dataSource,
    params = _objectWithoutProperties(_ref, _excluded);
  var isMobile = useMobileAll();
  var _ref2 = topSearchProps || {},
    _ref2$disabledTooltip = _ref2.disabledTooltip,
    disabledTooltip = _ref2$disabledTooltip === void 0 ? true : _ref2$disabledTooltip;
  return /*#__PURE__*/React.createElement(Spin, {
    spinning: loading
  }, /*#__PURE__*/React.createElement("div", {
    className: "ep-table rounded-lg bg-white shadow-table"
  }, /*#__PURE__*/React.createElement("div", {
    className: clsx('ep-table-header', showTopSearch ? 'py-4' : 'p-4', "ep-table-header-".concat(isMobile ? 'mobile' : 'pc'))
  }, /*#__PURE__*/React.createElement("div", {
    className: "header-left"
  }, isReactNode(headerTitle) ? headerTitle : /*#__PURE__*/React.createElement(HeaderTitle, headerTitle), headerLeftNode), /*#__PURE__*/React.createElement("div", {
    className: "header-pagination"
  }, showTopSearch ? /*#__PURE__*/React.createElement(EPTooltip, {
    title: disabledTooltip ? '' : topSearchProps === null || topSearchProps === void 0 ? void 0 : topSearchProps.placeholder,
    placement: "topLeft",
    trigger: ['focus'],
    pointAtCenter: false,
    mode: "dark"
  }, /*#__PURE__*/React.createElement(EPSearch, _extends({}, topSearchProps, {
    onPressEnter: function onPressEnter(_ref3) {
      var _topSearchProps$onPre;
      var currentTarget = _ref3.currentTarget;
      topSearchProps === null || topSearchProps === void 0 || topSearchProps.onSearchChange(currentTarget.value);
      topSearchProps === null || topSearchProps === void 0 || (_topSearchProps$onPre = topSearchProps.onPressEnter) === null || _topSearchProps$onPre === void 0 || _topSearchProps$onPre.call(topSearchProps, currentTarget.value);
    },
    onClear: function onClear() {
      var _topSearchProps$onCle;
      topSearchProps === null || topSearchProps === void 0 || topSearchProps.onSearchChange('');
      topSearchProps === null || topSearchProps === void 0 || (_topSearchProps$onCle = topSearchProps.onClear) === null || _topSearchProps$onCle === void 0 || _topSearchProps$onCle.call(topSearchProps);
    }
  }))) : /*#__PURE__*/React.createElement(Pagination, {
    current: pageNum,
    total: total,
    options: options,
    pageSize: pageSize,
    defaultPageSize: pageSize,
    defaultCurrent: defaultCurrent,
    showSizeChanger: false,
    pageChange: pageChange,
    pageSizeChange: pageSizeChange
  }))), dataSource.length ? /*#__PURE__*/React.createElement(MemoNftCardList, {
    list: dataSource
  }) : /*#__PURE__*/React.createElement(CommonEmpty, {
    type: "nodata"
  }), /*#__PURE__*/React.createElement("div", {
    className: "p-4"
  }, /*#__PURE__*/React.createElement(Pagination, {
    current: pageNum,
    options: options,
    defaultPageSize: pageSize,
    total: total,
    pageSize: pageSize,
    defaultCurrent: defaultCurrent,
    pageChange: pageChange,
    pageSizeChange: pageSizeChange
  }))));
}