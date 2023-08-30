import styled, { keyframes } from "styled-components";

const squareAnim = keyframes`
    0%, 20%, 80%, 100% {
        height: 80px;
        background-color: rgb(30, 30, 30);
    }
    40% {
        height: 120px;
        background-color: rgb(212, 212, 212);
    }
`;

export const SpinnerSquare = styled.div`
  display: flex;
  flex-direction: row;
  width: 90px;
  height: 120px;
`;

interface SquareProps {
  delay: string;
}

export const Square = styled.div<SquareProps>`
  width: 17px;
  height: 80px;
  margin: auto auto;
  border-radius: 4px;
  animation: ${squareAnim} 1200ms cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite;
  animation-delay: ${(props) => props.delay};
`;

export const CenteredWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Container = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  background-color: #1e1e1e;
  color: rgb(212, 212, 212);
  overflow: hidden;
`;

export const LoadingContainer = styled(Container)`
  position: absolute;
`;

interface LoadingBarProps {
  progress: number;
}

export const LoadingBar = styled.div<LoadingBarProps>`
  position: absolute;
  left: 0;
  top: 0px;
  width: ${(props) => `${props.progress}%`};
  height: 3px;
  background: rgb(212, 212, 212);
`;

export enum StartupStep {
  Downloading,
  CreatingWorkspace,
  InitializingEditor,
  GatheringDiagnostics,
  Finished,
}

export interface StartupState {
  step: StartupStep;
  progress: number;
}
