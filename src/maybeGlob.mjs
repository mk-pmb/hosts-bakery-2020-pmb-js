// -*- coding: utf-8, tab-width: 2 -*-

import promisedFs from 'nofs';
import flatten from 'flatten';


async function maybeGlob(doit, patterns) {
  if (!doit) { return patterns; }
  const unmatched = [];

  async function globOrMeh(patt) {
    const found = await promisedFs.glob(patt);
    if (found.length) { return found; }
    unmatched.push(patt);
  }

  const matches = flatten(await Promise.all(patterns.map(globOrMeh)));
  if (unmatched.length) {
    const msg = ('No glob matches for these pattern(s): '
      + flatten(unmatched).join(', '));
    throw new Error(msg);
  }

  return matches;
}


export default maybeGlob;
