// Let native build workers finish closing on Windows before Node exits.
// vinext's immediate process.exit(0) can race libuv's async-handle cleanup.
// Nonzero exits and thrown build failures retain their normal behavior.
if (process.platform === 'win32') {
  const exit = process.exit.bind(process);
  process.exit = (code = 0) => {
    if (Number(code) !== 0) return exit(code);
    process.exitCode = 0;
  };
}
process.argv = [process.argv[0], 'vinext', 'build', ...process.argv.slice(2)];
await import(new URL('cli.js', import.meta.resolve('vinext')).href);
