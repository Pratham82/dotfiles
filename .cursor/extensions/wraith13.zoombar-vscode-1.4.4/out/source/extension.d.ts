import * as vscode from 'vscode';
export declare module ZoomBar {
    interface InspectResult<T> {
        globalValue?: T;
        workspaceValue?: T;
    }
    export const setZoomLevel: (zoomLevel: number | InspectResult<number>, wait?: number) => Promise<void>;
    export const initialize: (context: vscode.ExtensionContext) => void;
    export const selectZoom: () => Promise<void>;
    export const resetZoom: () => Thenable<void>;
    export const zoomOut: () => Thenable<void>;
    export const zoomIn: () => Thenable<void>;
    export const updateStatusBar: () => void;
    export const levelToPercent: (value: number) => number;
    export const percentToLevel: (value: number) => number;
    export const roundZoom: (value: number) => number;
    export const percentToDisplayString: (value: number, locales?: string | string[] | undefined) => string;
    export {};
}
export declare const activate: (context: vscode.ExtensionContext) => void;
export declare const deactivate: () => void;
