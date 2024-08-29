/*
 * @Author: Peterbjx jianxiong.bai@aelf.io
 * @Date: 2023-08-14 18:13:54
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-18 16:22:36
 * @Description: columns config
 */

import { addSymbol, divDecimals, formatDate } from '@_utils/formatter';
import Link from 'next/link';
import IconFont from '@_components/IconFont';
import Method from '@_components/Method';
import ContractToken from '@_components/ContractToken';
import TransactionsView from '@_components/TransactionsView';
import { TransactionStatus } from '@_api/type';
import EPTooltip from '@_components/EPToolTip';
import Copy from '@_components/Copy';
import React from 'react';
export default function getColumns(_ref) {
  var timeFormat = _ref.timeFormat,
    handleTimeChange = _ref.handleTimeChange,
    _ref$chainId = _ref.chainId,
    chainId = _ref$chainId === void 0 ? 'AELF' : _ref$chainId;
  return [{
    title: /*#__PURE__*/React.createElement(EPTooltip, {
      title: "See preview of the transaction details.",
      mode: "dark"
    }, /*#__PURE__*/React.createElement(IconFont, {
      className: "ml-[6px] cursor-pointer text-xs",
      type: "question-circle"
    })),
    width: 72,
    dataIndex: '',
    key: 'view',
    render: function render(record) {
      return /*#__PURE__*/React.createElement(TransactionsView, {
        record: record
      });
    }
  }, {
    dataIndex: 'transactionId',
    width: 168,
    key: 'transactionId',
    title: 'Txn Hash',
    render: function render(text, records) {
      return /*#__PURE__*/React.createElement("div", {
        className: "flex items-center"
      }, records.status === TransactionStatus.Failed && /*#__PURE__*/React.createElement(IconFont, {
        className: "mr-1",
        type: "question-circle-error"
      }), /*#__PURE__*/React.createElement(EPTooltip, {
        title: text,
        mode: "dark"
      }, /*#__PURE__*/React.createElement(Link, {
        className: "block w-[120px] truncate text-link",
        href: "/".concat(chainId, "/tx/").concat(text)
      }, text)), /*#__PURE__*/React.createElement(Copy, {
        value: text
      }));
    }
  }, {
    title: /*#__PURE__*/React.createElement("div", {
      className: "cursor-pointer font-medium"
    }, /*#__PURE__*/React.createElement("span", null, "Method"), /*#__PURE__*/React.createElement(EPTooltip, {
      title: "Function executed based on input data. ",
      mode: "dark"
    }, /*#__PURE__*/React.createElement(IconFont, {
      className: "ml-1 text-xs",
      type: "question-circle"
    }))),
    width: 128,
    dataIndex: 'method',
    key: 'method',
    render: function render(text) {
      return /*#__PURE__*/React.createElement(Method, {
        text: text,
        tip: text
      });
    }
  }, {
    title: 'Block',
    width: 112,
    dataIndex: 'blockHeight',
    key: 'blockHeight',
    render: function render(text) {
      return /*#__PURE__*/React.createElement(Link, {
        className: "block text-link",
        href: "/".concat(chainId, "/block/").concat(text)
      }, text);
    }
  }, {
    title: /*#__PURE__*/React.createElement("div", {
      className: "time cursor-pointer font-medium text-link",
      onClick: handleTimeChange,
      onKeyDown: handleTimeChange
    }, timeFormat),
    width: 144,
    dataIndex: 'timestamp',
    key: 'timestamp',
    render: function render(text) {
      return /*#__PURE__*/React.createElement("div", null, formatDate(text, timeFormat));
    }
  }, {
    dataIndex: 'from',
    title: 'From',
    width: 196,
    render: function render(fromData) {
      var address = fromData.address;
      return /*#__PURE__*/React.createElement(ContractToken, {
        address: address,
        name: fromData.name,
        chainId: chainId,
        type: fromData.addressType
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
    render: function render(toData) {
      var address = toData.address;
      return /*#__PURE__*/React.createElement(ContractToken, {
        address: address,
        name: toData.name,
        chainId: chainId,
        type: toData.addressType
      });
    }
  }, {
    title: 'Value',
    width: 148,
    key: 'transactionValue',
    dataIndex: 'transactionValue',
    render: function render(text) {
      return /*#__PURE__*/React.createElement("span", {
        className: "break-all text-base-100"
      }, text != null ? addSymbol(divDecimals(text)) : '-');
    }
  }, {
    title: 'Txn Fee',
    width: 158,
    key: 'transactionFee',
    dataIndex: 'transactionFee',
    render: function render(text) {
      return /*#__PURE__*/React.createElement("span", {
        className: "break-all text-base-200"
      }, addSymbol(divDecimals(text)));
    }
  }];
}