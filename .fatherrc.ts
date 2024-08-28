import { defineConfig, IFatherConfig } from 'father';

let config: IFatherConfig = {
  esm: {
    input: 'src/_pluginsComponents',
    output: 'dist/esm',
    transformer: 'babel',
  },
};
export default defineConfig(config);
