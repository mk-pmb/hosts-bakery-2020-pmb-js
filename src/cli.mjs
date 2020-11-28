// -*- coding: utf-8, tab-width: 2 -*-

import 'p-fatal';
import 'usnam-pmb';

import minimist from 'minimist';
import mustBe from 'typechecks-pmb/must-be';

import bakeHosts from './bakeHosts';

const numArgsKey = '_';


function yesNoBool(arg, opt, df) {
  let val = mustBe.oneOf(['yes', 'no', undefined],
    'CLI option --' + opt + '=', arg[opt]);
  if (val === undefined) { val = df; }
  arg[opt] = (val === 'yes'); // eslint-disable-line no-param-reassign
  return arg;
}


(async function main() {
  const arg = minimist(process.argv.slice(2));
  const reciNames = arg[numArgsKey];
  delete arg[numArgsKey];
  if (reciNames) { arg.recipes = reciNames; }
  yesNoBool(arg, 'glob', true);
  const hostLines = await bakeHosts(arg);
  console.log(hostLines.join('\n'));
}());
