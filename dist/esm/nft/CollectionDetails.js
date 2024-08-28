'use client';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React from 'react';
import Overview from "./_overview/OverView";
import EPTabs from '@_components/EPTabs';
import TransfersTable from "./_transfers/Table";
import HoldersTable from "./_holders/HoldersTable";
import Inventory from "./_inventory/Inventory";
import { useRef, useState } from 'react';
var TabKey = /*#__PURE__*/function (TabKey) {
  TabKey["holders"] = "holders";
  TabKey["empty"] = "";
  TabKey["inventory"] = "inventory";
  return TabKey;
}(TabKey || {});
var tabMap = _defineProperty(_defineProperty(_defineProperty({}, TabKey.holders, 'Holders'), TabKey.empty, 'Transfers'), TabKey.inventory, 'Inventory');
var unSearchItem = {
  key: TabKey.holders
};
var tabItems = [{
  key: TabKey.empty
}, unSearchItem, {
  key: TabKey.inventory
}];
export default function NFTDetails(props) {
  var overview = props.overview;
  console.log(overview, 'collection detail');
  var tabRef = useRef(null);
  var _useState = useState(tabItems),
    _useState2 = _slicedToArray(_useState, 1),
    tabList = _useState2[0];

  // init search value from url query

  var list = tabList.map(function (obj) {
    var key = obj.key;
    var children = /*#__PURE__*/React.createElement("div", null);
    if (key === TabKey.empty) {
      children = /*#__PURE__*/React.createElement(TransfersTable, null);
    } else if (key === TabKey.holders) {
      children = /*#__PURE__*/React.createElement(HoldersTable, null);
    } else {
      children = /*#__PURE__*/React.createElement(Inventory, null);
    }
    return {
      key: key,
      label: tabMap[key],
      children: children
    };
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Overview, {
    overview: overview
  }), /*#__PURE__*/React.createElement("div", {
    className: "collection-tab-wrap"
  }, /*#__PURE__*/React.createElement(EPTabs, {
    items: list,
    ref: tabRef
  })));
}