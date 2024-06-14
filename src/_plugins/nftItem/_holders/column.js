import React from 'react';
import ContractToken from '@_components/ContractToken';
import { thousandsNumber } from '@_utils/formatter';
export default function getColumns(currentPage, pageSize, chain) {
  return [{
    title: /*#__PURE__*/React.createElement("span", null, "#"),
    width: 144,
    dataIndex: '',
    key: 'rank',
    render: function render(text, record, index) {
      return (currentPage - 1) * pageSize + index + 1;
    }
  }, {
    dataIndex: 'address',
    width: 448,
    key: 'address',
    title: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Address")),
    render: function render(data) {
      var name = data.name,
        addressType = data.addressType,
        address = data.address;
      return /*#__PURE__*/React.createElement("div", {
        className: "address flex items-center"
      }, /*#__PURE__*/React.createElement(ContractToken, {
        name: name,
        type: addressType,
        address: address,
        chainId: chain
      }));
    }
  }, {
    title: /*#__PURE__*/React.createElement("span", null, "Quantity"),
    width: 384,
    dataIndex: 'quantity',
    key: 'quantity',
    render: function render(quantity) {
      return /*#__PURE__*/React.createElement("span", null, thousandsNumber(quantity));
    }
  }, {
    title: /*#__PURE__*/React.createElement("span", null, "Percentage"),
    width: 384,
    dataIndex: 'percentage',
    key: 'percentage',
    render: function render(percentage) {
      return /*#__PURE__*/React.createElement("span", null, percentage, "%");
    }
  }];
}