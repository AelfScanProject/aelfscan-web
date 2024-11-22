'use client';

import IconFont from '@_components/IconFont';
import { Input, Modal } from 'aelf-design';
import { Form, FormProps, Select, Spin, Button } from 'antd';
import Link from 'next/link';
import './index.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSideChain } from '../../../../_hooks/useSelectChain';
import { uploadContractCode } from '@_api/fetchContact';
import { useParams } from 'next/navigation';
import { getAddress } from '@_utils/formatter';
import SuccessIcon from 'public/image/success.svg';
import FailedIcon from 'public/image/failed.svg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import addressFormat from '@_utils/urlUtils';
import { MULTI_CHAIN } from '@_utils/contant';
import UploadButton from '../components/upload';

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
  const { address, chain } = useParams();
  const [form] = Form.useForm<FieldType>();

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const uploadFile = Form.useWatch('file', form);
  console.log(uploadFile, 'uploadFile');

  useEffect(() => {
    if (address) {
      form.setFieldsValue({
        contractAddress: addressFormat(getAddress(address as string), chain as string),
      });
    }
  }, [address, chain, form]);

  const handleSubmit = () => {
    form.submit();
  };

  const handleReset = () => {
    form.resetFields();
    setIsSubmitDisabled(true);
  };

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
          'expired-callback': function () {
            console.warn('Turnstile token expired.');
            setToken('');
          },
          'error-callback': function (error) {
            console.error('Turnstile encountered an error:', error);
            setToken('');
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
      console.log(params, 'params');
      const formData = new FormData();
      formData.append('file', params.file[0]?.originFileObj);
      setUploadLoading(true);
      try {
        const data = await uploadContractCode(
          {
            chainId: chain as string,
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
          if (data.errCode === 0) {
            form.resetFields(['file']);
            form.validateFields(['file']);
          }
          setType('failed');
        }
        setUploadLoading(false);
        setOpen(true);
      } catch (error) {
        setErrorMessage('Verification failed Contract code mismatch. Please re-upload.');
        form.resetFields(['file']);
        form.validateFields(['file']);
        setType('failed');
        setOpen(true);
      } finally {
        setUploadLoading(false);
      }
    },
    [chain, form],
  );

  const handleGot = () => {
    if (type === 'success') {
      setOpen(false);
      Router.push(`/${MULTI_CHAIN}/address/${address}`);
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
          className="flex cursor-pointer items-center gap-1 pb-[10px] pt-6 text-sm font-medium"
          onClick={() => {
            Router.push(`/${MULTI_CHAIN}/address/${address}`);
          }}>
          <IconFont className="rotate-180 text-base" type="arrow-right" />
          <span className="text-primary">Back</span>
        </div>
        <div className="rounded-lg border border-solid border-border bg-white p-6">
          <div className="mb-[6px] text-center text-2xl font-semibold">Verify & Publish Contract Source Code</div>
          <div className="mb-6 text-start text-sm text-muted-foreground">
            <span>
              Source code verification provides transparency for users intteracting with smart contracts. By uploading
              the source code, aelfscan will match the comppiled code with that on the blockchain.{' '}
              <Link target="_blank" href={`/${MULTI_CHAIN}/readmore/${address}`}>
                {' '}
                Read more
              </Link>
            </span>
          </div>
          <Form
            form={form}
            name="contactCode"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ width: '100%' }}
            layout="vertical"
            requiredMark={false}
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
              <Input size="small" placeholder="ELF_" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item<FieldType>
              name="version"
              label="Please select Compiler Version"
              rules={[{ required: true, message: 'Please select Compiler Version' }]}>
              <Select
                style={{ height: '40px' }}
                options={NET_VERSION}
                suffixIcon={<IconFont width={16} height={16} type="chevron-down-f731al7b" />}></Select>
            </Form.Item>

            <Form.Item
              name="csprojPath"
              label="Project File Path"
              rules={[{ required: true, message: 'Project File Path' }]}>
              <Input size="small" placeholder="e.g., ../example/project.csproj"></Input>
            </Form.Item>

            <Form.Item<FieldType>
              label="Please select the file to upload"
              name="file"
              required
              rules={[
                {
                  validator: (_, value) => {
                    console.log(value, 'value');
                    if (!value || value?.length === 0) {
                      return Promise.reject(new Error('Please select the file to upload'));
                    }

                    const file = value[0];

                    const isLt10M = file.size / 1024 / 1024 < 10;
                    if (!isLt10M) {
                      return Promise.reject(new Error('File size must be less than 10MB.'));
                    }

                    return Promise.resolve();
                  },
                },
              ]}>
              <UploadButton accept=".zip" />
            </Form.Item>
            <div className="my-6 flex justify-center">
              <div className="cf-turnstile" ref={turnstileElementRef}></div>
            </div>
            <div className="mt-6 flex w-full flex-col items-center justify-center gap-2">
              <Button
                type="primary"
                style={{ width: '100%', height: '40px' }}
                className="!rounded-md !border-border"
                disabled={
                  isSubmitDisabled ||
                  !token ||
                  !(uploadFile && uploadFile?.length > 0 && uploadFile[0].size / 1024 / 1024 < 10)
                }
                loading={uploadLoading}
                onClick={handleSubmit}>
                Verify and Publish
              </Button>
              <Button
                htmlType="reset"
                className="!rounded-md !border-border !text-primary"
                style={{ width: '100%', height: '40px' }}
                onClick={handleReset}>
                Reset
              </Button>
            </div>
          </Form>
        </div>
      </div>

      <Modal centered open={open} title="" footer={null} closable={false}>
        <div className="flex flex-col items-center justify-center">
          <Image alt="" src={type === 'success' ? SuccessIcon : FailedIcon} width={48} height={48}></Image>
          <div className="py-2 text-xl font-medium text-foreground">
            {type === 'success' ? 'Verification successful' : 'Verification failed'}
          </div>
          <div className="pb-6 text-center text-sm text-foreground">
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
      <Modal centered open={uploadLoading} title="" footer={null} closable={false}>
        <div className="flex flex-col items-center justify-center">
          <div className="py-2 text-xl font-medium text-foreground">Verifying Contract</div>
          <div className="pb-6 text-center text-sm text-foreground">
            Contract verification in progress and is expected to take about 1 minute.
          </div>
          <div className="flex justify-center">
            <Spin />
          </div>
        </div>
      </Modal>
    </div>
  );
}
