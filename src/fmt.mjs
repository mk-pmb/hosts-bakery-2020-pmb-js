// -*- coding: utf-8, tab-width: 2 -*-

import flatten from 'flatten';
import padEnd from 'lodash.padend';


const chapterSep = padEnd('', 3, '\n');
const fmt = {

  commentHashBehindIp(s) { return s.replace(/^([\d\.]+\s*)(#\s?)/, '$2$1'); },

  prependModeLine(l, ...s) {
    const m = ((l.meta || false).modeLine || '').trim();
    return [m, ...s, ...l];
  },

  addChapter(accum, add) {
    let a = flatten([].concat(add));
    a = a.map(fmt.commentHashBehindIp);
    return accum.concat(a, chapterSep);
  },

};


function align(t, s) {
  const p = (s.length % t.length);
  return (p ? s + t.slice(p) : s);
}


function tabulate(ind, row) {
  return row.map(c => align(ind, c)).join(ind).trimRight();
}


function renderHostNames(opt, origNames) {
  const names = origNames;

  function addNamesIfHomonymousOpt(f) {
    const a = opt[f.name];
    if (a === undefined) { return; }
    [].concat(f(a)).forEach(function maybeAdd(x) {
      if (!x) { return; }
      if (names.includes(x)) { return; }
      names.push(x);
    });
  }

  addNames(function category(a) {
    if (!a) { return; }
    return origNames.map(h => `${h}.${a}.infra.hdtw`);
  });

  const [firstName] = origNames;
  if (!firstName.includes('.')) {
    addNamesIfHomonymousOpt(function firstHostNoDotSuffixes(a) {
      return a.map(suf => firstName + suf);
    });
  }

  addNamesIfHomonymousOpt(function addSuffixes(a) {
    return a.map(suf => firstName + suf);
  });

  return names.filter(Boolean);
}

function hdtwBlock(inputLines, initCarry) {
  const result = [];
  function addLn(ln) { result.push(ln.trimRight()); }
  const carry = { ...initCarry };
  let skipBlankLines = false;
  inputLines.forEach(function parse(origLn) {
    // const where = bfn + ' line ' + (inputLnIdx + 1);
    if (origLn.startsWith('{')) {
      Object.assign(carry, JSON.parse(origLn));
      skipBlankLines = true;
      return;
    }
    if (skipBlankLines) {
      if (!origLn) { return; }
      skipBlankLines = false;
    }
    let [lnData, cmtSep, ...comment] = origLn.split(/(\s*#)/);
    cmtSep = (cmtSep || '').trim();
    comment = comment.join('');
    if (!lnData) { return addLn(origLn); }
    lnData = lnData.trim().split(/\s+/);
    let [ip, ...hostNames] = lnData;
    if (ip === '=') {
      ip = carry.previousFullIp;
    } else {
      ip = (carry.ipPrefix || '') + ip;
      carry.previousFullIp = ip;
    }
    if (!hostNames.length) {
      ip = '# ' + ip;
      hostNames = [comment];
      comment = '';
    } else {
      hostNames = renderHostNames(carry, hostNames);
      if (carry.omitHostnameComments) { comment = ''; }
    }
    addLn(tabulate('    ', [padEnd(ip, 15), ...hostNames]));
    if (comment) { addLn(padEnd(cmtSep, 20) + '  ^- ' + comment.trimLeft()); }
  });
  return result;
}


Object.assign(fmt, {
  hdtwBlock,
});


export default fmt;
