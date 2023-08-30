import React, { useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import NewItemType from "../../models/NewItemType";
import { ProjectAction } from "./ProjectAction";

const ProjectActions = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: auto;
`;

type ProjectPanelProps = {
  onNewItem: (type: NewItemType) => void;
  onRenameItem: (type: NewItemType) => void;
  onRun: () => void;
};

export function ProjectBar({
  onNewItem,
  onRenameItem,
  onRun,
}: ProjectPanelProps) {
  const themeContext = useContext(ThemeContext);

  return (
    <>
      <ProjectActions>
        <ProjectAction
          actionTip="Run"
          iconUri={themeContext.icons.DebugStart}
          onAction={() => onRun()}
        />
        {/* <ProjectAction
          actionTip="Rename File"
          iconUri={themeContext.icons.RenameFile}
          onAction={() => onRenameItem(NewItemType.File)}
        /> */}
        <ProjectAction
          actionTip="New File"
          iconUri={themeContext.icons.NewFile}
          onAction={() => onNewItem(NewItemType.File)}
        />
      </ProjectActions>
    </>
  );
}
