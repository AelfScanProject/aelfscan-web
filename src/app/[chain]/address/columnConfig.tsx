/*
 * @Author: Peterbjx jianxiong.bai@aelf.io
 * @Date: 2023-08-14 18:13:54
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-16 16:46:11
 * @Description: columns config
 */
import { ColumnsType } from 'antd/es/table';
import { numberFormatter, thousandsNumber } from '@_utils/formatter';
import IconFont from '@_components/IconFont';
import EPTooltip from '@_components/EPToolTip';
import { IAccountsItem } from '@_api/type';
import ContractToken from '@_components/ContractToken';
import { AddressType } from '@_types/common';
export default function getColumns(currentPage, pageSize, chain): ColumnsType<IAccountsItem> {
  return [
    {
      title: '#',
      dataIndex: 'rank',
      width: '112px',
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      width: '394px',
      render: (text, record) => (
        <div className="address flex items-center">
          {record.addressType === AddressType.Contract && (
            <EPTooltip title="Contract" mode="light">
              <IconFont className="mr-1" type="Contract" />
            </EPTooltip>
          )}
          <ContractToken address={text} type={AddressType.address} chainId={chain} />
        </div>
      ),
    },
    {
      title: (
        <div>
          <IconFont className="mr-1 text-xs " type="Rank" />
          Balance
        </div>
      ),
      dataIndex: 'balance',
      width: '394px',
      render(balance) {
        return `${numberFormatter(balance)}`;
      },
    },
    {
      title: (
        <div>
          <span>Percentage</span>
          <EPTooltip title="The percentage of the circulating ELF supply held by the account" mode="light">
            <IconFont className="ml-[6px] text-xs" type="question-circle" />
          </EPTooltip>
        </div>
      ),
      dataIndex: 'percentage',
      width: '224px',
      render(percentage) {
        return `${percentage}%`;
      },
    },
    {
      title: (
        <div>
          <span>Transfers</span>
          <EPTooltip title="Total transactions related to the account" mode="light">
            <IconFont className="ml-[6px] text-xs" type="question-circle" />
          </EPTooltip>
        </div>
      ),
      dataIndex: 'transactionCount',
      width: '224px',
      render(transactionCount) {
        return `${thousandsNumber(transactionCount)}`;
      },
    },
  ];
}
