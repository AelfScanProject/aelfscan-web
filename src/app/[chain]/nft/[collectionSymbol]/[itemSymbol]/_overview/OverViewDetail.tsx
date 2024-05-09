import IconFont from '@_components/IconFont';
import { Tooltip } from 'aelf-design';
import { Dropdown } from 'antd';
import Image from 'next/image';
import { ItemSymbolDetailOverview } from '../type';
import { checkMainNet } from '@_utils/isMainNet';
import { useParams } from 'next/navigation';
import { ChainId, CollectionSymbol, ItemSymbol } from 'global';
import { useEnvContext } from 'next-runtime-env';
import { formatDate, thousandsNumber } from '@_utils/formatter';
import EPTooltip from '@_components/EPToolTip';
import ContractToken from '@_components/ContractToken';
import { AddressType } from '@_types/common';

export interface OverViewDetailProps {
  overview: ItemSymbolDetailOverview;
  onHolderClick: () => void;
}

export default function OverViewDetail(props: OverViewDetailProps) {
  const params = useParams<CollectionSymbol & ItemSymbol & ChainId>();
  const { overview, onHolderClick } = props;
  const { issuer, owner } = overview;
  const { NEXT_PUBLIC_NETWORK_TYPE } = useEnvContext();
  const isMainNet = checkMainNet(NEXT_PUBLIC_NETWORK_TYPE);
  const { chain } = params;
  return (
    <ul className="nft-detail-ul">
      <li className="nft-detail-item">
        <div className="nft-detail-item-left">
          <EPTooltip mode="dark" title="Current holders of this NFT">
            <IconFont type="question-circle" />
          </EPTooltip>
          <span>Holders:</span>
        </div>
        <div className="nft-detail-item-right cursor-pointer text-link" onClick={onHolderClick}>
          {thousandsNumber(overview.holders)}
        </div>
      </li>
      <li className="nft-detail-item">
        <div className="nft-detail-item-left">
          <EPTooltip mode="dark" title="Accounts that are permitted to create this NFT">
            <IconFont type="question-circle" />
          </EPTooltip>
          <span>Owners:</span>
        </div>
        <div className="nft-detail-item-right">
          {owner.length === 1 && (
            <span>
              {' '}
              <ContractToken address={owner[0]} type={AddressType.address} chainId={chain} />
            </span>
          )}
          {owner.length > 1 && (
            <Dropdown
              menu={{
                items: owner.map((item) => {
                  return {
                    key: item,
                    label: (
                      <div className="address flex items-center text-link">
                        <ContractToken address={item} type={AddressType.address} chainId={chain} />
                      </div>
                    ),
                  };
                }),
              }}
              overlayClassName="nft-detail-dropdown"
              trigger={['click']}>
              <span>
                {owner.length}Owners <IconFont type="Down" />
              </span>
            </Dropdown>
          )}
        </div>
      </li>
      <li className="nft-detail-item">
        <div className="nft-detail-item-left">
          <EPTooltip mode="dark" title="The issuers of this NFT">
            <IconFont type="question-circle" />
          </EPTooltip>
          <span>Issuer:</span>
        </div>
        <div className="nft-detail-item-right">
          {issuer.length === 1 && (
            <span>
              <ContractToken address={issuer[0]} type={AddressType.address} chainId={chain} />
            </span>
          )}
          {issuer.length > 1 && (
            <Dropdown
              menu={{
                items: issuer.map((item) => {
                  return {
                    key: item,
                    label: (
                      <div className="address flex items-center text-link">
                        <ContractToken address={item} type={AddressType.address} chainId={chain} />
                      </div>
                    ),
                  };
                }),
              }}
              overlayClassName="nft-detail-dropdown"
              trigger={['click']}>
              <span>
                {issuer.length}Issuers <IconFont type="Down" />
              </span>
            </Dropdown>
          )}
        </div>
      </li>
      <li className="nft-detail-item">
        <div className="nft-detail-item-left">
          <EPTooltip mode="dark" title="The NFT‘s unique token symbol">
            <IconFont type="question-circle" />
          </EPTooltip>
          <span>Token Symbol:</span>
        </div>
        <div className="nft-detail-item-right">{overview.tokenSymbol}</div>
      </li>
      <li className="nft-detail-item">
        <div className="nft-detail-item-left">
          <EPTooltip mode="dark" title="Current quantity of this NFT">
            <IconFont type="question-circle" />
          </EPTooltip>
          <span>Quantity:</span>
        </div>
        <div className="nft-detail-item-right">{thousandsNumber(overview.quantity)}</div>
      </li>
      {overview.isSeed && (
        <li className="nft-detail-item">
          <div className="nft-detail-item-left">
            <EPTooltip mode="dark" title="Symbol to Create">
              <IconFont type="question-circle" />
            </EPTooltip>
            <span>Symbol to Create:</span>
          </div>
          <div className="nft-detail-item-right">{overview.symbolToCreate}</div>
        </li>
      )}
      {overview.isSeed && (
        <li className="nft-detail-item">
          <div className="nft-detail-item-left">
            <EPTooltip mode="dark" title="Expires">
              <IconFont type="question-circle" />
            </EPTooltip>
            <span>Expires:</span>
          </div>
          <div className="nft-detail-item-right">{formatDate(overview.expireTime, 'Date Time (UTC)')}</div>
        </li>
      )}
      {isMainNet && overview.marketPlaces && (
        <li className="nft-detail-item">
          <div className="nft-detail-item-left">
            <EPTooltip mode="dark" title="Marketplaces trading this NFT">
              <IconFont type="question-circle" />
            </EPTooltip>
            <span>Marketplaces:</span>
          </div>
          <div className="nft-detail-item-right">
            <span
              className="flex"
              onClick={() => {
                window?.open(overview.marketPlaces?.marketUrl);
              }}>
              <Image src={overview.marketPlaces?.marketLogo} alt="" width={20} height={20} />
              <Tooltip title={`view on ${overview.marketPlaces?.marketName}`}>
                {overview.marketPlaces?.marketName}
              </Tooltip>
            </span>
          </div>
        </li>
      )}
    </ul>
  );
}
