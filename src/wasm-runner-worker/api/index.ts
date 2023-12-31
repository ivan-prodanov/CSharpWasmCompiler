import { WasmRunnerWorkerProxy } from '@0x33.io/wasmrunner';
import { expose } from 'comlink';
import { WasmRunnerWorker } from './worker';

const { proxy, _instance } = WasmRunnerWorkerProxy.CreateProxy(WasmRunnerWorker);

console.log('worker instance', _instance);
// need to bind additional methods here
(proxy as any).load = _instance.load.bind(_instance);

expose(proxy);
