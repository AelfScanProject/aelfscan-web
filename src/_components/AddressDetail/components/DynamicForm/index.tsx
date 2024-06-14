import { Collapse } from 'antd';

import FormItem from './formItem';
import { IMethod } from '../Contract';

const { Panel } = Collapse;

export default function DynamicForm({
  methods,
  address,
  contract,
}: {
  methods: IMethod[];
  address: string;
  contract: any;
}) {
  return (
    <div className="px-4 pb-4">
      <Collapse defaultActiveKey={['0']} className="rounded-md">
        {methods.map((ele) => {
          return (
            <Panel key={ele.name} showArrow={true} header={<span className="font-semibold">{ele.name}</span>}>
              <FormItem
                address={address}
                contract={contract}
                type={ele.type}
                name={ele.name}
                input={ele.input}
                fn={ele.fn}></FormItem>
            </Panel>
          );
        })}
      </Collapse>
    </div>
  );
}
