'use client';
import IconFont from '@_components/IconFont';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ReadMoreImg from 'public/image/readmore-test.png';
import CodeImg from 'public/image/code.png';

const moreList = [
  {
    title: '1. Download and package the code',
    img: CodeImg,
    subTitle:
      'Compress the contract source code and the corresponding protobuf files into a ZIP archive, then upload it.',
  },
  {
    title: '2. Verify and Publish',
    img: ReadMoreImg,
    subTitle:
      'Under the contract address page, you will be able to find the “Contract” tab. Then click on “Verify And Publish.”',
  },
  {
    title: '3. Enter contract verification details',
    img: ReadMoreImg,
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
  return (
    <div className="contract-code flex w-full justify-center">
      <div className="max-w-[720px]">
        <div
          className="flex cursor-pointer items-center gap-2 py-4 pb-6 text-sm leading-[22px] text-base-100 min-[769px]:pb-4"
          onClick={() => {
            Router.back();
          }}>
          <IconFont className="mr-1 rotate-180" type="right-arrow-dfna6beo" />
          Back
        </div>
        <div className="min-[769px]:rounded-lg min-[769px]:border min-[769px]:border-solid min-[769px]:border-[#EAECEF] min-[769px]:bg-white min-[769px]:px-4 min-[769px]:py-6">
          <div className="mb-2 text-xl font-medium text-base-100">Verifying Contracts</div>
          <div className="mb-10 text-sm leading-[22px] text-base-100">
            Source code verification provides transparency for ussers interacting with smart contracts. By uploading the
            source code, aelfscan will match the compiled code with that on the blockchain.
          </div>
          {moreList.map((item, index) => {
            return (
              <div key={index} className={index !== moreList.length - 1 ? 'mb-10' : ''}>
                <div className="mb-1 text-base font-medium text-base-100">{item.title}</div>
                <div className="mb-4 text-sm leading-[22px] text-base-100">{item.subTitle}</div>
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
