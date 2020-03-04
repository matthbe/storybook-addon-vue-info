import { AsyncComponent, Component } from 'vue';
export declare type AnyComponent = Component<any, any, any, any> | AsyncComponent<any, any, any, any>;
export interface ComponentRegistory {
    [name: string]: Component<any, any, any, any> | AsyncComponent<any, any, any, any>;
}
