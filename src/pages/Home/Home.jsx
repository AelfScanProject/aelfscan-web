import React, { useEffect, useState, useCallback, useMemo } from "react";
import TPSChart from "../../components/TPSChart/TPSChart";
import {
  ALL_BLOCKS_UNCONFIRMED_BLOCKS_API_URL,
  ALL_TXS_UNCONFIRMED_TXS_API_URL,
  BASIC_INFO,
  ELF_REALTIME_PRICE_URL,
  HISTORY_PRICE,
  TPS_LIST_API_URL,
} from "../../constants";
import { get, transactionFormat } from "../../utils";
import ChainInfo from "./components/ChainInfo";
import LatestInfo from "./components/LatestInfo";
import Search from "./components/Search";
import useMobile from "../../hooks/useMobile";
import { CHAIN_ID } from "../../../config/config.json";

import "./home.styles.less";
import { initSocket } from "./socket";
import { NETWORK_TYPE } from "../../../config/config";

const PAGE_SIZE = 25;
const interval = 60 * 1000; // 1 minute
const delay = 5 * 60 * 1000; // 5 minute
const TokenIcon = require("../../assets/images/tokenLogo.png");

let blockHeight = 0;

export default function Home() {
  const [price, setPrice] = useState({ USD: 0 });
  const [previousPrice, setPreviousPrice] = useState({ usd: 0 });
  const [blocks, setBlocks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [reward, setReward] = useState({ ELF: 0 });
  const [localTransactions, setLocalTransactions] = useState(0);
  const [localAccounts, setLocalAccounts] = useState(0);
  const isMobile = useMobile();
  const latestSection = useMemo(
    () => <LatestInfo blocks={blocks} transactions={transactions} />,
    [blocks, transactions]
  );
  const [tpsData, setTpsData] = useState({
    ownList: [],
    allList: [],
  });
  const [ownTpsData, setOwnTpsData] = useState([]);

  const range = useMemo(() => {
    if (price.USD && previousPrice.usd) {
      return ((price.USD - previousPrice.usd) / previousPrice.usd) * 100;
    }
    return 0;
  }, [price.USD, previousPrice.usd]);

  useEffect(() => {
    const d = new Date();
    get(ELF_REALTIME_PRICE_URL, { fsym: "ELF", tsyms: "USD,BTC,CNY" }).then(
      (res) => setPrice(res)
    );
    // set zh to keep correct date type
    get(HISTORY_PRICE, {
      token_id: "aelf",
      vs_currencies: "usd",
      date:
        new Date(d.toLocaleDateString("zh")).valueOf() -
        d.getTimezoneOffset() * 60000 -
        24 * 3600 * 1000,
    }).then((res) => {
      if (!res.message) {
        setPreviousPrice(res);
      }
    });
  }, [window.location]);

  const fetch = useCallback(async (url) => {
    const res = await get(url, {
      page: 0,
      limit: PAGE_SIZE,
      order: "desc",
    });

    return res;
  }, []);

  const initBasicInfo = useCallback(async () => {
    const result = await get(BASIC_INFO);
    const { height = 0, accountNumber = 0 } = result;
    blockHeight = height;
    setLocalAccounts(accountNumber);
  }, []);

  const initBlock = useCallback(async () => {
    const blocksResult = await fetch(ALL_BLOCKS_UNCONFIRMED_BLOCKS_API_URL);
    const { blocks: allBlocks } = blocksResult;
    setBlocks(allBlocks);
  }, []);

  const initTxs = useCallback(async () => {
    const TXSResult = await fetch(ALL_TXS_UNCONFIRMED_TXS_API_URL);
    const { transactions: txns } = TXSResult;
    const totalTransactions = TXSResult.total;
    setTransactions(txns);
    setLocalTransactions(totalTransactions);
  }, []);

  const formatBlock = useCallback((block) => {
    const { BlockHash, Header, Body } = block;
    return {
      block_hash: BlockHash,
      block_height: +Header.Height,
      chain_id: Header.ChainId,
      merkle_root_state: Header.MerkleTreeRootOfWorldState,
      merkle_root_tx: Header.MerkleTreeRootOfTransactions,
      pre_block_hash: Header.PreviousBlockHash,
      time: Header.Time,
      tx_count: Body.TransactionsCount,
      dividends: block.dividend,
      miner: block.miner,
    };
  }, []);

  const handleSocketData = useCallback(
    (
      { list = [], height = 0, totalTxs, accountNumber = 0, dividends },
      isFirst
    ) => {
      let arr = list;
      if (!isFirst) {
        arr = list.filter((item) => {
          return item.block.Header.Height > blockHeight;
        });
      }
      arr.sort(
        (pre, next) => next.block.Header.Height - pre.block.Header.Height
      );
      const newTransactions = arr
        .reduce((acc, i) => acc.concat(i.txs), [])
        .map(transactionFormat);
      const newBlocks = arr.map((item) => formatBlock(item.block));
      blockHeight = height;
      setTransactions((v) => {
        const temp = Object.fromEntries(
          [...newTransactions, ...v].map((item) => [item.tx_id, item])
        );
        return Object.entries(temp)
          .map((item) => item[1])
          .sort((a, b) => b.block_height - a.block_height)
          .slice(0, 25);
      });
      setBlocks((v) => {
        const temp = Object.fromEntries(
          [...newBlocks, ...v].map((item) => [item.block_height, item])
        );
        return Object.entries(temp)
          .map((item) => item[1])
          .sort((a, b) => b.block_height - a.block_height)
          .slice(0, 25);
      });
      setLocalAccounts(accountNumber);
      setLocalTransactions(totalTxs);
      setReward(
        typeof dividends === "string" ? JSON.parse(dividends) : dividends || {}
      );
    },
    []
  );
  useEffect(() => {
    const socket = initSocket(handleSocketData);
    initBasicInfo();
    initBlock();
    initTxs();
    return () => {
      socket.close();
    };
  }, [initSocket]);

  const getTpsData = async () => {
    const endTime = new Date().getTime() - delay;
    // 1000 * 24 * 60 * 60, millisecond one day
    // const startTime = endTime - 86400000;
    const startTime = endTime - 60 * 60 * 3 * 1000;
    const { all = [], own = [] } = await get(TPS_LIST_API_URL, {
      start: startTime,
      end: endTime,
      // 1 minute
      interval,
    });
    setTpsData({
      allList: all || [],
      ownList: own || [],
    });
    setOwnTpsData(own || []);
  };

  useEffect(() => {
    getTpsData();
  }, []);
  useEffect(() => {
    const getTpsDataTimer = setTimeout(() => {
      getTpsData();
    }, 2 * 60 * 1000);
    return () => clearTimeout(getTpsDataTimer);
  }, [tpsData]);

  return (
    <div
      className={`home-container basic-container-new ${
        isMobile ? "mobile" : ""
      }`}
    >
      <section className="banner-section">
        <h2>AELF Explorer</h2>
        <Search />
      </section>
      <div className="body-container">
        <section className="info-section">
          <ChainInfo
            price={price}
            range={range}
            blockHeight={blockHeight}
            localTransactions={localTransactions}
            tpsData={ownTpsData[ownTpsData.length - 1]?.count}
            reward={reward}
            localAccounts={localAccounts}
          />
        </section>
        <section className="latest-section">{latestSection}</section>
        <section className="chart-section">
          <h3>Transactions Per Minute</h3>
          <TPSChart tpsData={tpsData} />
        </section>
      </div>
    </div>
  );
}
