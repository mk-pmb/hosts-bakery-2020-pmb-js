// -*- coding: utf-8, tab-width: 2 -*-

import mustBe from 'typechecks-pmb/must-be';
import objPop from 'objpop';

import parseRelat from './parseRelat';
import resolveRecipePath from './resolveRecipePath';
import readReci from './readRecipeLinesFromFile';
import maybeGlob from './maybeGlob';
import fmt from './fmt';




async function genHostFileLines(opt) {
  const mustOpt = objPop(opt, { mustBe }).mustBe;
  const cfg = {
    relat: parseRelat(mustOpt),
    glob: mustOpt('bool', 'glob', true),
    varSlots: mustOpt('undef | obj', 'varSlots'),
  };

  const headReci = await readReci.orArray(cfg,
    mustOpt('ary | str', 'head', 'ex://head'));
  const tailReci = await readReci.orArray(cfg,
    (mustOpt('ary | str | undef', 'tail') || ['# eof']));
  const recipeNameSpecs = mustOpt('ary', 'recipes', []);
  const joinLines = mustOpt('str | undef', 'joinLines');
  mustOpt.done('Unsupported config option');

  const recipeFilePaths = await maybeGlob(cfg.glob,
    recipeNameSpecs.map(rn => resolveRecipePath(cfg, rn)));

  async function blockifyRecipe(rName) {
    const rLines = await readReci(cfg, rName);
    const rBlock = fmt.hdtwBlock(rLines);
    return rBlock;
  }
  const recipeBlocks = await Promise.all(recipeFilePaths.map(blockifyRecipe));
  let hostsLines = [
    fmt.prependModeLine(headReci, ''),
    ...recipeBlocks,
  ].reduce(fmt.addChapter, []).concat(tailReci);
  if (joinLines !== undefined) { hostsLines = hostsLines.join(joinLines); }
  return hostsLines;
}


export default genHostFileLines;
