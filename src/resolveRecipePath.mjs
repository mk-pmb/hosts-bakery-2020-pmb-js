// -*- coding: utf-8, tab-width: 2 -*-

import absDir from 'absdir';

const resolveExampleFile = absDir(import.meta, '../docs/examples');


function resolveRecipePath(cfg, spec) {
  if (spec.startsWith('ex://')) {
    return resolveExampleFile(spec.replace(/^ex:[\/\.]+/, '') + '.txt');
  }
  if (spec.includes('/')) { return spec; }
  return cfg.relat(spec);
}


export default resolveRecipePath;
