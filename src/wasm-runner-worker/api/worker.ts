import { boot, BootJsonData } from '@0x33.io/wasm-sdk';
import { WasmRunner, WasmRunnerWorkerProxy } from '@0x33.io/wasmrunner';
import { WasmRunnerWorkerContract } from './contract';

export class WasmRunnerWorker extends WasmRunnerWorkerProxy implements WasmRunnerWorkerContract {
    load(
        loadParams: {
            baseUri: string;
            wasmRuntimeDirectory: string;
        },
        progressCallback: (value: number) => void,
        onConsoleLog?: (text: string) => void,
        onConsoleErr?: (text: string) => void,
        onRuntimeErr?: (text: string) => void
    ): Promise<BootJsonData> {
        return new Promise((resolve, reject) =>
            boot({
                pathResolver: (path: string) => {
                    return `${loadParams.wasmRuntimeDirectory}\\${path}`;
                },
                loadingProgress: async (current: number, total: number) =>
                    await progressCallback(Math.floor((current * 100) / total)),
                packages: ['wasmrunner'],
                onConsoleLog: onConsoleLog,
                onConsoleErr: onConsoleErr,
                onRuntimeErr: onRuntimeErr,
            })
                .then((bootConfiguration) => {
                    this.controller = new WasmRunner({
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
