import React, { useContext } from "react";
import styled, { ThemeContext } from "styled-components";

const ExecutionOutputPanelContainer = styled.div`
  user-select: text;
  height: 100%;
  cursor: text;
`;

export enum ExecutionOutputSeverity {
  Normal,
  Error,
  RuntimeError,
}

export type ExecutionOutputEntry = {
  message: string;
  severity: ExecutionOutputSeverity;
};

const ExecutionOutputContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: ${({ theme }) => theme.fonts.CodeFont};
`;

const OutputContainer = styled.div`
  padding-top: 1px;
  padding-bottom: 1px;
  font-size: 0.8em;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ErrorOutput = styled.div`
  color: ${({ theme }) => theme.colors.BuildErrorTextForeground};
`;

const RuntimeErrorOutput = styled.div`
  color: ${({ theme }) => theme.colors.ExecutionFatalErrorTextForeground};
`;

const NormalOutput = styled.div`
  color: ${({ theme }) => theme.colors.ExecutionNormalTextForeground};
`;

type ExecutionOutputProps = {
  outputEntries: ExecutionOutputEntry[];
};

export function ExecutionOutputPanel({ outputEntries }: ExecutionOutputProps) {
  const themeContext = useContext(ThemeContext);

  return (
    <>
      <ExecutionOutputPanelContainer>
        {outputEntries.map((d, i) => (
          <ExecutionOutputContainer key={i}>
            {d.severity === ExecutionOutputSeverity.Error && (
              <OutputContainer>
                <ErrorOutput>{d.message}</ErrorOutput>
              </OutputContainer>
            )}

            {d.severity === ExecutionOutputSeverity.RuntimeError && (
              <OutputContainer>
                <RuntimeErrorOutput>{d.message}</RuntimeErrorOutput>
              </OutputContainer>
            )}

            {d.severity === ExecutionOutputSeverity.Normal && (
              <OutputContainer>
                <NormalOutput>{d.message}</NormalOutput>
              </OutputContainer>
            )}
          </ExecutionOutputContainer>
        ))}
      </ExecutionOutputPanelContainer>
    </>
  );
}
