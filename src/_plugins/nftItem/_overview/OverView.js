import React from 'react';
import Link from 'next/link';
import IconFont from '@_components/IconFont';
import { Collapse } from 'antd';
import OverViewDetail from "./OverViewDetail";
import OverViewProperty from "./OverViewProperty";
import NFTImage from '@_components/NFTImage';
import { Typography } from 'antd';
import { useSearchParams } from 'next/navigation';
var Paragraph = Typography.Paragraph;
export default function OverView(props) {
  var _overview$item, _overview$item2, _overview$nftCollecti, _overview$nftCollecti2, _overview$nftCollecti3;
  var overview = props.overview,
    onHolderClick = props.onHolderClick;
  var description = overview.description,
    properties = overview.properties;
  var searchParams = useSearchParams();
  var chain = searchParams.get('chainId');
  var collapseItems = [{
    key: '1',
    showArrow: false,
    label: /*#__PURE__*/React.createElement("div", {
      className: "nft-detail-label"
    }, /*#__PURE__*/React.createElement("div", {
      className: "nft-detail-label-left"
    }, /*#__PURE__*/React.createElement(IconFont, {
      type: "document"
    }), /*#__PURE__*/React.createElement("span", null, "Details")), /*#__PURE__*/React.createElement("div", {
      className: "nft-detail-label-right"
    }, /*#__PURE__*/React.createElement(IconFont, {
      type: "Down"
    }))),
    children: /*#__PURE__*/React.createElement(OverViewDetail, {
      overview: overview,
      onHolderClick: onHolderClick
    })
  }];
  if (properties) {
    collapseItems.push({
      key: '2',
      showArrow: false,
      collapsible: properties ? 'header' : 'disabled',
      label: /*#__PURE__*/React.createElement("div", {
        className: "nft-detail-label"
      }, /*#__PURE__*/React.createElement("div", {
        className: "nft-detail-label-left"
      }, /*#__PURE__*/React.createElement(IconFont, {
        type: "box"
      }), /*#__PURE__*/React.createElement("span", null, "Properties (", properties === null || properties === void 0 ? void 0 : properties.length, ")")), /*#__PURE__*/React.createElement("div", {
        className: "nft-detail-label-right"
      }, /*#__PURE__*/React.createElement(IconFont, {
        type: "Down"
      }))),
      children: /*#__PURE__*/React.createElement(OverViewProperty, {
        properties: properties
      })
    });
  }
  if (description) {
    collapseItems.push({
      key: '3',
      showArrow: false,
      label: /*#__PURE__*/React.createElement("div", {
        className: "nft-detail-label"
      }, /*#__PURE__*/React.createElement("div", {
        className: "nft-detail-label-left"
      }, /*#__PURE__*/React.createElement(IconFont, {
        type: "page"
      }), /*#__PURE__*/React.createElement("span", null, "Description")), /*#__PURE__*/React.createElement("div", {
        className: "nft-detail-label-right"
      }, /*#__PURE__*/React.createElement(IconFont, {
        type: "Down"
      }))),
      children: /*#__PURE__*/React.createElement("div", {
        className: "nft-detail-ul flex"
      }, /*#__PURE__*/React.createElement(Paragraph, {
        ellipsis: {
          rows: 5,
          expandable: true,
          symbol: 'more'
        }
      }, description))
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "ntf-overview-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nft-image-wrap"
  }, /*#__PURE__*/React.createElement(NFTImage, {
    className: "nft-image",
    src: (_overview$item = overview.item) === null || _overview$item === void 0 ? void 0 : _overview$item.imageUrl
  })), /*#__PURE__*/React.createElement("div", {
    className: "nft-detail-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nft-title-wrap"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "nft-title"
  }, (_overview$item2 = overview.item) === null || _overview$item2 === void 0 ? void 0 : _overview$item2.name), /*#__PURE__*/React.createElement("div", {
    className: "nft-thumb"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nft-thumb-image-wrap"
  }, /*#__PURE__*/React.createElement(NFTImage, {
    className: "aspect-square w-full object-cover",
    src: (_overview$nftCollecti = overview.nftCollection) === null || _overview$nftCollecti === void 0 ? void 0 : _overview$nftCollecti.imageUrl
  })), /*#__PURE__*/React.createElement(Link, {
    href: "/nft?chainId=".concat(chain, "&&collectionSymbol=").concat((_overview$nftCollecti2 = overview.nftCollection) === null || _overview$nftCollecti2 === void 0 ? void 0 : _overview$nftCollecti2.symbol),
    className: "text-link"
  }, (_overview$nftCollecti3 = overview.nftCollection) === null || _overview$nftCollecti3 === void 0 ? void 0 : _overview$nftCollecti3.name))), /*#__PURE__*/React.createElement("div", {
    className: "nft-detail"
  }, /*#__PURE__*/React.createElement(Collapse, {
    defaultActiveKey: ['1'],
    items: collapseItems,
    ghost: true
  }))));
}