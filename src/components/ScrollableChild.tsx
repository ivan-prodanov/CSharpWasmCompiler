import styled from "styled-components";

export const ScrollableChild = styled.div`
  overflow: auto;

  ::-webkit-scrollbar {
    width: 14px;
  }

  ::-webkit-scrollbar-track {
    background-color: #1f1f1f;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(121, 121, 121, 0.4);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(100, 100, 100, 0.7);
  }
`;
