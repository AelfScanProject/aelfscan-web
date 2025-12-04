import { Divider } from 'antd';
import { IHIGHLIGHTDataItem } from '../type';
import '../index.css';
import tipsIcon from 'public/image/lightbulb.svg';
import Image from 'next/image';

export default function Highlight({ highlightData, title }: { highlightData: IHIGHLIGHTDataItem[]; title: string }) {
  return (
    <div className="col-xl-3 col-lg-4 min-[993px]:pl-6">
      <div className="title mb-1  text-base font-semibold">About</div>
      <div className="text-sm">{title}</div>
      {highlightData.map((item) => {
        return (
          !item.hidden && (
            <div key={item.key}>
              <Divider className="!my-4 !border-border  min-[1025px]:!my-6" />
              {!item.hiddenTitle && (
                <div className="mb-1 flex items-center text-sm text-muted-foreground">
                  <Image className="mr-1" src={tipsIcon} alt="tips"></Image>HIGHLIGHT
                </div>
              )}
              <div className="text-sm">{item.text}</div>
            </div>
          )
        );
      })}
    </div>
  );
}
