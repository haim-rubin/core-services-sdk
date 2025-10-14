export function getLogger(
  option: true | any | undefined,
): import('pino').Logger | typeof dummyLogger
declare namespace dummyLogger {
  function info(): void
  function warn(): void
  function trace(): void
  function debug(): void
  function error(): void
  function fatal(): void
  function levels(): void
  function silent(): void
  function child(): {
    info: () => void
    warn: () => void
    trace: () => void
    debug: () => void
    error: () => void
    fatal: () => void
    levels: () => void
    silent: () => void
    child(): /*elided*/ any
  }
}
export {}
