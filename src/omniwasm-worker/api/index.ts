import { CompilerWorkspaceWorkerProxy } from 'omniwasm';
import { expose } from 'comlink';
import { OmniWasmWorker } from './worker';

const { proxy, _instance } = CompilerWorkspaceWorkerProxy.CreateProxy(OmniWasmWorker);

console.log('worker instance', _instance);
// need to bind additional methods here
(proxy as any).load = _instance.load.bind(_instance);

expose(proxy);
