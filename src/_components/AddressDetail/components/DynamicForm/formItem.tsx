// Every item made up with title, params input and query button.

import { Divider, Form } from 'antd';
import { Button, Input } from 'aelf-design';
import { useState } from 'react';
import ReactJson from 'react-json-view';
import { IMethod } from '../Contract';

export default function FormItem({
  name,
  input,
  type,
  contract,
}: IMethod & {
  contract: any;
}) {
  const [form] = Form.useForm();
  const [res, setRes] = useState<any>('');
  const [loading, setLoading] = useState<boolean>(false);
  const query = async () => {
    setLoading(true);
    // get all fileds value with param true
    const filedsValue = form.getFieldsValue();
    try {
      const result =
        filedsValue && Object.keys(filedsValue).length
          ? await contract[name].call(filedsValue)
          : await contract[name].call();
      console.log(result, 'result');
      setRes(result);
    } catch (e: any) {
      setRes(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form form={form} name={name} key={name}>
        {input?.map((ele) => (
          <Form.Item key={ele} label={ele} name={ele}>
            <Input />
          </Form.Item>
        ))}
        <Form.Item>
          <div className="flex w-full items-center">
            <Button type="primary" className="mr-8 bg-link" loading={loading} onClick={query}>
              View
            </Button>
            {type === 'write' && (
              <Button className="bg-link" disabled type="primary">
                Send
              </Button>
            )}
          </div>
        </Form.Item>
      </Form>

      {res && (
        <>
          <Divider dashed />
          <div>Response Body</div>
          <div>
            <ReactJson src={res} />
          </div>
        </>
      )}
    </>
  );
}
