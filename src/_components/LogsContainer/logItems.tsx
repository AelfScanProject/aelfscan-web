import React, { useMemo, useState } from 'react';
import { ILogsProps } from './type';
import CodeBlock from '@_components/CodeBlock';
import { Button } from 'aelf-design';
import './logItem.css';
import { deserializeLog } from '@_utils/deserializeLog';
import { useParams } from 'next/navigation';
import { message } from 'antd';
import { useEffectOnce } from 'react-use';
import { useMobileContext } from '@app/pageProvider';
function LogItems({ data }: { data: ILogsProps }) {
  const { config } = useMobileContext();
  const originData = useMemo(() => {
    return {
      Indexed: data.indexed && JSON.parse(data.indexed),
      NonIndexed: data.nonIndexed,
      Address: data.contractInfo?.address,
      Name: data.eventName,
    };
  }, [data]);
  const [loading, setLoading] = useState(true);
  const code = JSON.stringify(originData, null, 2);
  const [result, setResult] = useState<any>();
  const { chain } = useParams<{ chain: string }>();

  const [hasDecoded, setHasDecoded] = useState<boolean>(true);

  function decodeData() {
    deserializeLog(originData, config['rpcUrl' + chain])
      .then((res) => {
        console.log(res, 'res');
        if (Object.keys(res).length === 0) {
          throw new Error('Decode failed');
        }
        setResult(res);
        setLoading(false);
        setHasDecoded(true);
      })
      .catch((e) => {
        console.log(e, 'errrrrr');
        message.error('Decode failed');
        setLoading(false);
      });
  }

  useEffectOnce(() => {
    decodeData();
  });

  function decode() {
    setHasDecoded(!hasDecoded);
  }

  return (
    <div className="log-item">
      {
        <>
          <CodeBlock value={hasDecoded ? JSON.stringify(result, null, 2) : code} />
          <Button ghost className="log-button" loading={loading} onClick={decode}>
            {hasDecoded ? 'Encode' : 'Decode'}
          </Button>
        </>
      }
    </div>
  );
}

export default React.memo(LogItems);
