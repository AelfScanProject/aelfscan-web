import IconFont from '@_components/IconFont';
import { Button, message, Upload, UploadFile, UploadProps } from 'antd';
import './index.css';
import { useState } from 'react';
import clsx from 'clsx';

export default function UploadButton({
  accept,
  onChange = () => {},
}: {
  accept: string;
  onChange?: (file: UploadFile[]) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      const newFileList = [...info.fileList];
      setFileList(newFileList);
      setLoading(false);
      onChange(newFileList);
    } else if (info.file.status === 'error') {
      setLoading(false);
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const deleteFile = () => {
    setFileList([]);
    onChange([]);
  };

  return (
    <div className="upload-button-container w-full">
      <div className="flex gap-2">
        <div className="upload-button-preview flex h-10 flex-1 items-center justify-between gap-2 rounded-md border border-border px-3">
          <div className="flex items-center gap-2">
            <div className="shrink-0 text-sm font-medium">Choose file</div>
            <div className="max-w-full truncate text-sm font-medium">
              {fileList?.length > 0 ? fileList[0].name : 'No file chosen'}
            </div>
          </div>
          {fileList?.length > 0 && <IconFont onClick={deleteFile} className="text-base" type="trash" />}
        </div>
        <div>
          <Upload maxCount={1} onChange={handleChange} accept={accept} itemRender={() => null}>
            <Button disabled={loading} className="upload-button" onClick={() => setLoading(true)}>
              <IconFont className="text-base" type="upload" />
              <span className="text-primary">{loading ? 'Uploading' : 'Upload'}</span>
            </Button>
          </Upload>
        </div>
      </div>
      <div className={clsx('upload-tips mt-2 text-sm text-muted-foreground', fileList?.length > 0 && 'hidden')}>
        Supported file: .zip (Max 10M)
      </div>
    </div>
  );
}
