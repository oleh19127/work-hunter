import * as tap from 'tap';
export declare type Test = typeof tap['Test']['prototype'];
declare function config(): Promise<{}>;
declare function build(t: Test): Promise<any>;
export { config, build };
