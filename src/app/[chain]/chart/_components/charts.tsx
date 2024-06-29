'use client';
import { Card } from 'antd';
import Title from './title';
import Highcharts from 'highcharts/highstock';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsFullscreen from 'highcharts/modules/full-screen';
import HighchartsReact from 'highcharts-react-official';
import '../index.css';
import Highlight from '../_components/highlight';
import { IHIGHLIGHTDataItem } from '../type';
import Download from './download';

import { MouseEventHandler } from 'react';

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts);
  HighchartsFullscreen(Highcharts);
}

export interface IHightChartsOption {
  title: string;
  aboutTitle: string;
  options: Highcharts.Options;
  download: MouseEventHandler<HTMLSpanElement>;
  highlightData: IHIGHLIGHTDataItem[];
}

export default function BaseHightCharts(props: IHightChartsOption) {
  const { title, aboutTitle, options, highlightData, download } = props;

  return (
    <div>
      <div>
        <Title title={title}></Title>
      </div>
      <div className="row">
        <div className="col-12 mb-lg-0 col-lg-8 col-xl-9 mb-10">
          <Card>
            <HighchartsReact
              containerProps={{ className: 'h-[550px] min-w-[310px]' }}
              highcharts={Highcharts}
              options={options}
            />
          </Card>
          <Download download={download} />
        </div>
        <Highlight title={aboutTitle} highlightData={highlightData} />
      </div>
    </div>
  );
}
