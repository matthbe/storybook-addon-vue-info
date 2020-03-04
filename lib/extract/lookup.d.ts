import { AnyComponent } from '../types/vue';
export interface LookupResult {
    name: string;
    component: AnyComponent;
}
export declare function lookupGlobalComponent(name: string): LookupResult | null;
