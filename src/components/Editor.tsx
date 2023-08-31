import {
  CompositeDisposable,
  EditorFile,
  IEditorWrapper,
  IWorkspace,
} from "@0x33.io/monaco";
import MonacoEditor, { DiffEditor, EditorProps } from "@monaco-editor/react";
import * as Monaco from "monaco-editor";
import { editor } from "monaco-editor";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useResizeDetector } from "react-resize-detector";
import styled, { ThemeContext } from "styled-components";
import { EditorActions } from "../actions";
import { Language } from "../constants/bootConstants";
import { Overlay } from "./Overlay";

const TabPanel = styled.div`
  display: flex;
  background-color: ${(props) => props.theme.colors.FilePanelBackground};
  color: ${(props) => props.theme.colors.FilePanelForeground};
  user-select: none;
`;

const OpenTabs = styled.div`
  display: flex;
  overflow-x: auto;

  border-color: rgba(0, 0, 0, 0);
  background-clip: text;
  background-clip: text;
  transition: border-color 0.8s linear;
  &:hover {
    border-color: rgba(255, 255, 255, 0.1);
    transition: border-color 0.125s linear;
  }
  &::-webkit-scrollbar {
    height: 0.2em;
  }
  &::-webkit-scrollbar-track {
    /* boxshadow: inset 0 0 6px rgba(0, 0, 0, 0);
    webkitboxshadow: inset 0 0 6px rgba(0, 0, 0, 0); */

    display: none;
  }
  &::-webkit-scrollbar,
  &::-webkit-scrollbar-thumb,
  &::-webkit-scrollbar-corner {
    /* add border to act as background-color */
    border-right-style: inset;
    /* sum viewport dimensions to guarantee border will fill scrollbar */
    border-right-width: calc(100vw + 100vh);
    /* inherit border-color to inherit transitions */
    border-color: inherit;
  }
  &::-webkit-scrollbar-thumb {
    border-color: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    border-color: rgba(255, 255, 255, 0.15);
  }
  &::-webkit-scrollbar-thumb:active {
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

interface EditorInstanceProps {
  isDiffMode: boolean;
}

const TextEditorPanel = styled.div<EditorInstanceProps>`
  display: ${({ isDiffMode }) => (isDiffMode ? "none" : "flex")};
`;

const File = styled.div`
  padding-top: 1px;
  padding-bottom: 1px;
  padding-right: 10px;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FileIcon = styled.img`
  height: 18px;
  display: inline-flex;
  margin-right: 4px;
`;

interface FileProps {
  active: boolean;
}

const CloseTabButton = styled.img<FileProps>`
  height: 18px;
  display: inline-flex;
  margin-left: auto;
  visibility: ${({ active }) => (active ? "visible" : "hidden")};
  opacity: ${(props) => (props.active ? 1 : 0.75)};
  padding: 1px;
  border-radius: 5px;
`;

const WorkspaceIcon = styled.img`
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) =>
      theme.colors.TabPanelWorkspaceActionsIconHoverBackground};
  }
`;

const Tab = styled.div<FileProps>`
  cursor: pointer;
  background: ${({ theme, active }) =>
    active
      ? theme.colors.FileEditorBackground
      : theme.colors.TabPanelBackground};
  color: ${({ theme, active }) =>
    active
      ? theme.colors.TabPanelActiveFile
      : theme.colors.TabPanelInactiveFile};
  display: flex;
  align-items: center;
  padding-left: 10px;
  padding-right: 6px;
  flex-shrink: 0;
  min-width: 6em;
  height: 2.2em;
  margin-right: 1px;
  &:last-of-type {
    margin-right: 0;
  }
  &:hover ${CloseTabButton} {
    visibility: visible;
    &:hover {
      background: ${({ active, theme }) =>
        active
          ? theme.colors.TabPanelActiveFileCloseButtonBackground
          : theme.colors.TabPanelInactiveFileCloseButtonBackground};
    }
  }
`;

const WorkspaceIconsPanel = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 10px;
`;

export interface OmniWasmEditorProps extends EditorProps {
  activeFileUri: string | null;
  workspace: IWorkspace;
  openFileInNewEditor: (fileUri: string) => void;
  closeEditor: (editorId: string, editor: IEditorWrapper) => void;
  editorId: string;
  //onOpenFile: (file: EditorFile) => void;
}

export function Editor(props: OmniWasmEditorProps) {
  const { width, height, ref } = useResizeDetector();
  const themeContext = useContext(ThemeContext);

  const [editor, setEditor] = useState<IEditorWrapper | null>(null);
  const [diffEditor, setDiffEditor] =
    useState<editor.IStandaloneDiffEditor | null>(null);
  const [monaco, setMonaco] = useState<typeof Monaco | null>(null);

  const [activeTabUri, setActiveTabUri] = useState<string | null>(null);

  const [openFiles, setOpenFiles] = useState<EditorFile[]>([]);
  const [intermediateOpenedFile, setintermediateOpenedFile] = useState<
    string | null
  >(null);
  const [intermediateClosedFile, setintermediateClosedFile] = useState<
    string | null
  >(null);
  const [intermediateOpenFileInNewEditor, setIntermediateOpenFileInNewEditor] =
    useState<string | null>(null);
  const compositeDisposable = new CompositeDisposable();

  const [filesInDiffMode, setFilesInDiffMode] = useState<string[]>([]);

  const isInDiffMode = useMemo<boolean>(
    () => activeTabUri !== null && filesInDiffMode.indexOf(activeTabUri) !== -1,
    [filesInDiffMode, activeTabUri]
  );

  const toggleDiffMode = useCallback(
    (fileUri: string) => {
      const index = filesInDiffMode.indexOf(fileUri);
      if (index === -1) {
        setFilesInDiffMode([...filesInDiffMode, fileUri]);
      } else {
        setFilesInDiffMode(filesInDiffMode.filter((x) => x !== fileUri));
      }
    },
    [filesInDiffMode, setFilesInDiffMode]
  );

  const addOpenedFile = useCallback(
    (fileUri: string) => {
      setintermediateOpenedFile(fileUri);
    },
    [setintermediateOpenedFile]
  );

  useEffect(() => {
    if (
      monaco &&
      diffEditor &&
      activeTabUri &&
      filesInDiffMode.indexOf(activeTabUri) !== -1
    ) {
      const modifiedUri = activeTabUri;
      const originalUri = `backup-${modifiedUri}`;
      const modifiedModel = monaco.editor.getModel(
        monaco.Uri.parse(modifiedUri)
      );
      const originalModel = monaco.editor.getModel(
        monaco.Uri.parse(originalUri)
      );

      if (modifiedModel && originalModel && diffEditor) {
        const currentModel = diffEditor.getModel();
        if (
          currentModel?.modified !== modifiedModel ||
          currentModel?.original !== originalModel
        ) {
          diffEditor.setModel({
            modified: modifiedModel,
            original: originalModel,
          });
        }
      }
    }
  }, [activeTabUri, diffEditor, monaco]);

  useEffect(() => {
    if (intermediateOpenedFile) {
      if (!openFiles.some((x) => x.uri === intermediateOpenedFile)) {
        const file = props.workspace.fileProvider.getFile(
          intermediateOpenedFile
        );
        if (file) {
          setOpenFiles((x) => [...x, file]);
        }
      }

      setActiveTabUri(intermediateOpenedFile);
      setintermediateOpenedFile(null);
    }
  }, [
    intermediateOpenedFile,
    openFiles,
    setintermediateOpenedFile,
    setActiveTabUri,
    setOpenFiles,
  ]);

  const removeOpenedFile = useCallback(
    (fileUri: string) => {
      setintermediateClosedFile(fileUri);
    },
    [setintermediateClosedFile]
  );

  const openFileInNewEditor = useCallback(
    (fileUri: string) => {
      setIntermediateOpenFileInNewEditor(fileUri);
    },
    [setIntermediateOpenFileInNewEditor]
  );

  useEffect(() => {
    if (intermediateOpenFileInNewEditor) {
      props.openFileInNewEditor(intermediateOpenFileInNewEditor);
      setIntermediateOpenFileInNewEditor(null);
    }
  }, [intermediateOpenFileInNewEditor, setIntermediateOpenFileInNewEditor]);

  useEffect(() => {
    if (intermediateClosedFile) {
      const openedFiles = openFiles.filter(
        (x) => x.uri !== intermediateClosedFile
      );
      setOpenFiles(openedFiles);
      if (openedFiles.length == 0 && editor) {
        props.closeEditor(props.editorId, editor);
      }
      setintermediateClosedFile(null);
    }
  }, [
    intermediateClosedFile,
    openFiles,
    setintermediateClosedFile,
    setActiveTabUri,
    setOpenFiles,
  ]);

  return (
    <>
      <Overlay ref={ref}></Overlay>
      <Overlay zIndex={1}>
        <TabPanel>
          <OpenTabs>
            {openFiles.map((f) => (
              <Tab
                key={f.uri}
                active={f.uri === activeTabUri}
                onMouseDown={(x) => {
                  if (x.button === 0) {
                    editor?.openDocumentUri(f.uri);
                  } else if (x.button === 1) {
                    editor?.closeDocument(f);
                  } else if (x.button === 2) {
                    console.log("TODO show ctx menu");
                  }
                  x.preventDefault();
                }}
              >
                <FileIcon src={themeContext.icons.CSharpFile} />{" "}
                <File>{f.displayName}</File>
                <CloseTabButton
                  active={f.uri === activeTabUri}
                  src={themeContext.icons.Close}
                  onMouseDown={(x) => {
                    if (x.button === 0 || x.button === 1) {
                      editor?.closeDocument(f);
                    }
                    x.stopPropagation();
                    x.preventDefault();
                  }}
                />
              </Tab>
            ))}
          </OpenTabs>
          {openFiles.length > 0 && (
            <WorkspaceIconsPanel>
              <WorkspaceIcon
                src={themeContext.icons.GitCompare}
                onMouseDown={(x) => {
                  if (activeTabUri) {
                    if (
                      isInDiffMode ||
                      props.workspace.editorController.isModelChanged(
                        activeTabUri
                      )
                    ) {
                      toggleDiffMode(activeTabUri);
                    }
                  }
                }}
              />
              <WorkspaceIcon
                src={themeContext.icons.SplitHorizontal}
                onMouseDown={(x) => {
                  if (activeTabUri) {
                    openFileInNewEditor(activeTabUri);
                  }
                }}
              />
              {/* <WorkspaceIcon
                src={themeContext.icons.Ellipsis}
                onMouseDown={(x) => {}}
              /> */}
            </WorkspaceIconsPanel>
          )}
        </TabPanel>

        {isInDiffMode && (
          <DiffEditor
            width={width}
            height={height}
            theme="MonacoTheme"
            keepCurrentOriginalModel={true}
            keepCurrentModifiedModel={true}
            language="csharp"
            options={{
              selectOnLineNumbers: true,
              formatOnType: true,
              formatOnPaste: true,
              glyphMargin: true,
              renderSideBySide: false,
              lineNumbersMinChars: 3,
              minimap: {
                showSlider: "always",
                size: "fill",
              },
            }}
            onMount={(_editor, _monaco) => {
              setDiffEditor(_editor);
              compositeDisposable.add(
                _editor.onDidDispose(() => setDiffEditor(null))
              );

              // TODO register the diff editor in the controller paired to the editor instance.
              // the controller must use both editors of the diff editor and hook to onDidFocusEditorText().
              // when text is focused, set active editor to the paired real editor passed from the diff editor registration in step 1.
              // This will ensure that the activeEditor in the backend is always the editor paired to the diff editor

              // And then you can implement the workspace icons being visible only in the active editor because state is maintainted.
            }}
          />
        )}

        <TextEditorPanel isDiffMode={isInDiffMode}>
          <MonacoEditor
            width={width}
            height={height}
            theme="MonacoTheme"
            keepCurrentModel={true}
            options={{
              selectOnLineNumbers: true,
              formatOnType: true,
              formatOnPaste: true,
              glyphMargin: true,
              "semanticHighlighting.enabled": true,
              trimAutoWhitespace: false,
              lineNumbersMinChars: 3,
              minimap: {
                showSlider: "always",
                size: "fill",
              },
            }}
            onMount={(_editor, _monaco) => {
              const splitViewAction =
                EditorActions.createSplitViewActionDescriptor((ed) => {
                  const fileUri = ed.getModel()?.uri.toString();
                  if (fileUri) {
                    openFileInNewEditor(fileUri);
                  }
                });

              _editor.addAction(splitViewAction);

              const editorWrapper =
                props.workspace.editorWrapperFactory.create(_editor);

              compositeDisposable.add(
                editorWrapper.onDidOpenDocument((e) => {
                  addOpenedFile(e.fileUri);
                })
              );

              compositeDisposable.add(
                editorWrapper.onDidCloseDocument((e) => {
                  removeOpenedFile(e.fileUri);
                })
              );

              setEditor(editorWrapper);
              setMonaco(_monaco);

              props.workspace.editorController.addEditor(
                editorWrapper,
                props.activeFileUri
              );
            }}
            language={Language}
            {...props}
          />
        </TextEditorPanel>
      </Overlay>
    </>
  );
}
