import Vue, { ComponentOptions } from 'vue';
import { InfoAddonOptions } from '../options';
import { StoryInfo } from '../types/info';
export declare function extract(story: ComponentOptions<Vue>, kindName: string, storyName: string, options: InfoAddonOptions): StoryInfo;
