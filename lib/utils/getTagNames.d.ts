import { VNodeChildren } from 'vue';
export declare const fromTemplate: (template: string) => string[];
declare type Render = (h: (tag: any, dataObject?: any, children?: VNodeChildren) => any, hack: any) => any;
export declare const fromJSX: (render: Render) => string[];
export {};
