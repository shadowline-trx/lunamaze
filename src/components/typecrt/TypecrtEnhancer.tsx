'use client';

import { useEffect } from 'react';
import { startTypecrt } from './runtime';

/**
 * Runs the TypeCrt landing runtime when Next renders the page itself (in
 * development, or after a client-side navigation). The exported page loads the
 * same runtime as a standalone module instead (scripts/static-islands.mjs).
 */
export default function TypecrtEnhancer() {
  useEffect(() => startTypecrt(), []);
  return null;
}
