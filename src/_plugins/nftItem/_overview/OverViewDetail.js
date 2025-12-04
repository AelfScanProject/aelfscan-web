import React from 'react';
import IconFont from '@_components/IconFont';
import { Tooltip } from 'aelf-design';
import { Dropdown } from 'antd';
import { checkMainNet } from '@_utils/isMainNet';
import { useSearchParams } from 'next/navigation';
import { useEnvContext } from 'next-runtime-env';
import { formatDate, thousandsNumber } from '@_utils/formatter';
import EPTooltip from '@_components/EPToolTip';
import ContractToken from '@_components/ContractToken';
import { AddressType } from '@_types/common';
import NFTImage from '@_components/NFTImage';
export default function OverViewDetail(props) {
  var _overview$marketPlace2, _overview$marketPlace3, _overview$marketPlace4;
  var searchParams = useSearchParams();
  var chain = searchParams.get('chainId') || '';
  var overview = props.overview,
    onHolderClick = props.onHolderClick;
  var issuer = overview.issuer,
    owner = overview.owner;
  var _useEnvContext = useEnvContext(),
    NEXT_PUBLIC_NETWORK_TYPE = _useEnvContext.NEXT_PUBLIC_NETWORK_TYPE;
  var isMainNet = checkMainNet(NEXT_PUBLIC_NETWORK_TYPE);
  return /*#__PURE__*/React.createElement("ul", {
    className: "nft-detail-ul"
  }, /*#__PURE__*/React.createElement("li", {
    className: "nft-detail-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nft-detail-item-left"
  }, /*#__PURE__*/React.createElement(EPTooltip, {
    mode: "dark",
    title: "Current holders of this NFT"
  }, /*#__PURE__*/React.createElement(IconFont, {
    type: "question-circle"
  })), /*#__PURE__*/React.createElement("span", null, "Holders:")), /*#__PURE__*/React.createElement("div", {
    className: "nft-detail-item-right cursor-pointer text-link",
    onClick: onHolderClick
  }, thousandsNumber(overview.holders))), /*#__PURE__*/React.createElement("li", {
    className: "nft-detail-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nft-detail-item-left"
  }, /*#__PURE__*/React.createElement(EPTooltip, {
    mode: "dark",
    title: "Accounts that are permitted to create this NFT"
  }, /*#__PURE__*/React.createElement(IconFont, {
    type: "question-circle"
  })), /*#__PURE__*/React.createElement("span", null, "Owners:")), /*#__PURE__*/React.createElement("div", {
    className: "nft-detail-item-right"
  }, (owner === null || owner === void 0 ? void 0 : owner.length) === 1 && /*#__PURE__*/React.createElement("span", null, ' ', /*#__PURE__*/React.createElement(ContractToken, {
    address: owner[0],
    type: AddressType.address,
    chainId: chain
  })), (owner === null || owner === void 0 ? void 0 : owner.length) > 1 && /*#__PURE__*/React.createElement(Dropdown, {
    menu: {
      items: owner.map(function (item) {
        return {
          key: item,
          label: /*#__PURE__*/React.createElement("div", {
            className: "address flex items-center text-link"
          }, /*#__PURE__*/React.createElement(ContractToken, {
            address: item,
            type: AddressType.address,
            chainId: chain
          }))
        };
      })
    },
    overlayClassName: "nft-detail-dropdown",
    trigger: ['click']
  }, /*#__PURE__*/React.createElement("span", null, owner.length, "Owners ", /*#__PURE__*/React.createElement(IconFont, {
    type: "Down"
  }))))), /*#__PURE__*/React.createElement("li", {
    className: "nft-detail-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nft-detail-item-left"
  }, /*#__PURE__*/React.createElement(EPTooltip, {
    mode: "dark",
    title: "The issuers of this NFT"
  }, /*#__PURE__*/React.createElement(IconFont, {
    type: "question-circle"
  })), /*#__PURE__*/React.createElement("span", null, "Issuer:")), /*#__PURE__*/React.createElement("div", {
    className: "nft-detail-item-right"
  }, (issuer === null || issuer === void 0 ? void 0 : issuer.length) === 1 && /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(ContractToken, {
    address: issuer[0],
    type: AddressType.address,
    chainId: chain
  })), (issuer === null || issuer === void 0 ? void 0 : issuer.length) > 1 && /*#__PURE__*/React.createElement(Dropdown, {
    menu: {
      items: issuer.map(function (item) {
        return {
          key: item,
          label: /*#__PURE__*/React.createElement("div", {
            className: "address flex items-center text-link"
          }, /*#__PURE__*/React.createElement(ContractToken, {
            address: item,
            type: AddressType.address,
            chainId: chain
          }))
        };
      })
    },
    overlayClassName: "nft-detail-dropdown",
    trigger: ['click']
  }, /*#__PURE__*/React.createElement("span", null, issuer.length, "Issuers ", /*#__PURE__*/React.createElement(IconFont, {
    type: "Down"
  }))))), /*#__PURE__*/React.createElement("li", {
    className: "nft-detail-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nft-detail-item-left"
  }, /*#__PURE__*/React.createElement(EPTooltip, {
    mode: "dark",
    title: "The NFT\u2018s unique token symbol"
  }, /*#__PURE__*/React.createElement(IconFont, {
    type: "question-circle"
  })), /*#__PURE__*/React.createElement("span", null, "Token Symbol:")), /*#__PURE__*/React.createElement("div", {
    className: "nft-detail-item-right"
  }, overview.tokenSymbol)), /*#__PURE__*/React.createElement("li", {
    className: "nft-detail-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nft-detail-item-left"
  }, /*#__PURE__*/React.createElement(EPTooltip, {
    mode: "dark",
    title: "Current quantity of this NFT"
  }, /*#__PURE__*/React.createElement(IconFont, {
    type: "question-circle"
  })), /*#__PURE__*/React.createElement("span", null, "Quantity:")), /*#__PURE__*/React.createElement("div", {
    className: "nft-detail-item-right"
  }, thousandsNumber(overview.quantity))), overview.isSeed && /*#__PURE__*/React.createElement("li", {
    className: "nft-detail-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nft-detail-item-left"
  }, /*#__PURE__*/React.createElement(EPTooltip, {
    mode: "dark",
    title: "Symbol to Create"
  }, /*#__PURE__*/React.createElement(IconFont, {
    type: "question-circle"
  })), /*#__PURE__*/React.createElement("span", null, "Symbol to Create:")), /*#__PURE__*/React.createElement("div", {
    className: "nft-detail-item-right"
  }, overview.symbolToCreate)), overview.isSeed && /*#__PURE__*/React.createElement("li", {
    className: "nft-detail-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nft-detail-item-left"
  }, /*#__PURE__*/React.createElement(EPTooltip, {
    mode: "dark",
    title: "Expires"
  }, /*#__PURE__*/React.createElement(IconFont, {
    type: "question-circle"
  })), /*#__PURE__*/React.createElement("span", null, "Expires:")), /*#__PURE__*/React.createElement("div", {
    className: "nft-detail-item-right"
  }, formatDate(overview.expireTime, 'Date Time (UTC)'))), isMainNet && overview.marketPlaces && /*#__PURE__*/React.createElement("li", {
    className: "nft-detail-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nft-detail-item-left"
  }, /*#__PURE__*/React.createElement(EPTooltip, {
    mode: "dark",
    title: "Marketplaces trading this NFT"
  }, /*#__PURE__*/React.createElement(IconFont, {
    type: "question-circle"
  })), /*#__PURE__*/React.createElement("span", null, "Marketplaces:")), /*#__PURE__*/React.createElement("div", {
    className: "nft-detail-item-right"
  }, /*#__PURE__*/React.createElement("span", {
    className: "flex",
    onClick: function onClick() {
      var _window, _overview$marketPlace;
      (_window = window) === null || _window === void 0 || _window.open((_overview$marketPlace = overview.marketPlaces) === null || _overview$marketPlace === void 0 ? void 0 : _overview$marketPlace.marketUrl);
    }
  }, /*#__PURE__*/React.createElement(NFTImage, {
    className: "rounded-full",
    src: (_overview$marketPlace2 = overview.marketPlaces) === null || _overview$marketPlace2 === void 0 ? void 0 : _overview$marketPlace2.marketLogo,
    alt: "",
    width: 20,
    height: 20
  }), /*#__PURE__*/React.createElement(Tooltip, {
    title: "view on ".concat((_overview$marketPlace3 = overview.marketPlaces) === null || _overview$marketPlace3 === void 0 ? void 0 : _overview$marketPlace3.marketName)
  }, /*#__PURE__*/React.createElement("span", {
    className: "ml-1"
  }, (_overview$marketPlace4 = overview.marketPlaces) === null || _overview$marketPlace4 === void 0 ? void 0 : _overview$marketPlace4.marketName))))));
}