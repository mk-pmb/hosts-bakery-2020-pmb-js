// -*- coding: utf-8, tab-width: 2 -*-

import 'p-fatal';
import angoo from 'ansible-goodies-201129-pmb';

import bakeHosts from '..';

bakeHosts({
  varSlots: {
    ...angoo.net.hostNames,
  },
  joinLines: '\n',
}).then(console.log);
