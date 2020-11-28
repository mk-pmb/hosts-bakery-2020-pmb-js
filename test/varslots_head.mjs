// -*- coding: utf-8, tab-width: 2 -*-

import 'p-fatal';

import bakeHosts from '..';

bakeHosts({
  varSlots: {
    shortHost: '{{ ansible_hostname | default(inventory_hostname_short) }}',
  },
  joinLines: '\n',
}).then(console.log);
