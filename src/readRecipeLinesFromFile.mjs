// -*- coding: utf-8, tab-width: 2 -*-

import mustBe from 'typechecks-pmb/must-be';
import promisedFs from 'nofs';
import stripBom from 'strip-bom';

import insertVarSlots from './insertVarSlots';
import resolveRecipePath from './resolveRecipePath';


function upgrade(cfg, lines) {
  const { meta } = lines;
  const up = insertVarSlots(cfg.varSlots, lines);
  up.meta = (meta || false);
  return up;
}


const rrlff = async function readRecipeLinesFromFile(cfg, path) {
  mustBe.nest('recipe filename', path);
  let reci = await promisedFs.readFile(path, 'UTF-8');
  reci = stripBom(reci);

  const modeLine = ((reci.match(/^# -\*-[ -~]+(?=\n)/) || false)[0] || '');
  if (modeLine) { reci = reci.slice(modeLine.length); }

  reci = reci.trim().split(/\n/);
  Object.assign(reci, { meta: { modeLine } });
  return upgrade(cfg, reci);
};

Object.assign(rrlff, {

  async orArray(cfg, spec) {
    if (spec === '') { return upgrade(cfg, []); }
    if (Array.isArray(spec)) { return upgrade(cfg, spec); }
    return rrlff(cfg, resolveRecipePath(cfg, spec));
  },

});

export default rrlff;
