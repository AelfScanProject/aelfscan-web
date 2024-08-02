'use client';
import type { ReactNode } from 'react';
import { initWebTracerWithZone } from 'opentelemetry-launcher';
import { createContext, useEffect, useMemo, useState } from 'react';
import { Tracer } from '@opentelemetry/sdk-trace-base';

interface Props {
  readonly children: ReactNode;
  config: any;
}

export const OpentelemetryContext = createContext<Tracer | undefined>(undefined);

export const OpentelemetryProvider = ({ children, config }: Props) => {
  const [webTracerWithZone, setWebTracerWithZone] = useState<Tracer>();
  const APP_SETTINGS = useMemo(() => {
    return {
      openTelemetry: {
        serviceName: 'aelfscan-web',
        serviceVersion: 'v1.0',
        collectorEndpoint: config.collectorEndpoint,
        tracerName: 'aelfscan-web-tracer',
        ignoreUrls: [
          /\/sockjs-node/,
          /\/monitoring/,
          /\/__nextjs_original-stack-frame/,
          /_rsc=/,
          /https:\/\/www\.google-analytics\.com\/g\/collect/,
        ],
        propagateTraceHeaderCorsUrls: ['https://httpbin.org'],
      },
    };
  }, [config.collectorEndpoint]);

  useEffect(() => {
    const _webTracerWithZone = initWebTracerWithZone(APP_SETTINGS.openTelemetry);
    setWebTracerWithZone(_webTracerWithZone);
    console.log('getWebTracerWithZone done');
  }, [APP_SETTINGS.openTelemetry]);

  return <OpentelemetryContext.Provider value={webTracerWithZone}>{children}</OpentelemetryContext.Provider>;
};
