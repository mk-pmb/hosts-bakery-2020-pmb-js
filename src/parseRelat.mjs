// -*- coding: utf-8, tab-width: 2 -*-

import absDir from 'absdir';

function absDirDotIf(a) { return a && absDir(a, '.'); }

function parseRelat(mustOpt) {
  const p = mustOpt('str', 'relatPre', '');
  const s = mustOpt('str', 'relatSuf', '.txt');
  const a = absDirDotIf(mustOpt('undef | nonEmpty str | obj', 'relatDir'));
  const f = mustOpt('fun', 'relatFix', String);

  function stripSuf(x) {
    let y = String(x || '');
    if (s && y.endsWith(s)) { y = y.slice(0, -s.length); }
    return y;
  }

  function relat(x) {
    let y = p + relat.stripSuf(x) + s;
    y = f(y);
    if (a) { y = a(y); }
    return y;
  }
  Object.assign(relat, { stripSuf });
  return relat;
}

export default parseRelat;
