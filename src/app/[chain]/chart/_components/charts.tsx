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
import './index.css';

import { MouseEventHandler, forwardRef, memo } from 'react';
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
    <div className="baseHightCharts-container">
      <div>
        <Title title={title}></Title>
        <PageAd adPage="chartdetail" />
      </div>
      <div className="row pt-7">
        <div className="col-12 mb-lg-0 col-lg-8 col-xl-9 mb-8">
          <Card className="!border-border">
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

export default memo(forwardRef<HighchartsReactRefObject, IHightChartsOption>(BaseHightCharts));
