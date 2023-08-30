import { BootJsonData } from '@0x33.io/wasm-sdk';
import { proxy, releaseProxy, Remote, wrap } from 'comlink';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { WasmRunner } from '../../../0x33/WasmRunner/WasmRunner/WasmRunner/bin/Debug/net5.0/js/dist';
import { WasmRunnerWorkerContract } from './api/contract';
import WasmRunnerLogger from './wasmRunnerLogger';

export class WasmWorker {
    private static _wrapperWorker: Remote<WasmRunnerWorkerContract>;

    static create() {
        WasmWorker.terminate();
        const workerId = `wasmrunner-${new Date().getTime()}`;
        const _instance = new Worker('./api/index', {
            name: workerId,
            type: 'module',
        });
        const worker = wrap<WasmRunnerWorkerContract>(_instance);

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
    context: { worker: Remote<WasmRunnerWorkerContract>; id: string };
    bootOptions: BootJsonData | null;
    logger: WasmRunnerLogger;
}>({ context: WasmWorker.create(), bootOptions: null, logger: new WasmRunnerLogger() });

export function useWasmRunner() {
    const { context, logger } = useContext(WasmWorkerContext);
    const boot = useWasmLoader({ worker: context.worker, logger: logger });

    return { context, boot, logger };
}

export function useWasmRunnerApi() {
    const { context } = useContext(WasmWorkerContext);

    return context.worker as unknown as WasmRunner;
}

export function useWasmRunnerBootOptions() {
    const { bootOptions } = useContext(WasmWorkerContext);

    return bootOptions;
}

export function useWasmRunnerLogger() {
    const { logger } = useContext(WasmWorkerContext);

    return logger;
}

type LoaderConfiguration = {
    worker: WasmRunnerWorkerContract;
    logger: WasmRunnerLogger;
};

function useWasmLoader({ worker, logger }: LoaderConfiguration) {
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
                    proxy(setProgress),
                    proxy((x) => logger.Log(x)),
                    proxy((x) => logger.LogErr(x)),
                    proxy((x) => logger.LogRuntimeErr(x))
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
