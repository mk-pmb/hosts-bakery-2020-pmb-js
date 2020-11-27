
<!--#echo json="package.json" key="name" underline="=" -->
hosts-bakery-2020-pmb
=====================
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Generate /etc/hosts lines from recipes, in the format used on PmB servers in
2020.
<!--/#echo -->



API
---

This module exports one function:

### bakeHosts(opts)

Returns a promise for an array of strings that you could use as lines of
your `/etc/hosts` file.

`opts` is an optional options object that supports these optional keys:

* `head`: An array of prebaked lines at the top.
  May also be a string, in which case lines are read form there.
  Default: [`'ex://head.txt'`](docs/examples/head.txt)
* `recipes`: Array of recipe names. Default: `[]` (empty array)
* `tail`: An array of prebaked lines at the bottom.
  May also be a string, in which case lines are read form there.
  Default: `['# eof']`
* `relat…`: Options for dealing with recipe names that don't include a
  slash (`/`).
  * `relatPre`: String to put in front. Default: `''` (empty string)
  * `relatSuf`: String to append. Default: `'.txt'`
  * `relatFix`: A function to fix the intermediate result from
    `…Pre` and `…Suf`.
    This might be a good place to plug a path resolver.






Usage
-----

:TODO:



<!--#toc stop="scan" -->



Known issues
------------

* Needs more/better tests and docs.




&nbsp;


License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
