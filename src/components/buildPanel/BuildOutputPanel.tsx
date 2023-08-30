import { MarkerData } from "@0x33.io/monaco";
import { MarkerSeverity } from "monaco-editor";
import React, { useContext } from "react";
import styled, { ThemeContext } from "styled-components";

const BuildOutputPanelContainer = styled.div`
  user-select: text;
  height: 100%;
  cursor: text;
`;

export enum BuildOutputSeverity {
  Normal,
  Warning,
  Error,
  Success,
}

export type BuildOutputEntry = {
  message: string | null;
  diagnostic: MarkerData | null;
  severity: BuildOutputSeverity;
};

const BuildOutputContainer = styled.div`
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

const WarningOutput = styled.div`
  color: ${({ theme }) => theme.colors.BuildWarningTextForeground};
`;

const ErrorOutput = styled.div`
  color: ${({ theme }) => theme.colors.BuildErrorTextForeground};
`;

const SuccessOutput = styled.div`
  color: ${({ theme }) => theme.colors.BuildSuccessTextForeground};
`;

const NormalOutput = styled.div`
  color: ${({ theme }) => theme.colors.BuildNormalTextForeground};
`;

type BuildOutputProps = {
  outputEntries: BuildOutputEntry[];
  selectDiagnostic: (marker: MarkerData, inNewEditor: boolean) => void;
};

export function BuildOutputPanel({
  outputEntries,
  selectDiagnostic,
}: BuildOutputProps) {
  const themeContext = useContext(ThemeContext);

  const getDiagnosticMessage = (outputEntry: BuildOutputEntry) => {
    if (outputEntry.diagnostic) {
      const diagnostic = outputEntry.diagnostic;
      let diagnosticString: string = "";

      if (diagnostic.severity === MarkerSeverity.Error) {
        diagnosticString = `error`;
      } else if (diagnostic.severity === MarkerSeverity.Warning) {
        diagnosticString = `warning`;
      } else if (diagnostic.severity === MarkerSeverity.Info) {
        diagnosticString = `info`;
      } else if (diagnostic.severity === MarkerSeverity.Hint) {
        diagnosticString = `hint`;
      }

      return `${diagnostic.fileUri}(${diagnostic.startLineNumber},${diagnostic.startColumn},${diagnostic.endLineNumber},${diagnostic.endColumn}): ${diagnosticString} ${diagnostic.id}: ${diagnostic.message}`;
    } else {
      return outputEntry.message!;
    }
  };

  return (
    <>
      <BuildOutputPanelContainer>
        {outputEntries.map((d, i) => (
          <>
            <BuildOutputContainer
              key={i}
              onClick={(event) => {
                if (d.diagnostic) {
                  selectDiagnostic(
                    d.diagnostic,
                    event.ctrlKey || event.metaKey
                  );
                }
              }}
            >
              {d.severity === BuildOutputSeverity.Error && (
                <OutputContainer>
                  <ErrorOutput>{getDiagnosticMessage(d)}</ErrorOutput>
                </OutputContainer>
              )}

              {d.severity === BuildOutputSeverity.Warning && (
                <OutputContainer>
                  <WarningOutput>{getDiagnosticMessage(d)}</WarningOutput>
                </OutputContainer>
              )}

              {d.severity === BuildOutputSeverity.Normal && (
                <OutputContainer>
                  <NormalOutput>{getDiagnosticMessage(d)}</NormalOutput>
                </OutputContainer>
              )}

              {d.severity === BuildOutputSeverity.Success && (
                <OutputContainer>
                  <SuccessOutput>{getDiagnosticMessage(d)}</SuccessOutput>
                </OutputContainer>
              )}
            </BuildOutputContainer>
          </>
        ))}
      </BuildOutputPanelContainer>
    </>
  );
}
