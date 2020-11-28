// -*- coding: utf-8, tab-width: 2 -*-

import 'p-fatal';

import bakeHosts from '..';

bakeHosts({
  recipes: [
    'ex://[0-9]*',
  ],
  joinLines: '\n',
}).then(console.log);
