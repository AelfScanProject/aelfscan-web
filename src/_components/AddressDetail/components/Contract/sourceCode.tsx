import IconFont from '@_components/IconFont';
import { message } from 'antd';
import { Button } from 'aelf-design';
import CodeViewer from './CodeViewer';
import { handelCopy } from '@_utils/copy';
import Download from '@_components/Download';
import copy from 'copy-to-clipboard';
import { Ace } from 'ace-builds';
import { useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { useMobileAll } from '@_hooks/useResponsive';
import FileTree from '../FileTree';
import { useParams } from 'next/navigation';
import { getAddress } from '@_utils/formatter';
import './code.css';

interface CustomEditor extends Ace.Editor {
  searchBox?: any;
}

export interface IContractSourceCode {
  contractName: string;
  contractVersion: string;
  isVerify: boolean;
  contractSourceCode: any[];
}

function getDefaultFile(files: any[] = [], names: string[] = [], index = 0, path = '') {
  const filtered = files.filter((v) => v.name === names[index]);
  console.log(filtered, 'filtered');
  if (filtered.length === 0) {
    return {};
  }
  const selectFile = filtered[0];
  const newPath = `${path}${selectFile.name}/`;
  // if (index === names.length - 1) {
  //   if (Array.isArray(selectFile.files) && selectFile.files.length > 0) {
  //     return {
  //       ...selectFile.files[0],
  //       path: `${newPath}${selectFile.files[0].name}`,
  //     };
  //   }
  //   return {
  //     ...selectFile,
  //     path: `${path}${selectFile.name}`,
  //   };
  // }

  if (index === names.length - 1) {
    const findFileWithContent = (files: any[], currentPath: string): any => {
      for (const file of files) {
        const filePath = `${currentPath}${file.name}`;
        if (file.content) {
          return {
            ...file,
            path: filePath,
          };
        }
        if (Array.isArray(file.files) && file.files.length > 0) {
          const foundFile = findFileWithContent(file.files, `${filePath}/`);
          if (foundFile) {
            return foundFile;
          }
        }
      }
      return null;
    };

    if (Array.isArray(selectFile.files) && selectFile.files.length > 0) {
      const fileWithContent = findFileWithContent(selectFile.files, newPath);
      if (fileWithContent) {
        return fileWithContent;
      }
    }

    return {
      ...selectFile,
      path: `${path}${selectFile.name}`,
    };
  }
  if (Array.isArray(selectFile.files)) {
    return getDefaultFile(selectFile.files, names, index + 1, newPath);
  }
  return {
    ...selectFile,
    path: newPath,
  };
}

function handleFiles(data: IContractSourceCode) {
  let defaultFile;
  let result;
  try {
    result = data.contractSourceCode || [];
  } catch (e) {
    result = data.contractSourceCode;
  } finally {
    defaultFile = getDefaultFile(result, result[0] ? [result[0]?.name] : []);
  }
  return {
    result,
    defaultFile,
  };
}

export interface IFileItem {
  name: string;
  content: string;
  fileType: string;
  path: string;
}

export default function SourceCode({ contractInfo }: { contractInfo: IContractSourceCode }) {
  const isMobile = useMobileAll();
  const { result, defaultFile } = handleFiles(contractInfo);
  const files = useMemo(() => {
    return result;
  }, [result]);
  const [viewerConfig, setViewerConfig] = useState<IFileItem>(defaultFile);
  const [linkStatus, setLinkStatus] = useState(false);
  const copyCode = () => {
    handelCopy(window.atob(viewerConfig.content));
  };

  const editorRef = useRef<CustomEditor | null>(null);

  const resetSearch = (editor) => {
    editorRef.current = editor;
  };

  const onFileChange = (names) => {
    const selectedFile = getDefaultFile(files, names);
    console.log(selectedFile, 'selectedFile');
    if (Object.keys(selectedFile).length > 0) {
      setViewerConfig({
        ...selectedFile,
      });
    }

    if (editorRef.current && editorRef.current?.searchBox?.active) {
      const searchKeyword = editorRef.current.searchBox.searchInput.value;

      editorRef.current.setValue(window.atob(selectedFile?.content), -1);

      editorRef.current.execCommand('find', {
        needle: searchKeyword,
        backwards: false,
        wrap: true,
        caseSensitive: false,
        wholeWord: false,
        regExp: false,
        preventScroll: true,
      });
      setTimeout(() => {
        const totalMatches = editorRef.current?.findAll(searchKeyword, {
          caseSensitive: false,
          wholeWord: false,
          regExp: false,
          preventScroll: true,
          backwards: false,
          wrap: true,
        });

        if (editorRef.current?.searchBox && totalMatches && totalMatches > 0) {
          const searchBox = editorRef.current.searchBox;
          searchBox.searchCounter.innerText = `1 of ${totalMatches}`;
        }
      }, 100);
    }
  };

  const copyLink = () => {
    try {
      copy(window.location.href);
      setLinkStatus(true);
      setTimeout(() => {
        setLinkStatus(false);
      }, 1000);
    } catch (e) {
      message.error('Copy failed, please copy by yourself.');
    }
  };

  const [codeAuto, setCodeAuto] = useState(false);
  const viewChange = () => {
    setCodeAuto(!codeAuto);
  };

  const { address } = useParams<{ address: string }>();
  return (
    <div className="contract-source-code px-4">
      <div
        className={clsx(isMobile && 'flex-col !items-start', 'source-header flex items-center justify-between py-4')}>
        <div>
          <IconFont className="mr-1 text-xs" type="contract-aa3pc9ha" />
          <span className="inline-block text-sm leading-[22px] text-base-100">Contract Source Code</span>
        </div>
        <div className={clsx(isMobile && 'mt-2', 'view flex items-center')}>
          <Download files={files} fileName={getAddress(address)} />
          <Button
            className="view-button mx-2"
            icon={<IconFont className="!text-xs" type="view-copy" />}
            onClick={copyCode}
          />
          <Button
            className="view-button mr-2"
            icon={<IconFont className="!text-xs" type={linkStatus ? 'link-success' : 'link'} />}
            onClick={copyLink}
          />
          <Button
            className="view-button"
            icon={<IconFont className="!text-xs" type={!codeAuto ? 'viewer' : 'viewer-full'} />}
            onClick={viewChange}
          />
        </div>
      </div>
      <div className="flex w-full overflow-x-auto pb-10">
        <FileTree files={files} onChange={onFileChange} />
        <div className="ml-1 flex-1">
          <CodeViewer
            auto={codeAuto}
            data={window.atob(viewerConfig?.content || '')}
            name={viewerConfig?.name}
            path={viewerConfig?.path || ''}
            resetSearch={resetSearch}
          />
        </div>
      </div>
    </div>
  );
}
