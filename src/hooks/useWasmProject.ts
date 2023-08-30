// import { BootJsonData } from '@0x33/wasm-sdk';
// import { IWorkspaceContainer } from '@0x33.io/monaco/dist/bind';
// import Project from '@0x33.io/monaco/dist/workspaces/Project';
// import { useCallback, useEffect, useMemo, useState } from 'react';

// type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
//     ? ElementType
//     : never;

// type Package = ArrayElement<BootJsonData['packages']>;
// type Assembly = ArrayElement<Package['assemblies']> & { package: string };

// type LoaderConfiguration = {
//     workspaceContainer: IWorkspaceContainer | null;
//     projectAssemblyScope: Assembly[];
//     projectId?: string;
//     projectName?: string;
// };

// export function useWasmProject({
//     workspaceContainer,
//     projectAssemblyScope,
//     projectId: targetProjectId,
//     projectName,
// }: LoaderConfiguration) {
//     const [projectId, setProjectId] = useState<string | null>(targetProjectId || null);

//     const createProject = useCallback(
//         (projectName: string) => {
//             return new Promise<string>((resolve, reject) => {
//                 async function createWasmProject() {
//                     if (workspaceContainer && projectAssemblyScope.length > 0) {
//                         try {
//                             const assemblyNames = projectAssemblyScope
//                                 .filter((x) => x.name.startsWith('System.Private.CoreLib'))
//                                 .map((x) => `${x.package}//${x.name}`);

//                             console.log(assemblyNames, projectAssemblyScope);

//                             const project = await workspaceContainer.workspace.createProject(
//                                 projectName,
//                                 assemblyNames
//                             );
//                             const projectId = project;
//                             setProjectId(project.id);
//                             resolve(project.id);
//                         } catch (ex) {
//                             reject(ex);
//                         }
//                     }
//                 }

//                 createWasmProject();
//             });
//         },
//         [projectAssemblyScope, workspaceContainer, setProjectId]
//     );

//     useEffect(() => {
//         if (projectName) {
//             createProject(projectName);
//         }
//     }, [projectName, createProject]);

//     const project = useMemo<Project | null>(() => {
//         if (workspaceContainer && projectId !== null) {
//             const target: Project = {
//                 createProject,
//                 id: projectId,
//             };

//             return target;
//         }

//         return null;
//     }, [workspaceContainer, createProject, projectId]);

//     return project;
// }
export default function fucku() {}
