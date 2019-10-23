import stripExports from '../index';
import { rollup } from 'rollup';
import path from 'path';

const originalWarn = console.warn;
const mockWarn = jest.fn();

beforeAll(() => {
  console.warn = mockWarn;
});

afterAll(() => {
  console.warn = originalWarn;
});

test('sourceMap default', async () => {
  const bundle = await rollup({
    input: path.join(__dirname, '__specs__/default-named.js'),
    treeshake: false,
    plugins: [stripExports({})],
  });
  const { output } = await bundle.generate({ format: 'es', sourcemap: true });
  const { map } = output[0];
  expect(map).toBeTruthy();
});

test('sourceMap true', async () => {
  const bundle = await rollup({
    input: path.join(__dirname, '__specs__/default-named.js'),
    treeshake: false,
    plugins: [stripExports({ sourceMap: true })],
  });
  const { output } = await bundle.generate({ format: 'es', sourcemap: true });
  const { map } = output[0];
  expect(map).toMatchSnapshot();
});

test('sourceMap false', async () => {
  const bundle = await rollup({
    input: path.join(__dirname, '__specs__/default-named.js'),
    treeshake: false,
    plugins: [stripExports({ sourceMap: false })],
  });
  const { output } = await bundle.generate({ format: 'es', sourcemap: true });
  const { map } = output[0];
  expect(map).toBeTruthy();
  if (map) {
    const { mappings } = map;
    expect(mappings).toBe(';;;;;;;;');
  }
  expect(mockWarn).toHaveBeenCalledWith(
    "Sourcemap is likely to be incorrect: a plugin ('strip-exports') was used to transform files, but didn't generate a sourcemap for the transformation. Consult the plugin documentation for help"
  );
});
