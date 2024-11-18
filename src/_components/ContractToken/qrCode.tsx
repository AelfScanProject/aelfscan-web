import IconFont from '@_components/IconFont';
import QrCode from '../QrCode/index';
import { Modal } from 'antd';
import { useState } from 'react';
import './index.css';
export default function QrCodeModal({ address }) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <Modal
        title="Address QR Code"
        open={visible}
        width={320}
        rootClassName="qr-code-modal"
        footer={null}
        closable={{ closeIcon: <IconFont onClick={() => setVisible(false)} className="text-base" type="x" /> }}>
        <div>
          <QrCode value={address} />
        </div>
      </Modal>

      <IconFont onClick={() => setVisible(true)} className="text-base" type="qr-code-f6b8kmba" />
    </div>
  );
}