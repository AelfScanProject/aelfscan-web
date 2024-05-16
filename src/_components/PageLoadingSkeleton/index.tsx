import { useIsGovernance } from '@_hooks/useIsPath';
import { Skeleton } from 'antd';

export default function Loading() {
  const isGovernance = useIsGovernance();
  return (
    !isGovernance && (
      <div className="main-skeleton h-[calc(100vh-474px)] pt-[50px]">
        <Skeleton active />
        <Skeleton className="mt-2" active />
      </div>
    )
  );
}
