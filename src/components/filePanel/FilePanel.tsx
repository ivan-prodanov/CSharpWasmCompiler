import { EditorFile, FileAttributes } from "@0x33.io/monaco";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
// import EditorFile from "../../models/EditorFile";
import { ProjectBar } from "./ProjectBar";
import { ProjectFile } from "./ProjectFile";
import {
  FileNameState,
  ProjectFilePlaceholder,
} from "./ProjectFilePlaceholder";

const FilePanelContainer = styled.div`
  width: 270px;
  min-width: 270px;
  height: 100%;
  flex-direction: column;
  background: ${(props) => props.theme.colors.FilePanelBackground};
  color: ${(props) => props.theme.colors.FilePanelForeground};
  display: flex;
  user-select: none;
`;

const FileList = styled.div`
  display: flex;
  flex-grow: 1;
  height: 100%;
  flex-direction: column;
  overflow: auto;
`;

type FilePanelProps = {
  files: EditorFile[];
  activeFileId: string | null;
  onNewFile: (name: string) => void;
  onRenameFile: (editedFile: EditorFile, newName: string) => void;
  onOpenFile: (file: EditorFile) => void;
  onOpenFileInNewEditor: (file: EditorFile) => void;
  onRun: () => void;
};

export function FilePanel({
  files,
  activeFileId: activeFileUri,
  onNewFile,
  onRenameFile,
  onOpenFile,
  onOpenFileInNewEditor,
  onRun,
}: FilePanelProps) {
  const [isAddingNewFile, setIsAddingNewFile] = useState(false);
  const [isRenamingFile, setIsRenamingFile] = useState(false);
  const [isPerformingFileOperation, setIsPerformingFileOperation] =
    useState(false);
  const [fileOperationState, setFileOperationState] = useState(
    FileNameState.None
  );
  const [sortedFiles, setSortedFiles] = useState(files);

  useEffect(() => {
    if (isAddingNewFile || isRenamingFile) {
      setIsPerformingFileOperation(true);
    } else {
      setIsPerformingFileOperation(false);
      setFileOperationState(FileNameState.None);
    }
  }, [isAddingNewFile, isRenamingFile]);

  const validateNewFile = useCallback(
    (fileName: string | undefined) => {
      let isValid = false;
      if (fileName) {
        if (
          files.some(
            (f) => f.displayName.toLowerCase() === fileName.toLowerCase()
          )
        ) {
          setFileOperationState(FileNameState.FileNameAlreadyExists);
        } else {
          setFileOperationState(FileNameState.None);
          isValid = true;
        }
      } else {
        setFileOperationState(FileNameState.FileNameEmpty);
      }

      return isValid;
    },
    [setFileOperationState, files]
  );

  useEffect(() => {
    const sortedFiles = files.sort((a, b) =>
      a.displayName > b.displayName ? 1 : -1
    );
    setSortedFiles(sortedFiles);
  }, [files, setSortedFiles]);

  const onKeyUp = useCallback((event: KeyboardEvent) => {
    if (event.key === "F2") {
      setIsRenamingFile(true);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keyup", onKeyUp, false);

    return () => {
      document.removeEventListener("keyup", onKeyUp, false);
    };
  }, [onKeyUp]);

  return (
    <>
      <FilePanelContainer>
        <ProjectBar
          onNewItem={(_type) => {
            setIsAddingNewFile(true);
          }}
          onRenameItem={(_type) => {
            const file = files.find((x) => x.uri === activeFileUri);
            if (file && file.attributes !== FileAttributes.ReadOnly) {
              setIsRenamingFile(true);
            }
          }}
          onRun={onRun}
        />

        <FileList>
          {isAddingNewFile && (
            <ProjectFilePlaceholder
              initialName=""
              editorFile={undefined}
              fileNameState={fileOperationState}
              saveChanges={(_oldName, name) => {
                if (validateNewFile(name) && name) {
                  setIsAddingNewFile(false);
                  onNewFile(name);
                }
              }}
              validateFileName={(name) => validateNewFile(name)}
              cancelFilePlaceholder={() => setIsAddingNewFile(false)}
            />
          )}
          {sortedFiles.map((f) => {
            if (isRenamingFile && f.uri === activeFileUri) {
              return (
                <ProjectFilePlaceholder
                  initialName={f.displayName}
                  editorFile={f}
                  fileNameState={fileOperationState}
                  saveChanges={(editedFile, name) => {
                    if (validateNewFile(name) && name && editedFile) {
                      setIsRenamingFile(false);
                      onRenameFile(editedFile, name);
                      console.log(`Renamed file ${f.displayName} to ${name}`);
                    }
                  }}
                  validateFileName={(name) => validateNewFile(name)}
                  cancelFilePlaceholder={() => setIsRenamingFile(false)}
                  key={f.displayName}
                />
              );
            } else {
              return (
                <ProjectFile
                  file={f}
                  active={f.uri === activeFileUri}
                  key={f.uri}
                  onOpenFile={onOpenFile}
                  onOpenFileInNewEditor={onOpenFileInNewEditor}
                  isPerformingFileOperation={isPerformingFileOperation}
                />
              );
            }
          })}
        </FileList>
      </FilePanelContainer>
    </>
  );
}
