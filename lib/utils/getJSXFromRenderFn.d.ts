import { VNodeData } from 'vue';
import { AnyComponent } from '../types/vue';
export declare type RenderFn = (h: CreateJSX) => any;
export declare const getJSXFromRenderFn: (render: RenderFn) => string;
export default getJSXFromRenderFn;
export interface CreateJSX {
    (tag?: Tag, children?: JSXStringChildren): string;
    (tag?: Tag, data?: VNodeData, children?: JSXStringChildren): string;
}
export declare type JSXStringChildren = string[];
export declare type Tag = string | AnyComponent | undefined;
