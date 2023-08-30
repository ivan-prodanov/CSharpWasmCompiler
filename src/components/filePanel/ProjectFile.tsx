import { EditorFile, FileAttributes } from "@0x33.io/monaco";
import React, { useContext } from "react";
import styled, { ThemeContext } from "styled-components";

interface FileProps {
  active: boolean;
  isPerformingFileOperation: boolean;
}

const ProjectFileContainer = styled.div<FileProps>`
  cursor: pointer;
  background: ${({ theme, active, isPerformingFileOperation }) =>
    active && !isPerformingFileOperation
      ? theme.colors.FilePanelActiveFileBackground
      : "inherit"};
  border: ${({ theme, active, isPerformingFileOperation }) =>
    active && !isPerformingFileOperation
      ? "1px solid " + theme.colors.FilePanelActiveFileBorder
      : "1px solid transparent"};
  color: ${({ theme, active, isPerformingFileOperation }) =>
    active && !isPerformingFileOperation
      ? theme.colors.FilePanelActiveFile
      : "inherit"};
  &:hover {
    background: ${({ theme, active, isPerformingFileOperation }) =>
      active && !isPerformingFileOperation
        ? theme.colors.FilePanelActiveFileBackground
        : theme.colors.FilePanelFileHover};
  }
  opacity: ${(props) => (props.isPerformingFileOperation ? 0.3 : 1)};
  display: flex;
  align-items: center;
  padding-left: 10px;
  padding-right: 0px;
`;

const File = styled.div`
  padding-top: 1px;
  padding-bottom: 1px;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FileIcon = styled.img`
  height: 18px;
  display: inline-flex;
  margin-right: 4px;
`;

type ProjectFileProps = {
  file: EditorFile;
  active: boolean;
  isPerformingFileOperation: boolean;
  onOpenFile: (file: EditorFile) => void;
  onOpenFileInNewEditor: (file: EditorFile) => void;
};

export function ProjectFile({
  file,
  active,
  isPerformingFileOperation,
  onOpenFile: onOpenFile,
  onOpenFileInNewEditor: onOpenFileInNewEditor,
}: ProjectFileProps) {
  const themeContext = useContext(ThemeContext);
  let fileName = file.displayName;
  if (file.attributes === FileAttributes.ReadOnly) {
    fileName = `${fileName} (Read Only)`;
  }

  return (
    <>
      <ProjectFileContainer
        active={active}
        isPerformingFileOperation={isPerformingFileOperation}
        onClick={(e) =>
          e.ctrlKey || e.metaKey
            ? onOpenFileInNewEditor(file)
            : onOpenFile(file)
        }
      >
        <FileIcon src={themeContext.icons.CSharpFile} />
        <File>{fileName}</File>
      </ProjectFileContainer>
    </>
  );
}
