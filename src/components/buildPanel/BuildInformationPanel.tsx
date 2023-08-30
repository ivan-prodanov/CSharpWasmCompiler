import { EditorFile, MarkerData } from "@0x33.io/monaco";
import { keyBy } from "lodash";
import React, { useContext, useMemo, useState } from "react";
import styled, { ThemeContext } from "styled-components";
import { ScrollableChild } from "../ScrollableChild";
import {
  BuildInformationTab,
  BuildInformationTabType,
} from "./BuildInformationTab";
import { BuildOutputEntry, BuildOutputPanel } from "./BuildOutputPanel";
import { DiagnosticsPanel } from "./DiagnosticsPanel";
import {
  ExecutionOutputEntry,
  ExecutionOutputPanel,
} from "./ExecutionOutputPanel";

type BuildInformationPanelProps = {
  diagnostics: MarkerData[];
  buildOutput: BuildOutputEntry[];
  executionOutput: ExecutionOutputEntry[];
  files: EditorFile[];
  selectDiagnostic: (marker: MarkerData, inNewEditor: boolean) => void;
  activeTab: BuildInformationTabType;
  onChangeActiveTab: (type: BuildInformationTabType) => void;
};

const BuildInformationPanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  user-select: none;
  color: ${(props) => props.theme.colors.FilePanelForeground};
  background-color: ${(props) => props.theme.colors.FileEditorBackground};
`;

const Tabs = styled.div`
  display: flex;
`;

const TabsWrapper = styled.div`
  display: flex;
  padding-bottom: 0.1em;
`;

const BuildInformationPanelWrapper = styled(ScrollableChild)`
  flex-grow: 1;
  overflow-y: auto;
  padding-right: 2px;
`;

export function BuildInformationPanel({
  diagnostics,
  buildOutput,
  executionOutput,
  files,
  selectDiagnostic,
  activeTab,
  onChangeActiveTab,
}: BuildInformationPanelProps) {
  const [activeDiagnostic, setActiveDiagnostic] = useState<MarkerData | null>(
    null
  );
  const [activeFile, setActiveFile] = useState<string | null>(null);

  const themeContext = useContext(ThemeContext);

  const fileMap = useMemo<Record<string, EditorFile>>(() => {
    return keyBy(files, (d) => d.uri);
  }, [files]);

  return (
    <>
      <BuildInformationPanelContainer>
        <TabsWrapper>
          <Tabs>
            <BuildInformationTab
              tabType={BuildInformationTabType.Problems}
              active={activeTab == BuildInformationTabType.Problems}
              onChangeActiveTab={onChangeActiveTab}
              notificationsCount={diagnostics.length}
            />
            <BuildInformationTab
              tabType={BuildInformationTabType.Output}
              active={activeTab == BuildInformationTabType.Output}
              onChangeActiveTab={onChangeActiveTab}
            />
            <BuildInformationTab
              tabType={BuildInformationTabType.Terminal}
              active={activeTab == BuildInformationTabType.Terminal}
              onChangeActiveTab={onChangeActiveTab}
            />
          </Tabs>
        </TabsWrapper>
        {activeTab == BuildInformationTabType.Problems && (
          <BuildInformationPanelWrapper>
            <DiagnosticsPanel
              diagnostics={diagnostics}
              files={files}
              selectDiagnostic={selectDiagnostic}
            />
          </BuildInformationPanelWrapper>
        )}
        {activeTab == BuildInformationTabType.Output && (
          <BuildInformationPanelWrapper>
            <BuildOutputPanel
              outputEntries={buildOutput}
              selectDiagnostic={selectDiagnostic}
            />
          </BuildInformationPanelWrapper>
        )}
        {activeTab == BuildInformationTabType.Terminal && (
          <BuildInformationPanelWrapper>
            <ExecutionOutputPanel outputEntries={executionOutput} />
          </BuildInformationPanelWrapper>
        )}
      </BuildInformationPanelContainer>
    </>
  );
}
