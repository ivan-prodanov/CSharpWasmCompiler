export default function fucku() {}
// import { EditorUriConverter } from '@0x33.io/monaco';
// import { IWorkspaceContainer } from '@0x33.io/monaco/dist/bind';
// import Project from '@0x33.io/monaco/dist/workspaces/Project';
// import { useCallback, useState } from 'react';
// import { Language, ProjectName } from '../constants/bootConstants';
// import EditorFile from '../models/EditorFile';

// export function useWasmFiles({
//     workspaceContainer,
//     project,
// }: {
//     workspaceContainer: IWorkspaceContainer;
//     project: Project | null;
// }) {
//     const [files, setFiles] = useState<EditorFile[]>([]);

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

//     return { files, addFile };
// }
