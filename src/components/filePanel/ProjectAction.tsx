import React from "react";
import styled from "styled-components";

const Icon = styled.img`
  cursor: pointer;
  height: 18px;
  display: inline-flex;
  padding: 4px 4px 2px 0px;
  transition: transform 0.2s;
  background: transparent;
  border: none;
  &:active {
    transform: scale(1.2);
  }
`;

const Tooltip = styled.div`
  visibility: hidden;
  background-color: ${(props) => props.theme.colors.FilePanelBackground};
  color: ${(props) => props.theme.colors.FilePanelForeground};
  position: absolute;
  border: ${(props) => `1px solid ${props.theme.colors.FilePanelForeground}`};
  z-index: 100;
  padding: 3px 7px;
  font-size: 12px;
`;

const ProjectActionContainer = styled.div`
  padding: 0px 3px;
  & ${Icon}:hover + ${Tooltip} {
    transition-delay: 0.5s;
    visibility: visible;
  }
`;

type ProjectAcitonsProps = {
  iconUri: string;
  actionTip: string;
  onAction: () => void;
};

export function ProjectAction({
  iconUri,
  actionTip,
  onAction,
}: ProjectAcitonsProps) {
  return (
    <>
      <ProjectActionContainer>
        <Icon src={iconUri} onClick={() => onAction()} />
        <Tooltip>{actionTip}</Tooltip>
      </ProjectActionContainer>
    </>
  );
}
