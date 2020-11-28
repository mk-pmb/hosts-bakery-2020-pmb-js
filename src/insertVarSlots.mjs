// -*- coding: utf-8, tab-width: 2 -*-

function insertVarSlots(dict, lines) {
  if (!dict) { return lines; }
  const rx = /\&\$(\w+);/g;
  function ins(m, k) {
    const v = dict[k];
    return (v === undefined ? m : v);
  }
  return lines.map(ln => ln.replace(rx, ins));
}

export default insertVarSlots;
