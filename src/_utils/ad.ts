export type AdEvent = string;

declare global {
  interface Window {
    dataLayer?: any;
  }
}

export class AdTracker {
  gtm: any;
  constructor() {
    this.gtm = window.dataLayer;
  }

  sendAdTrack(event: AdEvent, payload: any) {
    try {
      this.gtm.push({ event, ...payload });
    } catch (error) {
      console.error('track error:', error);
    }
  }

  static trackEvent(event: AdEvent, payload?: any) {
    const tracker = new AdTracker();
    tracker.sendAdTrack(event, payload);
  }
}
