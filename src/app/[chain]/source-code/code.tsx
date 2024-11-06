'use client';

import IconFont from '@_components/IconFont';
import { Button, Input, Modal, Upload } from 'aelf-design';
import { Form, FormProps, Select } from 'antd';
import Link from 'next/link';
import './index.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSideChain } from '../../../_hooks/useSelectChain';
import { uploadContractCode } from '@_api/fetchContact';
import { useParams } from 'next/navigation';
import { getAddress } from '@_utils/formatter';
import SuccessIcon from 'public/image/success.svg';
import FailedIcon from 'public/image/failed.svg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type FieldType = {
  contractAddress: string;
  csprojPath: string;
  version: string;
  file: any;
};

const NET_VERSION = [
  {
    label: '.NET 6',
    value: 'net6.0',
  },
  {
    label: '.NET 7',
    value: 'net7.0',
  },
  {
    label: '.NET 8',
    value: 'net8.0',
  },
];

export default function SourceCodePage() {
  const [form] = Form.useForm<FieldType>();

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const isFile = Form.useWatch('file', form);

  const handleSubmit = () => {
    form.submit();
  };

  const handleReset = () => {
    form.resetFields();
    setIsSubmitDisabled(true);
  };

  const { chain } = useParams<{ chain: string }>();

  const [open, setOpen] = useState(false);
  const [type, setType] = useState<'success' | 'failed'>('success');
  const [errmessage, setErrorMessage] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);

  const turnstileElementRef = useRef(null);
  const turnstileInstance = useRef(null);
  const scriptLoaded = useRef(false);

  const Router = useRouter();

  useEffect(() => {
    const initializeTurnstile = () => {
      if (turnstileElementRef.current && !turnstileInstance.current) {
        turnstileInstance.current = window.turnstile.render(turnstileElementRef.current, {
          sitekey: '0x4AAAAAAAzCjPAqE96LIinD',
          callback: function (token) {
            console.log('Turnstile token:', token);
            setToken(token);
          },
        });
      }
    };

    const loadTurnstile = () => {
      if (!scriptLoaded.current) {
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          scriptLoaded.current = true;
          initializeTurnstile();
        };
        document.body.appendChild(script);
      } else if (window.turnstile) {
        initializeTurnstile();
      }
    };

    loadTurnstile();

    return () => {
      if (turnstileInstance.current) {
        window.turnstile.reset(turnstileInstance.current);
        turnstileInstance.current = null;
      }
    };
  }, []);

  const uploadContract = useCallback(
    async (params: FieldType) => {
      const formData = new FormData();
      formData.append('file', params.file?.file?.originFileObj);
      setUploadLoading(true);
      try {
        const data = await uploadContractCode(
          {
            chainId: chain,
            contractAddress: getAddress(params.contractAddress),
            dotnetVersion: params.version,
            csprojPath: params.csprojPath,
          },
          formData,
        );

        if (data.result === 0) {
          setType('success');
        } else {
          setErrorMessage(data.message);
          setType('failed');
        }
        setUploadLoading(false);
        setOpen(true);
      } finally {
        setUploadLoading(false);
      }
    },
    [chain],
  );

  const handleGot = () => {
    if (type === 'success') {
      setOpen(false);
      Router.back();
    } else {
      setOpen(false);
    }
  };

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    uploadContract(values);
  };

  const handleValuesChange = (changedValues, allValues) => {
    const allFieldsFilled = Object.values(allValues).every((value) => value && value !== undefined && value !== '');
    setIsSubmitDisabled(!allFieldsFilled);
  };

  const [token, setToken] = useState('');

  const side = useSideChain();

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
          <div className="mb-2 text-center text-xl font-medium text-base-100">
            Verify & Publish Contract Source Code
          </div>
          <div className="mb-10 text-center text-sm leading-[22px] text-base-100">
            <span>
              Source code verification provides transparency for users intteracting with smart contracts. By uploading
              the source code, aelfscan will match the comppiled code with that on the blockchain.{' '}
              <Link href={`/${chain}/readmore`}> Read more</Link>
            </span>
          </div>
          <Form
            form={form}
            name="contactCode"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ width: '100%' }}
            layout="vertical"
            onValuesChange={handleValuesChange}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off">
            <Form.Item<FieldType>
              label="Please enter the Contract Address you would like to verify"
              name="contractAddress"
              required
              rules={[
                {
                  validator: (_, value) => {
                    const addressRegex = /^ELF.*(AELF|tDVV|tDVW)$/;

                    if (!value) {
                      return Promise.reject(new Error('Please enter the Contract Address you would like to verify'));
                    }

                    if (!addressRegex.test(value)) {
                      return Promise.reject(
                        new Error(`The contract address must start with "ELF" and end with "AELF" or "${side}".`),
                      );
                    }

                    return Promise.resolve();
                  },
                },
              ]}>
              <Input style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item<FieldType>
              name="version"
              label="Please select Compiler Version"
              rules={[{ required: true, message: 'Please select Compiler Version' }]}>
              <Select style={{ height: '48px' }} options={NET_VERSION}>
                Remember me
              </Select>
            </Form.Item>

            <Form.Item
              name="csprojPath"
              label="Project File Path"
              rules={[{ required: true, message: 'Project File Path' }]}>
              <Input></Input>
            </Form.Item>

            <Form.Item<FieldType>
              label="Please select the file to upload"
              name="file"
              rules={[{ required: true, message: 'Please select the file to upload' }]}>
              <Upload
                tips="Supported file type: .zip"
                uploadText="Choose source code file to upload"
                accept=".zip"
                maxCount={1}
                showUploadButton={!isFile}
              />
            </Form.Item>
          </Form>
        </div>
        <div className="mt-6 flex justify-center">
          <div className="cf-turnstile" ref={turnstileElementRef}></div>
        </div>
        <div className="mt-6 flex w-full items-center justify-center gap-3">
          <Button type="primary" disabled={isSubmitDisabled || !token} loading={uploadLoading} onClick={handleSubmit}>
            Verify and Publish
          </Button>
          <Button htmlType="reset" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>

      <Modal open={open} title="" footer={null} closable={false}>
        <div className="flex flex-col items-center justify-center">
          <Image alt="" src={type === 'success' ? SuccessIcon : FailedIcon} width={48} height={48}></Image>
          <div className="py-2 text-xl font-medium text-base-100">
            {type === 'success' ? 'Verification successful' : 'Verification failed'}
          </div>
          <div className="pb-6 text-center text-sm text-base-100">
            {type === 'success'
              ? 'Contract verification successful and the code has been published. Please check the contract page for details.'
              : errmessage}
          </div>
          <div>
            <Button style={{ width: '214px' }} type="primary" onClick={handleGot}>
              Got it
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
