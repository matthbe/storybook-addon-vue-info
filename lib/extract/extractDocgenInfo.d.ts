import { ComponentInfo } from '../types/info';
import { AnyComponent } from '../types/vue';
declare type Extracted = Pick<ComponentInfo, Exclude<keyof ComponentInfo, 'name'>>;
export declare function extractDocgenInfo(component: AnyComponent): Extracted;
export {};
