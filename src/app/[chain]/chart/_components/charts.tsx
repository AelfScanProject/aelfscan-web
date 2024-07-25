'use client';
import { Card } from 'antd';
import Title from './title';
import Highcharts from 'highcharts/highstock';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsFullscreen from 'highcharts/modules/full-screen';
import HighchartsReact, { HighchartsReactRefObject } from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
import '../index.css';
import Highlight from '../_components/highlight';
import { IHIGHLIGHTDataItem } from '../type';
import Download from './download';

import { MouseEventHandler, forwardRef } from 'react';
import PageAd from '@_components/PageAd';

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts);
  HighchartsFullscreen(Highcharts);
  HighchartsMore(Highcharts);
}

export interface IHightChartsOption {
  title: string;
  aboutTitle: string;
  hiddenDownload?: boolean;
  options: Highcharts.Options;
  download: MouseEventHandler;
  highlightData: IHIGHLIGHTDataItem[];
}

function BaseHightCharts(props: IHightChartsOption, ref) {
  const { title, aboutTitle, options, highlightData, download, hiddenDownload } = props;

  return (
    <div>
      <div>
        <Title title={title}></Title>
        <PageAd hiddenBorder adPage="chartdetail" />
      </div>
      <div className="row">
        <div className="col-12 mb-lg-0 col-lg-8 col-xl-9 mb-10">
          <Card>
            <HighchartsReact
              ref={ref}
              containerProps={{ className: 'h-[550px] min-w-[310px]' }}
              highcharts={Highcharts}
              options={options}
            />
          </Card>
          {!hiddenDownload && <Download download={download} />}
        </div>
        <Highlight title={aboutTitle} highlightData={highlightData} />
      </div>
    </div>
  );
}

export default forwardRef<HighchartsReactRefObject, IHightChartsOption>(BaseHightCharts);
