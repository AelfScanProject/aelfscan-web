import React from 'react';
import IconFont from '@_components/IconFont';
import "../detail.css";
import ContractToken from '@_components/ContractToken';
import { AddressType } from '@_types/common';
import { useSearchParams } from 'next/navigation';
import { addSymbol, thousandsNumber } from '@_utils/formatter';
import EPTooltip from '@_components/EPToolTip';
export default function OverView(props) {
  var _overview$nftCollecti, _overview$nftCollecti2;
  var searchParams = useSearchParams();
  var chain = searchParams.get('chainId');
  var overview = props.overview;
  return /*#__PURE__*/React.createElement("div", {
    className: "collection-overview-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "collection-overview-header"
  }, /*#__PURE__*/React.createElement("span", null, overview === null || overview === void 0 || (_overview$nftCollecti = overview.nftCollection) === null || _overview$nftCollecti === void 0 ? void 0 : _overview$nftCollecti.name), /*#__PURE__*/React.createElement("span", {
    className: "ml-1 text-base-200"
  }, "(", overview === null || overview === void 0 || (_overview$nftCollecti2 = overview.nftCollection) === null || _overview$nftCollecti2 === void 0 ? void 0 : _overview$nftCollecti2.symbol, ")")), /*#__PURE__*/React.createElement("div", {
    className: "collection-overview-body"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "flex items-center"
  }, "Overview"), /*#__PURE__*/React.createElement("div", {
    className: "collection-overview-data"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "collection-overview-left"
  }, /*#__PURE__*/React.createElement("li", {
    className: "collection-overview-data-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "title"
  }, /*#__PURE__*/React.createElement("span", {
    className: "icon"
  }, /*#__PURE__*/React.createElement(EPTooltip, {
    title: "The total number of NFT items in the collection",
    mode: "dark",
    pointAtCenter: true
  }, /*#__PURE__*/React.createElement(IconFont, {
    type: "question-circle"
  }))), "ITEMS"), /*#__PURE__*/React.createElement("div", {
    className: "desc"
  }, thousandsNumber(overview.items))), /*#__PURE__*/React.createElement("li", {
    className: "collection-overview-data-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "title"
  }, "HOLDERS"), /*#__PURE__*/React.createElement("div", {
    className: "desc"
  }, thousandsNumber(overview.holders))), /*#__PURE__*/React.createElement("li", {
    className: "collection-overview-data-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "title"
  }, "TOTAL TRANSFERS"), /*#__PURE__*/React.createElement("div", {
    className: "desc"
  }, thousandsNumber(overview.transferCount)))), /*#__PURE__*/React.createElement("ul", {
    className: "collection-overview-right"
  }, /*#__PURE__*/React.createElement("li", {
    className: "collection-overview-data-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "title"
  }, /*#__PURE__*/React.createElement("span", {
    className: "icon"
  }, /*#__PURE__*/React.createElement(EPTooltip, {
    title: "This is the MultiToken contract that defines a common implementation for fungible and non-fungible tokens.",
    mode: "dark",
    pointAtCenter: true
  }, /*#__PURE__*/React.createElement(IconFont, {
    type: "question-circle"
  }))), "CONTRACT"), /*#__PURE__*/React.createElement("div", {
    className: "desc item-center flex"
  }, /*#__PURE__*/React.createElement(IconFont, {
    className: "mr-1 text-sm",
    type: "Contract"
  }), /*#__PURE__*/React.createElement(ContractToken, {
    address: overview.tokenContractAddress,
    type: AddressType.address,
    chainId: chain
  }))), /*#__PURE__*/React.createElement("li", {
    className: "collection-overview-data-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "title"
  }, /*#__PURE__*/React.createElement("span", {
    className: "icon"
  }, /*#__PURE__*/React.createElement(EPTooltip, {
    title: "The lowest listing price of an NFT item in the collection",
    mode: "dark",
    pointAtCenter: true
  }, /*#__PURE__*/React.createElement(IconFont, {
    type: "question-circle"
  }))), "FLOOR PRICE"), /*#__PURE__*/React.createElement("div", {
    className: "desc h-[22px]"
  }, overview.floorPrice !== -1 ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "inline-block leading-[22px]"
  }, "$", overview.floorPriceOfUsd), /*#__PURE__*/React.createElement("span", {
    className: "ml-1 inline-block text-xs leading-[22px] text-base-200"
  }, "(", addSymbol(overview.floorPrice), ")")) : '--'))))));
}