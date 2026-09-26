'use client';

import { useEffect } from 'react';
import { startStudio } from './runtime';

/**
 * Runs the studio runtime when Next renders the home page itself (in
 * development, or after a client-side navigation from another section). The
 * exported home page does not hydrate at all: it loads the same runtime as a
 * standalone module (see scripts/static-islands.mjs).
 */
export default function StudioEnhancer() {
  useEffect(() => startStudio(), []);
  return null;
}
