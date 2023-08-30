import { DarkTheme as EditorDarkTheme, LightTheme as EditorLightTheme } from '@0x33.io/monaco';
import { editor } from 'monaco-editor';

interface IThemeColors {
    FilePanelBackground: string;
    FilePanelActiveFile: string;
    FilePanelFileHover: string;
    FilePanelActiveFileBackground: string;
    FilePanelActiveFileBorder: string;
    FilePanelForeground: string;
    FilePanelFilePlaceholderBackground: string;
    FilePanelFilePlaceholderBorderError: string;
    FilePanelFilePlaceholderErrorTooltipBackground: string;
    FileEditorBackground: string;
    TabPanelBackground: string;
    EditorSplitThumbBorder: string;
    TabPanelActiveFile: string;
    TabPanelInactiveFile: string;
    TabPanelActiveFileCloseButtonBackground: string;
    TabPanelInactiveFileCloseButtonBackground: string;
    EditorDiagnosticThumbBorder: string;
    TabPanelWorkspaceActionsIconHoverBackground: string;
    BuildInfornationPanelTabBottomBorderColor: string;
    BuildInfornationPanelTabNotificationBackgroundColor: string;
    BuildInfornationPanelTabNotificationForegroundColor: string;
    BuildWarningTextForeground: string;
    BuildErrorTextForeground: string;
    BuildNormalTextForeground: string;
    BuildSuccessTextForeground: string;
    ExecutionFatalErrorTextForeground: string;
    ExecutionNormalTextForeground: string;
}

interface IThemeIcons {
    NewFile: string;
    CSharpFile: string;
    RenameFile: string;
    Error: string;
    Warning: string;
    Close: string;
    Save: string;
    SplitVertical: string;
    SplitHorizontal: string;
    GitCompare: string;
    Ellipsis: string;
    DebugStart: string;
    DebugRestart: string;
    DebugStepBack: string;
    DebugStepInto: string;
    DebugStepOut: string;
    DebugStepOver: string;
    DebugStop: string;
}

interface IThemeFonts {
    CodeFont: string;
}

export interface ITheme {
    editorTheme: editor.IStandaloneThemeData;
    icons: IThemeIcons;
    colors: IThemeColors;
    fonts: IThemeFonts;
}

export const LightTheme: ITheme = {
    colors: {
        FilePanelBackground: '#F3F3F3',
        FilePanelActiveFile: '#FFF',
        FilePanelFileHover: '#E8E8E8',
        FilePanelActiveFileBackground: '#0060C0',
        FilePanelActiveFileBorder: '#0090F1',
        FilePanelForeground: '#222222',
        FilePanelFilePlaceholderBackground: '#3C3C3C',
        FilePanelFilePlaceholderBorderError: '#BE1100',
        FilePanelFilePlaceholderErrorTooltipBackground: '#F2DEDE',
        FileEditorBackground: '#FFFFFE',
        TabPanelBackground: '#ECECEC',
        EditorSplitThumbBorder: '#E7E7E7',
        TabPanelActiveFile: '#000',
        TabPanelInactiveFile: '#6A6A6A',
        TabPanelActiveFileCloseButtonBackground: '#E9E9E9',
        TabPanelInactiveFileCloseButtonBackground: '#D7D7D7',
        EditorDiagnosticThumbBorder: '#D3D3D3',
        TabPanelWorkspaceActionsIconHoverBackground: '#E1E1E1',
        BuildInfornationPanelTabBottomBorderColor: '#005FB8',
        BuildInfornationPanelTabNotificationBackgroundColor: '#0078d4',
        BuildInfornationPanelTabNotificationForegroundColor: '#FFF',
        BuildWarningTextForeground: '#FFFF00',
        BuildErrorTextForeground: '#FF0000',
        BuildNormalTextForeground: '#808080',
        BuildSuccessTextForeground: '#008000',
        ExecutionFatalErrorTextForeground: '#8B0000',
        ExecutionNormalTextForeground: '#CCCCCC',
    },
    icons: {
        NewFile: 'icons/light/new-file.svg',
        CSharpFile: 'icons/light/CS_16x.svg',
        RenameFile: 'icons/light/rename.svg',
        Error: 'icons/light/error.svg',
        Warning: 'icons/light/warning.svg',
        Close: 'icons/light/close.svg',
        Save: 'icons/light/save.svg',
        SplitVertical: 'icons/light/split-vertical.svg',
        SplitHorizontal: 'icons/light/split-horizontal.svg',
        GitCompare: 'icons/light/git-compare.svg',
        Ellipsis: 'icons/light/ellipsis.svg',
        DebugStart: 'icons/light/debug-start.svg',
        DebugRestart: 'icons/light/debug-restart.svg',
        DebugStepBack: 'icons/light/debug-step-back.svg',
        DebugStepInto: 'icons/light/debug-step-into.svg',
        DebugStepOut: 'icons/light/debug-step-out.svg',
        DebugStepOver: 'icons/light/debug-step-over.svg',
        DebugStop: 'icons/light/debug-stop.svg',
    },
    fonts: {
        CodeFont:
            'Consolas, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif',
    },
    editorTheme: EditorLightTheme,
};

export const DarkTheme: ITheme = {
    colors: {
        FilePanelBackground: '#252526',
        FilePanelActiveFile: '#FFF',
        FilePanelFileHover: '#2A2D2E',
        FilePanelActiveFileBackground: '#094771',
        FilePanelActiveFileBorder: '#007FD4',
        FilePanelForeground: EditorDarkTheme.colors['editor.foreground'],
        FilePanelFilePlaceholderBackground: '#3C3C3C',
        FilePanelFilePlaceholderBorderError: '#BE1100',
        FilePanelFilePlaceholderErrorTooltipBackground: '#5A1D1D',
        FileEditorBackground: '#1E1E1E',
        TabPanelBackground: '#2D2D2D',
        EditorSplitThumbBorder: '#444444',
        TabPanelActiveFile: '#FFF',
        TabPanelInactiveFile: '#969696',
        TabPanelActiveFileCloseButtonBackground: '#313232',
        TabPanelInactiveFileCloseButtonBackground: '#404242',
        EditorDiagnosticThumbBorder: '#414141',
        TabPanelWorkspaceActionsIconHoverBackground: '#363737',
        BuildInfornationPanelTabBottomBorderColor: '#0078D4',
        BuildInfornationPanelTabNotificationBackgroundColor: '#0078d4',
        BuildInfornationPanelTabNotificationForegroundColor: '#FFF',
        BuildWarningTextForeground: '#FFFF00',
        BuildErrorTextForeground: '#FF0000',
        BuildNormalTextForeground: '#808080',
        BuildSuccessTextForeground: '#008000',
        ExecutionFatalErrorTextForeground: '#8B0000',
        ExecutionNormalTextForeground: '#CCCCCC',
    },
    icons: {
        NewFile: 'icons/dark/new-file.svg',
        CSharpFile: 'icons/dark/CS_16x.svg',
        RenameFile: 'icons/dark/rename.svg',
        Error: 'icons/dark/error.svg',
        Warning: 'icons/dark/warning.svg',
        Close: 'icons/dark/close.svg',
        Save: 'icons/dark/save.svg',
        SplitVertical: 'icons/dark/split-vertical.svg',
        SplitHorizontal: 'icons/dark/split-horizontal.svg',
        GitCompare: 'icons/dark/git-compare.svg',
        Ellipsis: 'icons/dark/ellipsis.svg',
        DebugStart: 'icons/dark/debug-start.svg',
        DebugRestart: 'icons/dark/debug-restart.svg',
        DebugStepBack: 'icons/dark/debug-step-back.svg',
        DebugStepInto: 'icons/dark/debug-step-into.svg',
        DebugStepOut: 'icons/dark/debug-step-out.svg',
        DebugStepOver: 'icons/dark/debug-step-over.svg',
        DebugStop: 'icons/dark/debug-stop.svg',
    },
    fonts: {
        CodeFont:
            'Consolas, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif',
    },
    editorTheme: EditorDarkTheme,
};

export const AppThemes = {
    light: LightTheme,
    dark: DarkTheme,
};

export enum ThemeName {
    light = 'light',
    dark = 'dark',
}

declare module 'styled-components' {
    interface DefaultTheme extends ITheme {}
}
