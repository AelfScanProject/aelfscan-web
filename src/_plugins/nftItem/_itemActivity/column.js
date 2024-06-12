import React from 'react';
import { formatDate, getAddress } from '@_utils/formatter';
import Copy from '@_components/Copy';
import Link from 'next/link';
import IconFont from '@_components/IconFont';
import ContractToken from '@_components/ContractToken';
import { AddressType } from '@_types/common';
import EPTooltip from '@_components/EPToolTip';
import Market from '@_components/Market';
import dayjs from 'dayjs';
export default function getColumns(_ref) {
  var timeFormat = _ref.timeFormat,
    handleTimeChange = _ref.handleTimeChange,
    chainId = _ref.chainId,
    detailData = _ref.detailData;
  return [{
    dataIndex: 'transactionId',
    width: 224,
    key: 'transactionId',
    title: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Txn Hash")),
    render: function render(text, records) {
      return /*#__PURE__*/React.createElement("div", {
        className: "flex items-center"
      }, /*#__PURE__*/React.createElement(EPTooltip, {
        title: text,
        mode: "dark"
      }, /*#__PURE__*/React.createElement(Link, {
        className: "block w-[120px] truncate text-link",
        href: "/".concat(chainId, "/tx/").concat(text, "?blockHeight=").concat(records.blockHeight)
      }, text)), /*#__PURE__*/React.createElement(Copy, {
        value: text
      }));
    }
  }, {
    title: /*#__PURE__*/React.createElement("div", {
      className: "time cursor-pointer font-medium text-link",
      onClick: handleTimeChange,
      onKeyDown: handleTimeChange
    }, timeFormat),
    width: 224,
    dataIndex: 'blockTime',
    key: 'blockTime',
    render: function render(text) {
      return /*#__PURE__*/React.createElement("div", null, formatDate(dayjs(text).unix().valueOf(), timeFormat));
    }
  }, {
    title: 'Action',
    width: 112,
    dataIndex: 'action',
    key: 'action',
    render: function render(text) {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, text));
    }
  }, {
    title: '',
    width: 90,
    dataIndex: 'market',
    key: 'market',
    render: function render(text, record) {
      var _detailData$marketPla;
      return /*#__PURE__*/React.createElement("div", null, record.action === 'Sale' && /*#__PURE__*/React.createElement(Market, {
        url: detailData === null || detailData === void 0 || (_detailData$marketPla = detailData.marketPlaces) === null || _detailData$marketPla === void 0 ? void 0 : _detailData$marketPla.marketLogo
      }));
    }
  }, {
    title: 'Price',
    width: 190,
    dataIndex: 'price',
    key: 'price',
    render: function render(text, record) {
      return record.action === 'Sale' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "$", record.priceOfUsd), /*#__PURE__*/React.createElement("span", {
        className: "text-xs leading-5 text-base-200"
      }, "(", text, " ", record.priceSymbol, ")"));
    }
  }, {
    dataIndex: 'from',
    title: 'From',
    width: 196,
    render: function render(from) {
      if (!from) return /*#__PURE__*/React.createElement("div", null);
      var address = from.address,
        name = from.name;
      return /*#__PURE__*/React.createElement(ContractToken, {
        name: name,
        address: getAddress(address),
        type: AddressType.address,
        chainId: chainId
      });
    }
  }, {
    title: '',
    width: 40,
    dataIndex: '',
    key: 'from_to',
    render: function render() {
      return /*#__PURE__*/React.createElement(IconFont, {
        className: "text-[24px]",
        type: "fromto"
      });
    }
  }, {
    dataIndex: 'to',
    title: 'To',
    // width: 196,
    render: function render(to) {
      if (!to) return /*#__PURE__*/React.createElement("div", null);
      var address = to.address,
        name = to.name;
      return /*#__PURE__*/React.createElement(ContractToken, {
        name: name,
        address: getAddress(address),
        type: AddressType.address,
        chainId: chainId
      });
    }
  }];
}