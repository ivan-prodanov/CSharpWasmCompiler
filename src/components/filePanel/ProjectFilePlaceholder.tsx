import { EditorFile } from "@0x33.io/monaco";
import React, { useCallback, useContext, useEffect, useState } from "react";
import styled, { ThemeContext } from "styled-components";

type ProjectFilePlaceholderContainerProps = {
  fileNameState: FileNameState;
};

const ProjectFileInput = styled.input.attrs({
  type: "text",
})`
  padding-top: 1px;
  padding-bottom: 1px;
  font-size: 13px;
  width: 100%;
  background: ${(props) =>
    props.theme.colors.FilePanelFilePlaceholderBackground};
  color: ${(props) => props.theme.colors.FilePanelForeground};
  outline: none;
  border: none;
`;

const FileIcon = styled.img`
  height: 18px;
  display: inline-flex;
  margin-right: 4px;
`;

const ErrorTooltip = styled.div`
  visibility: "hidden";
  background-color: ${(props) =>
    props.theme.colors.FilePanelFilePlaceholderErrorTooltipBackground};
  color: ${(props) => props.theme.colors.FilePanelForeground};
  position: absolute;
  left: -1px;
  right: -1px;
  top: 18px;
  border: ${(props) =>
    `1px solid ${props.theme.colors.FilePanelFilePlaceholderBorderError}`};
  z-index: 100;
  padding: 3px 7px;
  font-size: 12px;
`;

const ProjectFilePlaceholderContainer = styled.div<ProjectFilePlaceholderContainerProps>`
  cursor: pointer;
  border: ${({ fileNameState, theme }) =>
    fileNameState === FileNameState.None
      ? `1px solid ${theme.colors.FilePanelActiveFileBorder}`
      : `1px solid ${theme.colors.FilePanelFilePlaceholderBorderError}`};
  display: flex;
  align-items: center;
  padding-left: 10px;
  padding-right: 0px;
  background: ${(props) =>
    props.theme.colors.FilePanelFilePlaceholderBackground};
  display: "flex";
  position: relative;

  & ${ProjectFileInput} + ${ErrorTooltip} {
    visibility: ${(props) =>
      props.fileNameState === FileNameState.None ? "hidden" : "visible"};
  }
`;

export enum FileNameState {
  None,
  FileNameEmpty,
  FileNameAlreadyExists,
}

type ProjectFilePlaceholderProps = {
  fileNameState: FileNameState;
  initialName: string;
  editorFile: EditorFile | undefined;
  cancelFilePlaceholder: () => void;
  saveChanges: (
    editorFile: EditorFile | undefined,
    name: string | undefined
  ) => void;
  validateFileName: (name: string | undefined) => void;
};

export function ProjectFilePlaceholder({
  fileNameState,
  initialName,
  editorFile,
  cancelFilePlaceholder,
  saveChanges,
  validateFileName,
}: ProjectFilePlaceholderProps) {
  const themeContext = useContext(ThemeContext);
  const textInput = React.createRef<HTMLInputElement>();
  const [fileErrorMessage, setFileErrorMessage] = useState("");
  const [initialFocusSet, setInitialFocusSet] = useState(false);
  const [initialTextSet, setInitialTextSet] = useState(false);

  const getFileNameWithExtension = (fileName: string | undefined) => {
    let fileNameWithExtension = fileName;

    if (fileNameWithExtension) {
      // Remove "\" and "/"
      fileNameWithExtension = fileNameWithExtension.replaceAll(/[\/\\]/g, "");
      if (!fileNameWithExtension.endsWith(".cs")) {
        fileNameWithExtension = `${fileNameWithExtension}.cs`;
      }
    }

    return fileNameWithExtension;
  };

  const onKeyUp = useCallback(
    (event) => {
      if (event.key === "Escape") {
        cancelFilePlaceholder();
      } else {
        const filteredFileName = getFileNameWithExtension(
          textInput.current?.value
        );
        if (event.key === "Enter") {
          saveChanges(editorFile, filteredFileName);
        } else {
          validateFileName(filteredFileName);
        }
      }
    },
    [textInput, cancelFilePlaceholder, saveChanges, validateFileName]
  );

  useEffect(() => {
    if (!initialFocusSet) {
      textInput.current?.focus();
      setInitialFocusSet(true);
    }
  }, [textInput, initialFocusSet, setInitialFocusSet]);

  useEffect(() => {
    if (textInput.current) {
      if (!initialTextSet) {
        textInput.current.value = initialName;

        var extensionIndex = initialName.lastIndexOf(".");
        textInput.current.selectionStart = 0;
        textInput.current.selectionEnd =
          extensionIndex == -1 ? initialName.length : extensionIndex;

        setInitialTextSet(true);
      }
    }
  }, [initialName, textInput, initialTextSet, setInitialTextSet]);

  useEffect(() => {
    document.addEventListener("keyup", onKeyUp, false);

    return () => {
      document.removeEventListener("keyup", onKeyUp, false);
    };
  }, [onKeyUp]);

  useEffect(() => {
    let errorMessage = "";
    if (fileNameState === FileNameState.FileNameAlreadyExists) {
      errorMessage =
        "A file with this name already exists. Please choose a different name.";
    } else if (fileNameState === FileNameState.FileNameEmpty) {
      errorMessage = "A file name must be provided.";
    }

    setFileErrorMessage(errorMessage);
  }, [setFileErrorMessage, fileNameState]);

  return (
    <>
      <ProjectFilePlaceholderContainer fileNameState={fileNameState}>
        <FileIcon src={themeContext.icons.CSharpFile} />
        <ProjectFileInput
          ref={textInput}
          onBlur={(e) => {
            const fileName = textInput.current?.value;
            if (fileName) {
              const filteredFileName = getFileNameWithExtension(fileName);
              saveChanges(editorFile, filteredFileName);
            } else {
              cancelFilePlaceholder();
            }
          }}
          spellCheck="false"
        />
        <ErrorTooltip>{fileErrorMessage}</ErrorTooltip>
      </ProjectFilePlaceholderContainer>
    </>
  );
}
