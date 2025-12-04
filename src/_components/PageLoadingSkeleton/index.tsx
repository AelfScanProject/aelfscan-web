import { Skeleton } from 'antd';

export default function Loading() {
  return (
    <div className="main-skeleton h-[calc(100vh-474px)] pt-[50px]">
      <Skeleton active />
      <Skeleton className="mt-2" active />
    </div>
  );
}
