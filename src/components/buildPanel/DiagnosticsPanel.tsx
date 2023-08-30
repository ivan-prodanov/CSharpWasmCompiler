import { EditorFile, MarkerData } from "@0x33.io/monaco";
import { groupBy, keyBy, sortBy } from "lodash";
import { MarkerSeverity } from "monaco-editor";
import React, { useContext, useMemo, useState } from "react";
import styled, { ThemeContext } from "styled-components";
import { ScrollableChild } from "../ScrollableChild";

const DiagnosticsPanelContainer = styled(ScrollableChild)`
  user-select: none;
`;

const FileDiagnosticListContainer = styled.div`
  background-color: ${(props) => props.theme.colors.FileEditorBackground};
  flex-direction: column;
  display: flex;
`;

const FileName = styled.div`
  padding-top: 1px;
  padding-bottom: 1px;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FileRow = styled.div`
  background-color: ${(props) => props.theme.colors.FileEditorBackground};
  display: flex;
  flex-direction: row;
  padding-left: 8px;
`;

const FileIcon = styled.img`
  height: 18px;
  display: inline-flex;
  margin-right: 4px;
`;

const DiagnosticRowContainer = styled.div<DiagnosticProps>`
  background-color: ${(props) => props.theme.colors.FileEditorBackground};
  display: flex;
  flex-direction: row;
  padding-left: 20px;
  cursor: pointer;
  background: ${({ theme, active }) =>
    active ? theme.colors.FilePanelActiveFileBackground : "inherit"};
  border: ${({ theme, active }) =>
    active
      ? "1px solid " + theme.colors.FilePanelActiveFileBorder
      : "1px solid transparent"};
  color: ${({ theme, active }) =>
    active ? theme.colors.FilePanelActiveFile : "inherit"};
  &:hover {
    background: ${({ theme, active }) =>
      active
        ? theme.colors.FilePanelActiveFileBackground
        : theme.colors.FilePanelFileHover};
  }
  align-items: center;
`;

const DiagnosticIcon = styled.img<DiagnosticProps>`
  height: 18px;
  display: inline-flex;
  margin-right: 4px;
  filter: ${(props) => (props.active ? "brightness(0) invert(1)" : "none()")};
`;

interface DiagnosticProps {
  active: boolean;
}

const DiagnosticContainer = styled.div`
  padding-top: 1px;
  padding-bottom: 1px;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

type ErrorPanelProps = {
  diagnostics: MarkerData[];
  files: EditorFile[];
  selectDiagnostic: (marker: MarkerData, inNewEditor: boolean) => void;
};

export function DiagnosticsPanel({
  diagnostics,
  files,
  selectDiagnostic,
}: ErrorPanelProps) {
  const [activeDiagnostic, setActiveDiagnostic] = useState<MarkerData | null>(
    null
  );
  const [activeFile, setActiveFile] = useState<string | null>(null);

  const themeContext = useContext(ThemeContext);

  const fileMap = useMemo<Record<string, EditorFile>>(() => {
    return keyBy(files, (d) => d.uri);
  }, [files]);

  return (
    <>
      <DiagnosticsPanelContainer>
        {Object.entries(groupBy(diagnostics, (d) => d.fileUri)).map(
          ([fileUri, fileDiagnostics], i) => {
            const fileEntry = fileMap[fileUri];
            if (fileEntry) {
              const displayName = fileEntry.displayName;
              return (
                <FileDiagnosticListContainer
                  key={displayName}
                  onClick={() => setActiveFile(displayName)}
                >
                  <FileRow>
                    <FileIcon src={themeContext.icons.CSharpFile} />
                    <FileName>{displayName}</FileName>
                  </FileRow>
                  {sortBy(fileDiagnostics, [
                    "startLineNumber",
                    "startColumn",
                  ]).map((d, i) => (
                    <DiagnosticRowContainer
                      key={`${d.id}SLN${d.startLineNumber}ELN${d.endLineNumber}SC${d.startColumn}EC${d.endLineNumber}`}
                      active={activeDiagnostic === d}
                      onClick={(event) => {
                        setActiveDiagnostic(d);
                        selectDiagnostic(d, event.ctrlKey || event.metaKey);
                      }}
                    >
                      <DiagnosticIcon
                        active={activeDiagnostic === d}
                        src={
                          d.severity === MarkerSeverity.Error
                            ? themeContext.icons.Error
                            : themeContext.icons.Warning
                        }
                      />
                      <DiagnosticContainer>{d.message}</DiagnosticContainer>
                    </DiagnosticRowContainer>
                  ))}
                </FileDiagnosticListContainer>
              );
            }
          }
        )}
      </DiagnosticsPanelContainer>
    </>
  );
}
