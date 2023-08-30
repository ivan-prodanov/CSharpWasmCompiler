import {
  CompositeDisposable,
  EditorFile,
  FileAttributes,
  IEditorDiagnosticsChangeEvent,
  IEditorWrapper,
  MarkerData,
} from "@0x33.io/monaco";
import { useMonaco } from "@monaco-editor/react";
import { concat } from "lodash";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Split from "react-split";
import styled, { ThemeContext } from "styled-components";
import { Editor } from "./components/Editor";
import { FilePanel } from "./components/filePanel/FilePanel";
// import { FilePanel } from "./components/FilePanel/FilePanel/";
import { MarkerSeverity } from "monaco-editor";
import { StartupStep } from "./components/Container";
import { BuildInformationPanel } from "./components/buildPanel/BuildInformationPanel";
import { BuildInformationTabType } from "./components/buildPanel/BuildInformationTab";
import {
  BuildOutputEntry,
  BuildOutputSeverity,
} from "./components/buildPanel/BuildOutputPanel";
import {
  ExecutionOutputEntry,
  ExecutionOutputSeverity,
} from "./components/buildPanel/ExecutionOutputPanel";
import {
  HelperClassCode,
  InitialCsharpCode,
  InitialProgramCode,
  ReadMeClassCode,
} from "./constants/bootConstants";
import { useMonacoWorkspace } from "./hooks/useMonacoWorkspace";
import { useOmniWasmBootOptions } from "./omniwasm-worker/hooks";
import {
  useWasmRunnerApi,
  useWasmRunnerLogger,
} from "./wasm-runner-worker/hooks";

// Editor
const EditorContainer = styled.div`
  flex-grow: 1;
  height: 100%;
  position: relative;
  display: flex;
  background-color: ${(props) => props.theme.colors.FileEditorBackground};
`;

const EditorWrapper = styled.div`
  position: relative;
  flex-grow: 1;
  border-right: 1px solid
    ${(props) => props.theme.colors.EditorSplitThumbBorder};
  &:last-of-type {
    border-right: 0px;
  }
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  height: 100%;
  width: 100%;
  overflow: hidden;
  z-index: 1;

  animation: fadeIn 750ms ease-in forwards;
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const SplitPanel = styled(Split)`
  flex-grow: 1;
  position: relative;
  & .gutter {
    cursor: ns-resize;
    background-color: ${(props) => props.theme.colors.FileEditorBackground};
    border-top: ${(props) =>
      "1px solid " + props.theme.colors.EditorDiagnosticThumbBorder};
  }
  & .gutter:hover {
    background-color: #007fd4;
    transition: background-color 500ms ease;
  }
`;

const AbsoluteButton = styled.button`
  position: absolute;
  bottom: 16px;
  right: 16px;
`;

const FixedButton = styled.button`
  position: fixed;
  bottom: 16px;
  right: 16px;
`;

const csharpProjectName = "Project1";

type AppProps = {
  changeStartupStep: (step: StartupStep) => void;
};

function App({ changeStartupStep }: AppProps) {
  const monaco = useMonaco();
  const bootOptions = useOmniWasmBootOptions();
  const wasmRunnerLogger = useWasmRunnerLogger();
  const compositeDisposable = new CompositeDisposable();

  const workspace = useMonacoWorkspace(monaco);
  const wasmRunner = useWasmRunnerApi();
  const { editorController, projects } = workspace || {};

  const themeContext = useContext(ThemeContext);
  const [diagnostics, setDiagnostics] = useState<MarkerData[]>([]);
  const [intermediateDiagnostics, setIntermediateDiagnostics] =
    useState<IEditorDiagnosticsChangeEvent | null>(null);
  const [changeMap, setChangeMap] = useState<
    Record<string, { projectName: string | null; fileName: string | null }>
  >({});
  const [displayFiles, setDisplayFiles] = useState<EditorFile[]>([]);
  const [activeFileUri, setActiveFileUri] = useState<string | null>(null);
  const [activeBuildInformationTab, setActiveBuildInformationTab] =
    useState<BuildInformationTabType>(BuildInformationTabType.Problems);
  const [editors, setEditors] = useState<string[]>(["editor1"]);
  const [editorsCount, setEditorsCount] = useState<number>(2);
  const [buildOutput, setBuildOutput] = useState<BuildOutputEntry[]>([]);
  const [executionOutput, setExecutionOutput] = useState<
    ExecutionOutputEntry[]
  >([]);
  const [intermediateDiagnosticToOpen, setIntermediateDiagnosticToOpen] =
    useState<MarkerData | null>(null);

  const [diagnosticsGathered, setDiagnosticsGathered] =
    useState<boolean>(false);
  const [editorInitialized, setEditorInitialized] = useState<boolean>(false);

  const addExecutionOutputMessage = useCallback(
    (text: string, severity: ExecutionOutputSeverity) => {
      setExecutionOutput([
        ...executionOutput,
        {
          message: text,
          severity: severity,
        },
      ]);
    },
    [executionOutput, setExecutionOutput]
  );

  const addExecutionOutput = useCallback(
    (text: string) =>
      addExecutionOutputMessage(text, ExecutionOutputSeverity.Normal),
    [addExecutionOutputMessage]
  );
  const addExecutionErrorOutput = useCallback(
    (text: string) =>
      addExecutionOutputMessage(text, ExecutionOutputSeverity.Error),
    [addExecutionOutputMessage]
  );
  const addExecutionRuntimeErrorOutput = useCallback(
    (text: string) =>
      addExecutionOutputMessage(text, ExecutionOutputSeverity.RuntimeError),
    [addExecutionOutputMessage]
  );

  wasmRunnerLogger.LogLambda = addExecutionOutput;
  wasmRunnerLogger.LogErrLambda = addExecutionErrorOutput;
  wasmRunnerLogger.LogRuntimeErrLambda = addExecutionRuntimeErrorOutput;

  const tryOpenIntermediateDiagnostic = useCallback(
    (editor: IEditorWrapper) => {
      if (intermediateDiagnosticToOpen) {
        editor.openDiagnostic(intermediateDiagnosticToOpen);
      }

      setIntermediateDiagnosticToOpen(null);
    },
    [intermediateDiagnosticToOpen, setIntermediateDiagnosticToOpen]
  );

  const canOpenFile = useCallback(
    (fileUri: string | null) => {
      if (fileUri) {
        const file = workspace?.fileProvider.getFile(fileUri);
        if (file?.tags.some((x) => x === "internal")) {
          return false;
        }
      }
      return true;
    },
    [workspace]
  );

  const downloadFile = useCallback((byteArray: number[], fileName: string) => {
    const uint8array = Uint8Array.from(byteArray);

    const blob = new Blob([uint8array]);

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    // the filename you want
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }, []);

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme("MonacoTheme", themeContext.editorTheme);
      monaco.editor.setTheme("MonacoTheme");
    }
  }, [monaco]);

  const executeAssembly = useCallback(async (byteArray: number[]) => {
    const uint8array = Uint8Array.from(byteArray);

    await wasmRunner.executeAssembly(uint8array);
  }, []);

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme("MonacoTheme", themeContext.editorTheme);
      monaco.editor.setTheme("MonacoTheme");
    }
  }, [monaco]);

  useEffect(() => {
    if (workspace) {
      compositeDisposable.add(
        workspace?.editorController.onDidAddEditor((e) => {
          // Wrong!
          // We should store disposables in a Map<Editor, CompositeDisposable>
          // also sub outside this event to onDidRemoveEditor and dispose the entry in the map & remove after
          compositeDisposable.add(
            e.editor.onDidOpenDocument((ee) => {
              setActiveFileUri(ee.fileUri);
            })
          );

          compositeDisposable.add(
            e.editor.onWillOpenDocument((ee) => {
              ee.cancel = !canOpenFile(ee.fileUri);
            })
          );

          if (e.editor) {
            tryOpenIntermediateDiagnostic(e.editor);
          }
        })
      );

      compositeDisposable.add(
        workspace?.editorController.onDidChangeCurrentEditor((e) => {
          setActiveFileUri(e.editor?.activeDocumentUri ?? null);
        })
      );
    }
  }, [workspace, tryOpenIntermediateDiagnostic]);

  const updateDiagnostics = useCallback(
    (e: IEditorDiagnosticsChangeEvent) => {
      if (e.fileUri) {
        const file = workspace?.fileProvider.getFile(e.fileUri);
        if (file) {
          setIntermediateDiagnostics(e);
        }
      } else {
        setDiagnostics(e.diagnostics);
      }

      if (diagnosticsGathered === false) {
        setDiagnosticsGathered(true);
      }
    },
    [
      setDiagnostics,
      setIntermediateDiagnostics,
      diagnosticsGathered,
      setDiagnosticsGathered,
    ]
  );

  const openFileInNewEditor = useCallback(
    (fileUri: string | null | undefined) => {
      if (canOpenFile(fileUri ?? null)) {
        setActiveFileUri(fileUri ?? null);
        setEditors((x) => [...x, `editor${editorsCount}`]);
        setEditorsCount((x) => x + 1);
      }
    },
    [setActiveFileUri, setEditors, editorsCount, setEditorsCount, canOpenFile]
  );

  const selectDiagnostic = useCallback(
    (diagnostic: MarkerData, inNewEditor: boolean) => {
      if (workspace) {
        if (!workspace.editorController.currentEditor || inNewEditor) {
          openFileInNewEditor(diagnostic.fileUri);
          setIntermediateDiagnosticToOpen(diagnostic);
        } else {
          workspace.editorController.currentEditor.openDiagnostic(diagnostic);
        }
      }
    },
    [workspace, openFileInNewEditor, setIntermediateDiagnosticToOpen]
  );

  const closeEditor = useCallback(
    (editorId: string, editor: IEditorWrapper) => {
      if (workspace) {
        const newEditors = editors.filter((x) => x !== editorId);
        setEditors(newEditors);
        workspace.editorController.removeEditor(editor);
      }
    },
    [setActiveFileUri, editors, setEditors, workspace]
  );

  useEffect(() => {
    if (intermediateDiagnostics) {
      const fileName = intermediateDiagnostics.fileUri;
      const otherDiagnostics = diagnostics.filter(
        (d) => d.fileUri !== fileName
      );
      const allDiagnostics = concat(
        otherDiagnostics,
        intermediateDiagnostics.diagnostics
      );
      setDiagnostics(allDiagnostics);
    }
  }, [intermediateDiagnostics, setDiagnostics]);

  useEffect(() => {
    async function createDefaultFile() {
      if (
        projects?.length === 0 &&
        editorController &&
        workspace?.createProject &&
        bootOptions
      ) {
        compositeDisposable.add(
          workspace.diagnosticsProvider.onDidDiagnosticsChange((e) =>
            updateDiagnostics(e)
          )
        );
        compositeDisposable.add(
          workspace.diagnosticsProvider.onDidFileChange((e) => {
            const file = workspace.fileProvider.getFile(e.fileUri);
            if (file) {
              setChangeMap((x) => ({
                ...x,
                [`${file.projectName}_${file.displayName}`]: {
                  projectName: file.projectName,
                  fileName: file.displayName,
                },
              }));
            }
          })
        );

        const assemblies = bootOptions.packages.flatMap((p) =>
          p.assemblies.map((a) => ({
            ...a,
            package: p.id,
            documentationName: a.doc?.name || null,
            path: p.id,
          }))
        );
        const project = await workspace.createProject(
          csharpProjectName,
          assemblies
        );
        compositeDisposable.add(
          project.onDidAddFile(({ file }) => {
            setDisplayFiles((x) => [...x, file]);
          })
        );
        compositeDisposable.add(
          project.onDidRemoveFile(({ file }) => {
            setDisplayFiles((x) => {
              const newDisplayFiles = x.filter(
                (element) => element.uri !== file.uri
              );

              return newDisplayFiles;
            });
          })
        );

        // await project.addFile(
        //   "Typings.cs",
        //   "csharp",
        //   InitialTypingsCode,
        //   FileAttributes.None,
        //   ["tutorial"]
        // );
        await project.addFile(
          "Program.cs",
          "csharp",
          InitialProgramCode,
          FileAttributes.ReadOnly
        );
        await project.addFile(
          "HelperClass.cs",
          "csharp",
          HelperClassCode,
          FileAttributes.None //FileAttributes.ReadOnly
        );
        const helloWorldFile = await project.addFile(
          "App.cs",
          "csharp",
          InitialCsharpCode,
          FileAttributes.None
        );
        await project.addFile(
          "README.cs",
          "csharp",
          ReadMeClassCode,
          FileAttributes.ReadOnly //FileAttributes.ReadOnly
        );
        if (editorController.currentEditor) {
          editorController.currentEditor.openDocument(helloWorldFile);
        } else {
          setActiveFileUri(helloWorldFile.uri);
        }

        setEditorInitialized(true);
      }
    }

    createDefaultFile();
  }, [
    projects,
    workspace,
    workspace?.createProject,
    editorController,
    updateDiagnostics,
    bootOptions,
    setDisplayFiles,
    setActiveFileUri,
    setEditorInitialized,
  ]);

  useEffect(() => {
    if (workspace !== null) {
      changeStartupStep(StartupStep.InitializingEditor);
    }
  }, [workspace]);

  useEffect(() => {
    if (editorInitialized === true) {
      changeStartupStep(StartupStep.GatheringDiagnostics);
    }
  }, [editorInitialized]);

  useEffect(() => {
    if (diagnosticsGathered === true) {
      changeStartupStep(StartupStep.Finished);
    }
  }, [diagnosticsGathered]);

  if (workspace === null) {
    return <></>;
  }

  compositeDisposable.add(workspace);
  const project = workspace.projects.find((x) => x);

  if (diagnosticsGathered !== true) {
    return <></>;
  }

  return (
    <AppContainer>
      <FilePanel
        activeFileId={activeFileUri}
        files={displayFiles}
        onNewFile={async (name) =>
          await project?.addFile(name, "csharp", "", FileAttributes.None)
        }
        onRenameFile={async (editedFile, name) => {
          await project?.removeFile(editedFile.displayName);
          await project?.addFile(name, "csharp", "", FileAttributes.None);
        }}
        onOpenFile={(file) => {
          if (editorController) {
            if (editorController.currentEditor) {
              editorController.currentEditor.openDocument(file);
            } else {
              openFileInNewEditor(file.uri);
            }
          }
        }}
        onRun={async () => {
          if (workspace) {
            setActiveBuildInformationTab(BuildInformationTabType.Output);
            let newBuildOutput: BuildOutputEntry[] = [];
            let newExecutionOutput: ExecutionOutputEntry[] = [];

            const addBuildOutputMessage = (
              text: string,
              severity: BuildOutputSeverity
            ) => {
              newBuildOutput.push({
                message: text,
                diagnostic: null,
                severity,
              });

              setBuildOutput(newBuildOutput);
            };

            const addBuildOutputDiagnostic = (diagnostic: MarkerData) => {
              let severity = BuildOutputSeverity.Normal;
              if (diagnostic.severity === MarkerSeverity.Error) {
                severity = BuildOutputSeverity.Error;
              } else if (diagnostic.severity === MarkerSeverity.Warning) {
                severity = BuildOutputSeverity.Warning;
              }

              newBuildOutput.push({
                message: null,
                diagnostic: diagnostic,
                severity: severity,
              });

              setBuildOutput(newBuildOutput);
            };

            addBuildOutputMessage(
              `------ Build started: Project: ${csharpProjectName}, Configuration: Debug Any CPU`,
              BuildOutputSeverity.Success
            );

            const projectName = csharpProjectName;
            const compilationResult =
              await workspace.compilationProvider.compileProject(projectName);

            if (compilationResult) {
              const diagnosticMarkers = compilationResult.diagnostics.map(
                (x) => new MarkerData(x)
              );
              setDiagnostics(diagnosticMarkers);

              diagnosticMarkers.forEach((x) => addBuildOutputDiagnostic(x));

              if (compilationResult.success) {
                // downloadFile(
                //   compilationResult.assemblyData,
                //   `${projectName}.dll`
                // );
                // downloadFile(compilationResult.pdbData, `${projectName}.pdb`);
                // downloadFile(
                //   compilationResult.documentationData,
                //   `${projectName}.xml`
                // );

                addBuildOutputMessage(
                  `Done building project "${csharpProjectName}".`,
                  BuildOutputSeverity.Normal
                );

                addBuildOutputMessage(
                  `==================== Build: succeeded ====================`,
                  BuildOutputSeverity.Success
                );

                setExecutionOutput([]);
                try {
                  setActiveBuildInformationTab(
                    BuildInformationTabType.Terminal
                  );
                  await executeAssembly(compilationResult.assemblyData);
                } finally {
                }

                console.log("Finished");
              } else {
                addBuildOutputMessage(
                  `Done building project "${csharpProjectName}" -- FAILED.`,
                  BuildOutputSeverity.Normal
                );
                addBuildOutputMessage(
                  `Build has been canceled.`,
                  BuildOutputSeverity.Normal
                );

                setActiveBuildInformationTab(BuildInformationTabType.Problems);
              }
            }
          }
        }}
        onOpenFileInNewEditor={(file) => openFileInNewEditor(file.uri)}
      />
      <SplitPanel sizes={[70, 30]} direction="vertical" gutterSize={5}>
        <EditorContainer>
          {editors.map((eName, i) => (
            <EditorWrapper key={eName}>
              <Editor
                activeFileUri={activeFileUri}
                openFileInNewEditor={(fileUri) => openFileInNewEditor(fileUri)}
                closeEditor={(id, editor) => closeEditor(eName, editor)}
                editorId={eName}
                workspace={workspace}
                // defaultPath={file.name}
                // value={file.content}
              />
            </EditorWrapper>
          ))}
        </EditorContainer>
        <BuildInformationPanel
          diagnostics={diagnostics}
          buildOutput={buildOutput}
          executionOutput={executionOutput}
          selectDiagnostic={selectDiagnostic}
          files={displayFiles}
          activeTab={activeBuildInformationTab}
          onChangeActiveTab={(newTabType) => {
            setActiveBuildInformationTab(newTabType);
          }}
        />
      </SplitPanel>
    </AppContainer>
  );
}

export default App;
