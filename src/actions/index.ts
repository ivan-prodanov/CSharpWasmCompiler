import * as Monaco from 'monaco-editor';

export class EditorActions {
    static createSplitViewActionDescriptor(
        action: (editor: Monaco.editor.ICodeEditor, ...args: any[]) => void | Promise<void>
    ): Monaco.editor.IActionDescriptor {
        return {
            // An unique identifier of the contributed action.
            id: 'omni-wasm-split-editor-view',

            // A label of the action that will be presented to the user.
            label: 'Split View',

            // An optional array of keybindings for the action.
            keybindings: [Monaco.KeyMod.CtrlCmd | Monaco.KeyCode.US_BACKSLASH],

            // A precondition for this action.
            precondition: undefined,

            // A rule to evaluate on top of the precondition in order to dispatch the keybindings.
            keybindingContext: undefined,

            contextMenuGroupId: 'navigation',

            contextMenuOrder: 1.5,

            // Method that will be executed when the action is triggered.
            // @param editor The editor instance is passed in as a convinience
            run: function (ed, args) {
                action(ed, args);
            },
        };
    }
}
