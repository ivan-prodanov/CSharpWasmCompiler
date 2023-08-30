import styled, { css } from "styled-components";

interface OverlayProps {
  zIndex?: number;
}

export const Overlay = styled.div<OverlayProps>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  z-index: ${(props) => props.zIndex || 0};
  overflow: hidden;

  ${css`
    .margin-view-overlays {
      user-select: none;
    }
  `}
`;

export const BottomLeftOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
`;

export const CenteredOverlay = styled(Overlay)`
  justify-content: center;
  align-items: center;
`;
