import React from 'react';
import QRCode from 'qrcode.react';

import './index.css';

export default function QrCode({ value }) {
  return (
    <div className="qr-code">
      <QRCode
        value={value}
        style={{
          height: 235,
          width: 235,
        }}
      />
      <p className="code-txt">{value}</p>
    </div>
  );
}
