'use client';
import IconFont from '@_components/IconFont';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import CodeImg from 'public/image/code.png';
import CodeImg1 from 'public/image/code1.jpeg';
import CodeImg2 from 'public/image/code2.jpeg';

const moreList = [
  {
    title: '1. Download and package the code',
    img: CodeImg,
    subTitle:
      'Compress the contract source code and the corresponding protobuf files into a ZIP archive, then upload it.',
  },
  {
    title: '2. Verify and Publish',
    img: CodeImg1,
    subTitle:
      'Under the contract address page, you will be able to find the “Contract” tab. Then click on “Verify And Publish.”',
  },
  {
    title: '3. Enter contract verification details',
    img: CodeImg2,
    subTitle:
      'Please enter the required information, including the contract, and upload your code as a .zip format archive',
  },
  {
    title: '4. Update contract',
    subTitle:
      'If you have already uploaded the code and the contract has been verified, and you then update the contract code, it will become unverified. You will need to re-upload your updated contract code.',
  },
];

export default function ReadMore() {
  const Router = useRouter();
  const { address, chain } = useParams();
  return (
    <div className="contract-code flex w-full justify-center">
      <div className="max-w-[720px]">
        <div
          className="flex cursor-pointer items-center gap-1 pb-[10px] pt-6 text-sm font-medium"
          onClick={() => {
            Router.push(`/${chain}/address/${address}`);
          }}>
          <IconFont className="rotate-180 text-base" type="arrow-right" />
          <span className="text-primary">Back</span>
        </div>
        <div className="rounded-lg border border-solid border-border bg-white px-4 py-6">
          <div className="mb-[6px] text-2xl font-semibold">Verifying Contracts</div>
          <div className="mb-6 text-sm text-muted-foreground">
            Source code verification provides transparency for ussers interacting with smart contracts. By uploading the
            source code, aelfscan will match the compiled code with that on the blockchain.
          </div>
          {moreList.map((item, index) => {
            return (
              <div key={index} className={index !== moreList.length - 1 ? 'mb-4' : ''}>
                <div className="mb-2 pt-4 text-lg font-medium ">{item.title}</div>
                <div className="mb-2 text-sm text-muted-foreground ">{item.subTitle}</div>
                {item.img && (
                  <div>
                    <Image alt="" src={item.img}></Image>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
