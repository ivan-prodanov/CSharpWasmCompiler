import { BootJsonData } from '@0x33.io/wasm-sdk';
import { WasmRunnerWorker } from 'wasmrunner';

export interface WasmRunnerWorkerContract extends WasmRunnerWorker {
    // Make note that the return type needs to be wrapped in a promise.
    load(
        loadParams: {
            baseUri: string;
            wasmRuntimeDirectory: string;
        },
        progressCallback?: (value: number) => void,
        onConsoleLog?: (text: string) => void,
        onConsoleErr?: (text: string) => void,
        onRuntimeErr?: (text: string) => void
    ): Promise<BootJsonData>;
}
