import React, { useMemo, useState } from 'react';
import { Popover, Tree } from 'antd';
import IconFont from '@_components/IconFont';
import './index.css';
import { useMD } from '@_hooks/useResponsive';

function addKeyForTree(files: any[] = [], parentKey = '', splitChar = '#') {
  return files.map((file) => {
    const { name } = file;
    const newKey = `${parentKey}${name}`;
    if (Array.isArray(file.files) && file.files.length > 0) {
      return {
        ...file,
        files: addKeyForTree(file.files, `${newKey}${splitChar}`),
        key: newKey,
      };
    }
    return {
      ...file,
      key: newKey,
    };
  });
}

function getFirstFile(files: any[] = []) {
  if (files.length === 0) {
    return '';
  }
  if (!files[0]?.files) {
    return files[0]?.key;
  }
  return getFirstFile(files[0].files);
}

function renderTreeNode(item) {
  return {
    title: item.name,
    key: item.key,
    children: Array.isArray(item.files) && item.files.length > 0 && item.files.map(renderTreeNode),
  };
}

type TFiles = {
  name: string;
  key: string;
  files: any[];
};

export interface IFileTreeProps {
  files: TFiles[];
  onChange: (value: string) => void;
}

const FileTree = (props: IFileTreeProps) => {
  const { files = [], onChange } = props;
  const [selectedKeys, setSelectKeys] = useState<string[]>([]);
  const { filesWithKey, firstFileKey } = useMemo(() => {
    const filesHandled = addKeyForTree(files);
    const firstKey = getFirstFile(filesHandled);
    setSelectKeys([firstKey]);
    return {
      filesWithKey: filesHandled,
      firstFileKey: [firstKey],
    };
  }, [files]);

  const onSelect = (_, e) => {
    setSelectKeys([e.node.key]);
    onChange(e.node.key.split('#'));
  };

  const ismd = useMD();

  const treeData = useMemo(() => filesWithKey.map((v) => renderTreeNode(v)), [filesWithKey]);
  return (
    <div className="ep-tree-container">
      {ismd ? (
        <Popover
          trigger="click"
          placement="bottomLeft"
          overlayClassName="!w-[224px] !h-[280px] overflow-auto tree-container-file"
          content={
            <Tree
              showLine
              autoExpandParent
              switcherIcon={<IconFont className="text-base" type="chevron-down1" />}
              defaultSelectedKeys={firstFileKey}
              defaultExpandedKeys={firstFileKey}
              selectedKeys={selectedKeys}
              onSelect={onSelect}
              className="contract-viewer-file-tree"
              treeData={treeData}
            />
          }>
          <div className="inline-block cursor-pointer border-2 border-white p-[2px]">
            <div className="flex items-center gap-1 rounded-md border border-border bg-white px-2 py-[6px]">
              <IconFont className="text-base" type="menu" />
              <div className="text-sm text-primary">Show Files</div>
            </div>
          </div>
        </Popover>
      ) : (
        <Tree
          showLine
          autoExpandParent
          height={800}
          switcherIcon={<IconFont className="text-base" type="chevron-down1" />}
          defaultSelectedKeys={firstFileKey}
          defaultExpandedKeys={firstFileKey}
          selectedKeys={selectedKeys}
          onSelect={onSelect}
          className="contract-viewer-file-tree w-[250px] overflow-x-auto"
          treeData={treeData}
        />
      )}
    </div>
  );
};

export default FileTree;
