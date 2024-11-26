import React from 'react';
import { ILogsProps } from './type';
import DetailContainer from '@_components/DetailContainer';
import LogItems from './logItems';
import { useParams } from 'next/navigation';
import ContractToken from '@_components/ContractToken';
import { TChainID } from '@_api/type';
function LogsContainer({ Logs = [] }: { Logs: ILogsProps[] }) {
  const { chain } = useParams<{ chain: TChainID }>();
  return (
    <div className="log-container">
      <div className="log-list">
        {Logs.map((item, index) => (
          <div key={index} className="">
            <DetailContainer
              infoList={[
                {
                  label: 'Address',
                  value: (
                    <div>
                      <ContractToken
                        address={item.contractInfo.address}
                        name={item.contractInfo.name}
                        type={item.contractInfo.addressType}
                        chainIds={[chain]}
                        showChainId={false}
                      />
                    </div>
                  ),
                },
              ]}
            />
            <DetailContainer
              className={`${index === Logs.length - 1 && 'pb-6'}`}
              infoList={[
                {
                  label: 'Name',
                  value: (
                    <div className="name-container">
                      <div className="mb-4">{item.eventName}</div>
                      <LogItems data={item} chain={chain} />
                    </div>
                  ),
                },
              ]}
            />
            {index !== Logs.length - 1 && (
              <DetailContainer
                infoList={[
                  {
                    label: 'divider' + item.contractInfo?.address,
                    value: 'divider',
                  },
                ]}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
export default React.memo(LogsContainer);
