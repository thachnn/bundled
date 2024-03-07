//declare module 'ajv-keywords' {
  import { Ajv } from './ajv';

  declare function keywords(ajv: Ajv, include?: string | string[]): Ajv;

  export = keywords;
//}
