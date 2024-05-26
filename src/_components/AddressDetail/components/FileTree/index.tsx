import React, { useMemo, useState } from 'react';
import { Tree } from 'antd';

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
  const { filesWithKey, firstFileKey, firstDirectory } = useMemo(() => {
    const filesHandled = addKeyForTree(files);
    const firstKey = getFirstFile(filesHandled);
    setSelectKeys([firstKey]);
    return {
      filesWithKey: filesHandled,
      firstFileKey: [firstKey],
      firstDirectory: [filesHandled[0].key],
    };
  }, [files]);
  const onSelect = (_, e) => {
    setSelectKeys([e.node.key]);
    onChange(e.node.key.split('#'));
  };
  const treeData = useMemo(() => filesWithKey.map((v) => renderTreeNode(v)), [filesWithKey]);
  return (
    <Tree
      showLine
      autoExpandParent
      height={800}
      defaultSelectedKeys={firstFileKey}
      defaultExpandedKeys={firstDirectory}
      selectedKeys={selectedKeys}
      onSelect={onSelect}
      className="contract-viewer-file-tree w-[250px] overflow-x-auto"
      treeData={treeData}
    />
  );
};

export default FileTree;
