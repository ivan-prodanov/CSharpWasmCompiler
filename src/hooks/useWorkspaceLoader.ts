// import { EditorFile, IWorkspace } from '@0x33.io/monaco';
// import { IDisposable } from 'monaco-editor';
// import { useCallback, useMemo, useState } from 'react';
// import { useOmniWasmBootOptions } from '../wasm-worker/hooks';

// export function useWorkspaceLoader(workspace: IWorkspace) {
//     const [files, setFiles] = useState<EditorFile[]>([]);
//     const [projects, setProjects] = useState<EditorFile[]>([]);
//     const bootOptions = useOmniWasmBootOptions();

//     const packagedAssemblies = useMemo(
//         () => bootOptions?.packages.flatMap((p) => p.assemblies.map((a) => ({ ...a, package: p.id }))) || [],
//         [bootOptions?.packages]
//     );

//     interface IFileInfo {
//         disposables: IDisposable[];
//         name: string;
//         projectId: string;
//         projectName: string;
//     }

//     const createProject = useCallback(
//         (projectName: string) => {
//             return new Promise<string>((resolve, reject) => {
//                 async function createWasmProject() {
//                     if (packagedAssemblies.length > 0) {
//                         try {
//                             const assemblyNames = packagedAssemblies
//                                 .filter((x) => x.name.startsWith('System.Private.CoreLib'))
//                                 .map((x) => `${x.package}//${x.name}`);

//                             console.log(assemblyNames, packagedAssemblies);

//                             const project = await workspace.createProject(projectName, assemblyNames);
//                             project.onDidAddFile((e) => {});

//                             project.onDidRemoveFile((e) => {});

//                             const projectId = project;
//                             setProjectId(project.id);
//                             setFiles((x) => [...x, { id: fileId, name: name, content: content, uri: fileUri }]);

//                             resolve(project.id);
//                         } catch (ex) {
//                             reject(ex);
//                         }
//                     }
//                 }

//                 createWasmProject();
//             });
//         },
//         [setProjectId]
//     );

//     const addFile = useCallback(
//         (name: string, content: string) => {
//             if (!project?.id) {
//                 return;
//             }

//             const projectId = project.id;
//             return new Promise<string>(async (resolve, reject) => {
//                 try {
//                     project.addFile(name, Language, content);
//                     const fileId = await api.createFile(projectId, {
//                         fileName: name,
//                         code: content,
//                     });

//                     const converter = new EditorUriConverter();
//                     const fileUri = converter.fromDocument(ProjectName, name);

//                     setFiles((x) => [...x, { id: fileId, name: name, content: content, uri: fileUri }]);

//                     resolve(fileId);
//                 } catch (ex) {
//                     reject(ex);
//                 }
//             });
//         },
//         [api, project]
//     );

//     const workspaceContainer = useMemo(() => {
//         if (api) {
//             return new WorkspaceFactory().createWorkspace(monaco, api);
//         }

//         return null;
//     }, [api]);

//     return { workspaceContainer };
// }
export default function fucku() {}
