// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

const extensionPaths = [
  'array',
  'codap',
  'csv',
  'encode',
  'dialog',
  'export-the',
  'fetch',
  'http-req',
  'import-a',
  'logging',
  'matrix',
  'mini-csv',
  'nlmap',
  'nt',
  'send-to',
  'sound',
  'store',
  'table',
];

// import array          from './array';
// import codap          from './codap';
// import csv            from './csv';
// import encode         from './encode';
// import dialog         from './dialog';
// import export_the     from './export-the';
// import fetch          from './fetch';
// import http_req       from './http-req';
// import import_a       from './import-a';
// import logging        from './logging';
// import matrix         from './matrix';
// import mini_csv       from './mini-csv';
// import nlmap          from './nlmap';
// import nt             from './nt';
// import send_to        from './send-to';
// import sound          from './sound';
// import store          from './store';
// import table          from './table';

// const modsStr = extensionPaths.map(name => name.replace('-', '_'));

export const initialize = (workspace, ...importedExtensions) => {
  const upperNames = importedExtensions.map((name) => name.toUpperCase());
  const extensions = {};
  extensionPaths.forEach((path) => {
    import(/* webpackMode: "eager" */ `./${path}`).then((extensionModule) => {
      const extension = extensionModule.init(workspace);
      const upperName = extension.name.toUpperCase();
      if (upperNames.includes(upperName)) extensions[upperName] = extension;
    });
  });
  return extensions;
};

export const porters = (...importedExtensions) => {
  const upperNames = importedExtensions.map((name) => name.toUpperCase());
  const porters = [];
  extensionPaths.forEach((path) => {
    import(/* webpackMode: "eager" */ `./${path}`).then((extensionModule) => {
      if (
        extensionModule.porter !== null &&
        extensionModule.porter !== undefined
      ) {
        const upperName = extensionModule.porter.extensionName.toUpperCase();
        if (upperNames.includes(upperName)) {
          porters.push(extensionModule.porter);
        }
      }
    });
  });
  return porters;
};
