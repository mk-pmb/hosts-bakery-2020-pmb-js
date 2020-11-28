#!/bin/bash
# -*- coding: utf-8, tab-width: 2 -*-


function all_tests () {
  export LANG{,UAGE}=en_US.UTF-8  # make error messages search engine-friendly
  local SELFPATH="$(readlink -m -- "$BASH_SOURCE"/..)"
  cd -- "$SELFPATH" || return $?

  local SXS=0 ERR=0 WANT=
  for WANT in *.want.txt; do
    cmp_one "$WANT"
  done

  case "$SXS:$ERR" in
    0:0 ) echo "-ERR Found no test files!"; return 4;;
    *:0 ) echo '+OK All tests passed.'; return 0;;
  esac
  echo "-ERR $ERR errors."
  return 3
}


function indented_head () { head -- "$1" | sed -re 's~^~    ~'; }


function cmp_one () {
  local WANT="$1"
  local BFN="${WANT%.want.txt}"
  >"$BFN".diff
  nodemjs "$BFN".mjs |& sed -rf normalize_output.sed >"$BFN".actual.txt
  if [ "${PIPESTATUS[*]}" != '0 0' ]; then
    (( ERR += 1 ))
    echo "! $BFN"
    indented_head "$BFN".actual.txt
    return 2
  fi
  diff -sU 2 -- "$BFN".{want,actual}.txt >"$BFN".diff
  local DIFF_RV="$?"
  if [ "$DIFF_RV" == 0 ]; then
    (( SXS += 1 ))
    echo ": $BFN ok"
    rm -- "$BFN"{.diff,.actual.txt}
  else
    (( ERR += 1 ))
    echo "! $BFN output differs:"
    indented_head "$BFN".diff
  fi
  return "$DIFF_RV"
}










all_tests "$@"; exit $?
