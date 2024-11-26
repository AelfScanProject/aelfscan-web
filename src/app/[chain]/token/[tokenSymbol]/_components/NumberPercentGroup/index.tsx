import { thousandsNumber } from '@_utils/formatter';
import { Flex } from 'antd';
import { useMemo } from 'react';

interface INumberPercentGroupProps {
  number: string | number;
  percent: string | number;
  decorator?: string;
  className?: string;
}

export default function NumberPercentGroup({ number, percent, decorator, className }: INumberPercentGroupProps) {
  const renderPercent = useMemo(() => {
    const percentNum = Number(percent);
    const isGteZero = percentNum >= 0;
    if (Number.isNaN(percentNum)) return <div className="text-base">{'(--)'}</div>;
    return (
      <>
        <div
          className={`${isGteZero ? 'text-success' : 'text-destructive'} text-base font-medium`}>{`(${isGteZero ? '+' : ''}${percentNum}%)`}</div>
      </>
    );
  }, [percent]);

  return (
    <Flex gap={4}>
      <div className={`text-base font-medium ${className}`}>
        {decorator}
        {thousandsNumber(number)}
      </div>
      {renderPercent}
    </Flex>
  );
}
