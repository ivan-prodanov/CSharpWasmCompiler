import React from "react";
import styled from "styled-components";

export enum BuildInformationTabType {
  Problems,
  Output,
  Terminal,
}

export type BuildInformationTabProps = {
  tabType: BuildInformationTabType;
  active: boolean;
  notificationsCount?: number;
  onChangeActiveTab: (type: BuildInformationTabType) => void;
};

interface BuildInformationTabContainerProps {
  active: boolean;
}

const BuildInformationTabTextBox = styled.div<BuildInformationTabContainerProps>`
  display: flex;
`;

const BuildInformationTabWrapper = styled.div<BuildInformationTabContainerProps>`
  background: ${({ theme }) => theme.colors.FileEditorBackground};
  color: ${({ theme, active }) =>
    active
      ? theme.colors.TabPanelActiveFile
      : theme.colors.TabPanelInactiveFile};
  border-bottom: ${({ theme, active }) =>
    `1px solid ${
      active
        ? theme.colors.BuildInfornationPanelTabBottomBorderColor
        : "transparent"
    }`};
  display: flex;
  align-items: center;
  padding-bottom: 0.4em;
  padding-left: 0.1em;
  padding-right: 0.2em;

  &:last-of-type {
    margin-right: 0;
  }
`;

const BuildInformationTabContainer = styled.div`
  cursor: pointer;
  padding-top: 0.5em;
  padding-right: 2em;
  padding-bottom: 1em;
  padding-left: 2em;
  flex-shrink: 0;
  height: 1em;
  font-size: 0.7em;
  margin-right: 1px;
  &:last-of-type {
    margin-right: 0;
  }
  &:hover {
    & > ${BuildInformationTabWrapper} {
      color: ${({ theme }) => theme.colors.TabPanelActiveFile};
    }
  }
`;

const NotificationContainer = styled.div`
  background: ${({ theme }) =>
    theme.colors.BuildInfornationPanelTabNotificationBackgroundColor};
  color: ${({ theme }) =>
    theme.colors.BuildInfornationPanelTabNotificationForegroundColor};
  margin-left: 0.85em;
  padding-left: 0.55em;
  padding-right: 0.55em;
  border-radius: 100%;
`;

export function BuildInformationTab({
  tabType,
  active,
  onChangeActiveTab,
  notificationsCount = 0,
}: BuildInformationTabProps) {
  let text: string;
  if (tabType === BuildInformationTabType.Problems) {
    text = "PROBLEMS";
  } else if (tabType === BuildInformationTabType.Output) {
    text = "OUTPUT";
  } else if (tabType === BuildInformationTabType.Terminal) {
    text = "TERMINAL";
  } else {
    throw new Error(`Unrecognized tabType: ${tabType}`);
  }
  return (
    <>
      <BuildInformationTabContainer
        onMouseDown={(x) => onChangeActiveTab(tabType)}
      >
        <BuildInformationTabWrapper active={active}>
          <BuildInformationTabTextBox active={active}>
            {text}
          </BuildInformationTabTextBox>
          {notificationsCount > 0 && (
            <NotificationContainer>{notificationsCount}</NotificationContainer>
          )}
        </BuildInformationTabWrapper>
      </BuildInformationTabContainer>
    </>
  );
}
