const yyt = require('../../index.js');
const extFs = require('yyl-fs');
const path = require('path');
const fs = require('fs');
const pkg = require('../../package.json');
const http = require('http');
const util = require('yyl-util');

const TEST_CTRL = {
  PATH: true,
  VERSION: true,
  HELP: true,
  INIT: true,
  START: true,
  DOCTOR: true,
  NIGHTWATCH: true,
  START_PATH: true
};
const FRAG_PATH = path.join(__dirname, './__frag');
const ROOT_PATH = path.join(__dirname, '../../');

const PXY_PORT = 1234;

const cache = {
  server: null
};
const fn = {
  server: {
    async start() {
      await fn.server.abort();
      cache.server = http.createServer();
      cache.server.on('request', (req, res) => {
        res.setHeader('Content-Type', 'text/html; charset=UTF-8');
        res.write('It is proxy page');
        res.end();
      });
      cache.server.listen(PXY_PORT);
      return cache.server;
    },
    abort() {
      if (cache.server) {
        cache.server.close();
      }
      return Promise.resolve(null);
    }
  }
};

jest.setTimeout(30000);

const toParseObj = (ctx) => {
  let arr = ['', 'yyt'];
  arr = arr.concat(ctx.split(' '));
  arr.push('--silent');
  return util.cmdParse(arr);
};

if (TEST_CTRL.PATH) {
  it('yyt -p', async () => {
    const r = await yyt.run(toParseObj('-p'));
    expect(r).toEqual(path.join(__dirname, '../../'));
  });
}

if (TEST_CTRL.VERSION) {
  it('yyt -v', async () => {
    const r = await yyt.run(toParseObj('-v'));
    expect(r).toEqual(pkg.version);
  });
  it('yyt --version', async () => {
    const r = await yyt.run(toParseObj('--version'));
    expect(r).toEqual(pkg.version);
  });
}

if (TEST_CTRL.HELP) {
  it('yyt -h', async () => {
    const r = await yyt.run(toParseObj('-h'));
    expect(typeof r).toEqual('object');
  });

  it('yyt --help', async () => {
    const r = await yyt.run(toParseObj('--help'));
    expect(typeof r).toEqual('object');
  });

  it('yyt abcdefg', async () => {
    const r = await yyt.run(toParseObj('abcdefg'));
    expect(typeof r).toEqual('object');
  });
}

if (TEST_CTRL.INIT) {
  it('yyt init', async () => {
    if (fs.existsSync(FRAG_PATH)) {
      await extFs.removeFiles(FRAG_PATH);
    } else {
      await extFs.mkdirSync(FRAG_PATH);
    }
    process.chdir(FRAG_PATH);
    const rData = await yyt.run(toParseObj('init'));
    const rFiles = await extFs.readFilePaths(FRAG_PATH);
    expect(rData.add.length + rData.update.length).toEqual(rFiles.length);

    // run test
    await yyt.run(toParseObj('--headless'));
    process.chdir(ROOT_PATH);
    await extFs.removeFiles(FRAG_PATH, true);
  });
}

if (TEST_CTRL.START_PATH) {
  it('yyt ./abcdefg', (done) => {
    yyt.run(toParseObj('./abcdefg')).then((r) => {
      expect(r).not.toEqual(undefined);
      done();
    }).catch((er) => {
      expect(er).not.toEqual(undefined);
      done();
    });
  });

  it('yyt path/to/project(absolute)', async () => {
    process.chdir(ROOT_PATH);

    const pjPath = path.join(__dirname, '../test-case/case-base');

    const r = await yyt.run(toParseObj(pjPath));
    expect(r).toEqual(undefined);
  });

  it('yyt path/to/project(relative)', async () => {
    process.chdir(ROOT_PATH);

    const r = await yyt.run(toParseObj('test/test-case/case-base'));
    expect(r).toEqual(undefined);
  });

  it('yyt path/to/config(absolute)', async () => {
    process.chdir(ROOT_PATH);

    const pjPath = path.join(__dirname, '../test-case/case-base/yyt.config.js');

    const r = await yyt.run(toParseObj(pjPath));
    expect(r).toEqual(undefined);
  });

  it('yyt path/to/config(relative)', async () => {
    process.chdir(ROOT_PATH);

    const r = await yyt.run(toParseObj('test/test-case/case-base/yyt.config.js'));
    expect(r).toEqual(undefined);
  });

  it('yyt path/to/test.js', async () => {
    const pjPath = path.join(__dirname, '../test-case/case-noconfig');
    process.chdir(pjPath);
    const r = await yyt.run(toParseObj('./test/test.js'));
    expect(r).toEqual(undefined);
  });
  it('yyt path/to/folder', async () => {
    const pjPath = path.join(__dirname, '../test-case/case-noconfig');
    process.chdir(pjPath);
    const r = await yyt.run(toParseObj('./test'));
    expect(r).toEqual(undefined);
  });
}
if (TEST_CTRL.DOCTOR) {
  it('yyt doctor', async () => {
    await yyt.run(toParseObj('doctor'));
  });
}

if (TEST_CTRL.NIGHTWATCH) {
  it('yyt nightwatch', async () => {
    const pjPath = path.join(__dirname, '../test-case/case-nightwatch');
    process.chdir(pjPath);

    const r = await yyt.run(toParseObj('nightwatch'));
    expect(r).toEqual(undefined);
  });
}

if (TEST_CTRL.START) {
  it('yyt', async () => {
    const pjPath = path.join(__dirname, '../test-case/case-base');
    process.chdir(pjPath);

    const r = await yyt.run(toParseObj(''));
    expect(r).toEqual(undefined);
  });

  it('yyt --path', async () => {
    process.chdir(ROOT_PATH);

    const pjPath = path.join(__dirname, '../test-case/case-base');

    const r = await yyt.run(toParseObj(`--path ${pjPath}`));
    expect(r).toEqual(undefined);
  });

  it('yyt --mode dev', async () => {
    await fn.server.start();
    const pjPath = path.join(__dirname, '../test-case/case-base');
    process.chdir(pjPath);

    const r = await yyt.run(toParseObj('--mode dev'));
    expect(r).toEqual(undefined);

    const yytConfig = require(path.join(pjPath, 'yyt.config.js'));
    const reportPath = path.resolve(pjPath, yytConfig.dev.__extend.html_report_folder);
    expect(fs.existsSync(reportPath)).toEqual(true);

    const rFiles = await extFs.readFilePaths(reportPath);
    expect(rFiles.length).not.toEqual(0);

    await extFs.removeFiles(reportPath, true);
    await fn.server.abort();
  });
  it('yyt --headless', async () => {
    const pjPath = path.join(__dirname, '../test-case/case-base');
    process.chdir(pjPath);

    const r = await yyt.run(toParseObj('--headless'));
    expect(r).toEqual(undefined);
  });



  it('yyt __extend.userAgent check', async () => {
    const pjPath = path.join(__dirname, '../test-case/case-ua');
    process.chdir(pjPath);

    const r = await yyt.run(toParseObj('--headless'));
    expect(r).toEqual(undefined);
  });

  it('yyt --proxy', async () => {
    await fn.server.start();
    const pjPath = path.join(__dirname, '../test-case/case-base');
    process.chdir(pjPath);

    const r = await yyt.run(toParseObj('--proxy 1234'));
    expect(r).toEqual(undefined);

    await fn.server.abort();
  });
}


