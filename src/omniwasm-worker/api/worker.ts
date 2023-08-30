import { boot, BootJsonData } from '@0x33.io/wasm-sdk';
import { CompilerWorkspace, CompilerWorkspaceWorkerProxy } from 'omniwasm';
import { OmniWasmWorkerContract } from './contract';

export class OmniWasmWorker extends CompilerWorkspaceWorkerProxy implements OmniWasmWorkerContract {
    load(
        loadParams: {
            baseUri: string;
            wasmRuntimeDirectory: string;
        },
        progressCallback: (value: number) => void
    ): Promise<BootJsonData> {
        return new Promise((resolve, reject) =>
            boot({
                pathResolver: (path: string) => {
                    return `${loadParams.wasmRuntimeDirectory}\\${path}`;
                },
                loadingProgress: async (current: number, total: number) =>
                    await progressCallback(Math.floor((current * 100) / total)),
                packages: ['omniwasm'],
            })
                .then((bootConfiguration) => {
                    this.controller = new CompilerWorkspace({
                        baseUri: loadParams.baseUri,
                    });

                    resolve(bootConfiguration);
                })
                .catch((x: Error) => {
                    reject(x);
                })
        );
    }
}
