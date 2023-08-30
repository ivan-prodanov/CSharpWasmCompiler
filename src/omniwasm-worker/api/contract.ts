import { BootJsonData } from '@0x33.io/wasm-sdk';
import { CompilerWorkspaceWorker } from 'omniwasm';

export interface OmniWasmWorkerContract extends CompilerWorkspaceWorker {
    // Make note that the return type needs to be wrapped in a promise.
    load(
        loadParams: {
            baseUri: string;
            wasmRuntimeDirectory: string;
        },
        progressCallback?: (value: number) => void
    ): Promise<BootJsonData>;
}
