import React from 'react';
import { Tooltip } from 'aelf-design';
export default function OverViewDetail(props) {
  var properties = props.properties;
  return /*#__PURE__*/React.createElement("ul", {
    className: "nft-detail-ul nft-detail-block-wrap"
  }, properties === null || properties === void 0 ? void 0 : properties.map(function (item, index) {
    return /*#__PURE__*/React.createElement("li", {
      className: "nft-detail-block",
      key: index
    }, /*#__PURE__*/React.createElement("h1", null, item.title), /*#__PURE__*/React.createElement("h2", {
      className: "w-full truncate text-center"
    }, /*#__PURE__*/React.createElement(Tooltip, {
      title: item.value
    }, /*#__PURE__*/React.createElement("span", null, item.value))));
  }));
}