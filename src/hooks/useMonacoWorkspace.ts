import { IWorkspace, MarkerData, WorkspaceFactory } from '@0x33.io/monaco';
import { Monaco } from '@monaco-editor/react';
import { useEffect, useState } from 'react';
import { useOmniWasmApi } from '../omniwasm-worker/hooks';

export interface OmniWasmOptions {
    onMarkersReady?: ((markers: MarkerData[]) => void) | undefined;
}

export function useMonacoWorkspace(monaco: Monaco | null) {
    const api = useOmniWasmApi();
    const [workspace, setWorkspace] = useState<IWorkspace | null>(null);

    useEffect(() => {
        if (monaco && api && !workspace) {
            const workspaceFactory = new WorkspaceFactory();
            const workspace = workspaceFactory.createWorkspace(monaco, api);
            setWorkspace(workspace);
        }
    }, [api, monaco, workspace, setWorkspace]);

    // const workspaceContainer = useMemo(() => {
    //     if (api && monaco) {
    //         return new WorkspaceFactory().createWorkspace(monaco, api);
    //     }

    //     return null;
    // }, [api, monaco]);

    return workspace;
}
