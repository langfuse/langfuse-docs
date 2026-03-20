type ScriptStrategy = 'server' | 'client' | 'idle' | 'worker';
type ScriptLocation = 'head' | 'body';
type ScriptAction = 'append' | 'prepend';
export type SrcVal = {
    url: string;
    slugParam?: string;
    params?: Array<string>;
};
export type AttributeVal = string | null | SrcVal | boolean | undefined;
export type HtmlAttributes = {
    src?: SrcVal;
    [key: string]: AttributeVal;
};
export interface Data {
    id: string;
    description: string;
    website?: string;
    html?: {
        element: string;
        attributes: HtmlAttributes;
    };
    stylesheets?: Array<string>;
    scripts?: Array<{
        url: string;
        params?: Array<string>;
        strategy: ScriptStrategy;
        location: ScriptLocation;
        action: ScriptAction;
    }>;
}
export interface Inputs {
    [key: string]: any;
}
export {};
//# sourceMappingURL=index.d.ts.map