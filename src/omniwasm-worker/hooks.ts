import { BootJsonData } from '@0x33.io/wasm-sdk';
import { proxy, releaseProxy, Remote, wrap } from 'comlink';
import { CompilerWorkspace } from 'omniwasm';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { OmniWasmWorkerContract } from './api/contract';

export class WasmWorker {
    private static _wrapperWorker: Remote<OmniWasmWorkerContract>;

    static create() {
        WasmWorker.terminate();
        const workerId = `omniwasm-${new Date().getTime()}`;
        const _instance = new Worker('./api/index', {
            name: workerId,
            type: 'module',
        });
        const worker = wrap<OmniWasmWorkerContract>(_instance);

        WasmWorker._wrapperWorker = worker;
        console.log('create worker instance');

        return { worker, id: workerId };
    }

    static terminate() {
        if (WasmWorker._wrapperWorker) {
            console.log('dispose worker instance 1');
            WasmWorker._wrapperWorker[releaseProxy]();
            WasmWorker._wrapperWorker.free();
            (WasmWorker._wrapperWorker as unknown as Worker).terminate();
        }
    }
}

export const WasmWorkerContext = React.createContext<{
    context: { worker: Remote<OmniWasmWorkerContract>; id: string };
    bootOptions: BootJsonData | null;
}>({ context: WasmWorker.create(), bootOptions: null });

export function useOmniWasm() {
    const { context } = useContext(WasmWorkerContext);
    const boot = useWasmLoader({ worker: context.worker });

    return { context, boot };
}

export function useOmniWasmApi() {
    const { context } = useContext(WasmWorkerContext);

    return context.worker as unknown as CompilerWorkspace;
}

export function useOmniWasmBootOptions() {
    const { bootOptions } = useContext(WasmWorkerContext);

    return bootOptions;
}

type LoaderConfiguration = {
    worker: OmniWasmWorkerContract;
};

function useWasmLoader({ worker }: LoaderConfiguration) {
    const [bootCompleted, setBootCompleted] = useState(false);
    const [bootData, setBootData] = useState<BootJsonData>();
    const [bootFailed, setBootFailed] = useState(false);
    const [progress, setProgress] = useState<number>(0);

    useEffect(() => {
        async function load() {
            try {
                const bootConfig = await worker.load(
                    {
                        baseUri: `${window.location.origin}/${process.env.REACT_APP_WASM_RUNTIME_DIRECTORY}/`,
                        wasmRuntimeDirectory: `/${process.env.REACT_APP_WASM_RUNTIME_DIRECTORY}` || '',
                    },
                    proxy(setProgress)
                );
                setBootData(bootConfig);
            } catch (ex) {
                console.error(ex);
                setBootFailed(true);
            } finally {
                setBootCompleted(true);
            }
        }

        load();
    }, []);

    const bootResult = useMemo(
        () => ({
            bootCompleted,
            bootFailed,
            progress,
            bootData,
        }),
        [bootCompleted, bootFailed, progress, bootData]
    );

    return bootResult;
}
