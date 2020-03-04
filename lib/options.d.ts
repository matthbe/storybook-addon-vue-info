import { AnyComponent, ComponentRegistory } from './types/vue';
export declare const defaultOptions: InfoAddonOptions;
declare type Casing = undefined | 'camel' | 'camelCase' | 'kebab' | 'kebab-case' | 'pascal' | 'PascalCase';
export interface InfoAddonOptions {
    header: boolean;
    source: boolean;
    summary: string;
    previewClassName?: string;
    previewStyle?: ElementCSSInlineStyle;
    components: ComponentRegistory | false | null;
    wrapperComponent: AnyComponent;
    docsInPanel: boolean;
    useDocgen: boolean;
    casing: Casing | {
        props: Casing;
        component: Casing;
    };
}
export {};
