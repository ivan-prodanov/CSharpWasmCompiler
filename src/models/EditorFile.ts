import { Uri } from 'monaco-editor';

interface EditorFile {
    name: string;
    id: string;
    content: string;
    uri: Uri;
}

export default EditorFile;
