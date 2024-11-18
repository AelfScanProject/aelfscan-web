import IconFont from '@_components/IconFont';
import EPTooltip from '../EPToolTip/index';
import './index.css';
import Link from 'next/link';
import Status from '@_components/TransactionsStatus';
import { addSymbol, divDecimals } from '@_utils/formatter';
import { useParams } from 'next/navigation';
export default function TransactionsView({ record, custom = false }) {
  const { chain } = useParams();
  const transactionFee = custom && record.transactionFeeList?.length ? record.transactionFeeList[0] : {};
  const PreviewCard = () => {
    return (
      <div className="preview-view">
        <div className="header flex items-center justify-between p-2">
          <div className="title text-sm leading-[22px] ">Preview</div>
          <div className="more text-xs leading-5">
            <Link className="inline-block text-xs leading-5" href={`/${chain}/tx/${record.transactionId}`}>
              See More Details
            </Link>
          </div>
        </div>
        <div className="main">
          <div className="status mb-2">
            <div className="label">Status :</div>
            <div className="value">{record.status && <Status status={record.status} />}</div>
          </div>
          <div className="fee">
            <div className="label">Transaction Fee :</div>
            <div className="value text-xs leading-5 ">
              {!custom ? (
                <span>{record.transactionFee ? addSymbol(divDecimals(record.transactionFee)) : '--'}</span>
              ) : (
                <span>
                  {typeof transactionFee.amount === 'number'
                    ? `${transactionFee.amount} ${transactionFee.symbol} `
                    : '--'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <EPTooltip
      title={() => <PreviewCard />}
      className="transaction-tooltip"
      mode="light"
      trigger="click"
      pointAtCenter={false}>
      <div tabIndex={0} className="transaction-view">
        <IconFont type="eye" />
      </div>
    </EPTooltip>
  );
}
