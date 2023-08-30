export type LogMethod = (message: string) => void;

export default class WasmRunnerLogger {
    LogLambda: LogMethod | null = null;
    LogErrLambda: LogMethod | null = null;
    LogRuntimeErrLambda: LogMethod | null = null;

    Log(message: string): void {
        if (this.LogLambda) {
            this.LogLambda(message);
        }
    }

    LogErr(message: string): void {
        if (this.LogErrLambda) {
            this.LogErrLambda(message);
        }
    }

    LogRuntimeErr(message: string): void {
        if (this.LogRuntimeErrLambda) {
            this.LogRuntimeErrLambda(message);
        }
    }
}
