import React from 'react';
import { formatDate, thousandsNumber } from '@_utils/formatter';
import Copy from '@_components/Copy';
import Link from 'next/link';
import IconFont from '@_components/IconFont';
import ContractToken from '@_components/ContractToken';
import TransactionsView from '@_components/TransactionsView';
import EPTooltip from '@_components/EPToolTip';
import { TransactionStatus } from '@_api/type';
import Method from '@_components/Method';
import NFTImage from '@_components/NFTImage';
export default function getColumns(_ref) {
  var timeFormat = _ref.timeFormat,
    handleTimeChange = _ref.handleTimeChange,
    chainId = _ref.chainId;
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
        record: record,
        custom: true
      });
    }
  }, {
    dataIndex: 'transactionId',
    width: 168,
    key: 'transactionId',
    title: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Txn Hash")),
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
        href: "/".concat(chainId, "/tx/").concat(text, "?blockHeight=").concat(records.blockHeight)
      }, text)), /*#__PURE__*/React.createElement(Copy, {
        value: text
      }));
    }
  }, {
    dataIndex: 'method',
    width: 128,
    key: 'method',
    title: /*#__PURE__*/React.createElement("div", {
      className: "cursor-pointer font-medium"
    }, /*#__PURE__*/React.createElement("span", null, "Method"), /*#__PURE__*/React.createElement(EPTooltip, {
      title: "Function executed based on input data. ",
      mode: "dark"
    }, /*#__PURE__*/React.createElement(IconFont, {
      className: "ml-1 text-xs",
      type: "question-circle"
    }))),
    render: function render(text) {
      return /*#__PURE__*/React.createElement(Method, {
        text: text,
        tip: text
      });
    }
  }, {
    title: /*#__PURE__*/React.createElement("div", {
      className: "time cursor-pointer font-medium text-link",
      onClick: handleTimeChange,
      onKeyDown: handleTimeChange
    }, timeFormat),
    width: 144,
    dataIndex: 'blockTime',
    key: 'blockTime',
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
    width: 196,
    render: function render(toData) {
      console.log(toData, 'toData');
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
    width: 192,
    dataIndex: 'value',
    key: 'value',
    render: function render(text) {
      return /*#__PURE__*/React.createElement("span", null, thousandsNumber(text));
    }
  }, {
    title: 'Item',
    width: 224,
    dataIndex: 'item',
    key: 'item',
    render: function render(item) {
      return /*#__PURE__*/React.createElement("div", {
        className: "collection-transfer-item"
      }, /*#__PURE__*/React.createElement("div", {
        className: "mr-[4px] size-[40px] rounded-lg"
      }, /*#__PURE__*/React.createElement(NFTImage, {
        width: "40px",
        height: "40px",
        src: item.imageUrl
      })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        className: "name h-[20px] w-[140px] truncate leading-20"
      }, item.name), /*#__PURE__*/React.createElement("div", {
        className: "symbol h-[18px] w-[124px] truncate leading-20"
      }, item.symbol)));
    }
  }];
}