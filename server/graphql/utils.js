export function signalError(msg) {
  return () => {
    throw new Error(msg)
  }
}

