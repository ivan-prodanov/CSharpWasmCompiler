import React, { useContext, useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import App from "./App";
import {
  CenteredWrapper,
  Container,
  LoadingBar,
  LoadingContainer,
  SpinnerSquare,
  Square,
  StartupState,
  StartupStep,
} from "./components/Container";
import { BottomLeftOverlay, CenteredOverlay } from "./components/Overlay";
// import registerServiceProviders from "./service-providers";
import {
  WasmWorkerContext as OmniwasmWorkerContext,
  useOmniWasm,
} from "./omniwasm-worker/hooks";
import * as Themes from "./themes";
import { ThemeContext } from "./themes/ThemeContext";
import {
  WasmWorkerContext as WasmRunnerWorkerContext,
  useWasmRunner,
} from "./wasm-runner-worker/hooks";

function Root() {
  const omniwasm = useOmniWasm();
  const wasmrunner = useWasmRunner();
  const themeContext = useContext(ThemeContext);
  const { boot } = omniwasm;
  const { boot: wasmRunnerBoot } = wasmrunner;
  const [startupState, setStartupState] = useState<StartupState>({
    step: StartupStep.Downloading,
    progress: 0,
  });

  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  useEffect(() => {
    if (boot.bootCompleted) {
      setStartupState({ step: StartupStep.CreatingWorkspace, progress: 1 });
    } else {
      setStartupState({
        step: StartupStep.Downloading,
        progress: boot.progress,
      });
    }
  }, [boot, setStartupState]);

  useEffect(() => {
    if (startupState.step == StartupStep.Downloading) {
      setLoadingProgress(startupState.progress * 0.5);
    } else if (startupState.step == StartupStep.CreatingWorkspace) {
      setLoadingProgress(50 + 13);
    } else if (startupState.step == StartupStep.InitializingEditor) {
      setLoadingProgress(50 + 13 + 13);
    } else if (startupState.step == StartupStep.GatheringDiagnostics) {
      setLoadingProgress(50 + 13 + 13 + 13);
    } else {
      setLoadingProgress(100);
    }
  }, [startupState, setLoadingProgress]);

  if (boot.bootFailed || wasmRunnerBoot.bootFailed) {
    return (
      <Container>
        <CenteredOverlay>Error</CenteredOverlay>
      </Container>
    );
  }

  const bootCompleted = boot.bootCompleted && wasmRunnerBoot.bootCompleted;

  return (
    <ThemeProvider theme={Themes.DarkTheme}>
      <Container>
        <LoadingContainer>
          <LoadingBar progress={loadingProgress}></LoadingBar>
          <CenteredWrapper>
            <SpinnerSquare>
              <Square delay="0ms" />
              <Square delay="200ms" />
              <Square delay="400ms" />
            </SpinnerSquare>
          </CenteredWrapper>
          <BottomLeftOverlay>
            {startupState.step === StartupStep.Downloading && (
              <>Downloading WASM ({startupState.progress}%)</>
            )}
            {startupState.step === StartupStep.CreatingWorkspace && (
              <>Creating Workspace</>
            )}
            {startupState.step === StartupStep.InitializingEditor && (
              <>Initiating Editor</>
            )}
            {startupState.step === StartupStep.GatheringDiagnostics && (
              <>Gathering Diagnostics</>
            )}
          </BottomLeftOverlay>
        </LoadingContainer>
        {bootCompleted && boot.bootData && wasmRunnerBoot.bootData && (
          <OmniwasmWorkerContext.Provider
            value={{ context: omniwasm.context, bootOptions: boot.bootData }}
          >
            <WasmRunnerWorkerContext.Provider
              value={{
                context: wasmrunner.context,
                bootOptions: wasmRunnerBoot.bootData,
                logger: wasmrunner.logger,
              }}
            >
              <App
                changeStartupStep={(x) => {
                  setStartupState({ step: x, progress: 100 });
                }}
              />
            </WasmRunnerWorkerContext.Provider>
          </OmniwasmWorkerContext.Provider>
        )}
      </Container>
    </ThemeProvider>
  );

  return (
    <ThemeProvider theme={Themes.DarkTheme}>
      <Container>
        <LoadingBar progress={boot.progress}></LoadingBar>
        <CenteredWrapper>
          <SpinnerSquare>
            <Square delay="0ms" />
            <Square delay="200ms" />
            <Square delay="400ms" />
          </SpinnerSquare>
        </CenteredWrapper>
        <BottomLeftOverlay>
          Initiating OmniWasm ({boot.progress}%)
        </BottomLeftOverlay>
      </Container>
    </ThemeProvider>
  );
}

export default Root;
