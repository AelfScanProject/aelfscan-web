// Every item made up with title, params input and query button.

import { Divider, Form } from 'antd';
import { Button, Input } from 'aelf-design';
import { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';
import { IMethod } from '../Contract';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import './index.css';
import { useParams } from 'next/navigation';
import { TChainId } from '@aelf-web-login/wallet-adapter-base';
import ValueFormItem from './valueFormItem';

export default function FormItem({
  name,
  input,
  type,
  address,
  contract,
}: IMethod & {
  contract: any;
}) {
  const [form] = Form.useForm();
  const [res, setRes] = useState<any>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [writeLoading, setWriteLoading] = useState<boolean>(false);
  const { chain } = useParams();

  const values = Form.useWatch([], form);
  const [submittable, setSubmittable] = useState<boolean>(false);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then((values) => {
        const task = Object.values(values).every((item) => item || item === 0);
        if (task) {
          setSubmittable(true);
        } else {
          setSubmittable(false);
        }
      })
      .catch(() => setSubmittable(false));
  }, [form, values]);

  const { callSendMethod, isConnected } = useConnectWallet();
  const query = async () => {
    setLoading(true);
    // get all fileds value with param true
    const filedsValue = form.getFieldsValue();
    console.log(filedsValue, 'filedsValue');
    try {
      const result =
        filedsValue && Object.keys(filedsValue).length
          ? await contract[name].call(filedsValue)
          : await contract[name].call();
      if (result) {
        setRes(result);
      } else {
        setRes({
          data: null,
        });
      }
    } catch (e: any) {
      setRes(e);
    } finally {
      setLoading(false);
    }
  };

  const write = async () => {
    setWriteLoading(true);
    const filedsValue = form.getFieldsValue();
    try {
      const res = await callSendMethod({
        chainId: chain as TChainId,
        contractAddress: address as string,
        methodName: name,
        args: filedsValue,
      });
      setRes(res);
    } catch (e: any) {
      setRes(e);
    } finally {
      setWriteLoading(false);
    }
  };

  return (
    <>
      <Form form={form} layout="vertical" name={name} key={name}>
        {input?.map((ele) =>
          ele.type === 'int64' ? (
            <ValueFormItem form={form} type={ele.type} key={ele.name} data={ele} />
          ) : (
            <Form.Item key={ele.name} label={ele.name} name={ele.name}>
              <Input size="small" />
            </Form.Item>
          ),
        )}
        <Form.Item>
          <div className="flex w-full items-center">
            {type === 'read' && (
              <Button
                type="primary"
                size="small"
                className="mr-3 bg-link"
                disabled={!submittable && !!input.length}
                loading={loading}
                onClick={query}>
                Query
              </Button>
            )}
            {type === 'write' && (
              <Button
                size="small"
                className="bg-link"
                disabled={!isConnected || (!submittable && !!input.length)}
                loading={writeLoading}
                type="primary"
                onClick={write}>
                Write
              </Button>
            )}
          </div>
        </Form.Item>
      </Form>

      {res && (
        <>
          <Divider dashed />
          <div>Response Body</div>
          <div className="overflow-x-auto">
            <ReactJson src={res} />
          </div>
        </>
      )}
    </>
  );
}
