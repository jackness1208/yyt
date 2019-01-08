const yyt = require('../index.js');
const extFs = require('yyl-fs');
const path = require('path');
const fs = require('fs');
const pkg = require('../package.json');
const http = require('http');

const TEST_CTRL = {
  // VERSION: true,
  // HELP: true,
  // INIT: true,
  START: true
};
const FRAG_PATH = path.join(__dirname, './__frag');
const ROOT_PATH = path.join(__dirname, '../');

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

if (TEST_CTRL.VERSION) {
  it('yyt -v', async () => {
    const r = await yyt.run('-v', { silent: true });
    expect(r).toEqual(pkg.version);
  });
  it('yyt --version', async () => {
    const r = await yyt.run('--version', { silent: true });
    expect(r).toEqual(pkg.version);
  });
}

if (TEST_CTRL.HELP) {
  it('yyt -h', async () => {
    const r = await yyt.run('-h', { silent: true });
    expect(typeof r).toEqual('object');
  });

  it('yyt --help', async () => {
    const r = await yyt.run('--help', { silent: true });
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
    const rData = await yyt.run('init', { silent: true });
    const rFiles = await extFs.readFilePaths(FRAG_PATH);
    expect(rData.add.length + rData.update.length).toEqual(rFiles.length);

    // run test
    await yyt.run('', { silent: true, headless: true });
    process.chdir(ROOT_PATH);
    await extFs.removeFiles(FRAG_PATH, true);
  });
}

if (TEST_CTRL.START) {
  it('yyt', async () => {
    const pjPath = path.join(__dirname, './test-case/case-base');
    process.chdir(pjPath);
    await yyt.run('', { silent: true });

    process.chdir(ROOT_PATH);
  });

  it('yyt path/to/project(absolute path)', async () => {
    process.chdir(ROOT_PATH);
    const pjPath = path.join(__dirname, './test-case/case-base');
    await yyt.run(pjPath, { silent: true });
  });

  it('yyt path/to/project(relative path)', async () => {
    process.chdir(ROOT_PATH);
    await yyt.run('test/test-case/case-base', { silent: true });
  });

  it('yyt --path', async () => {
    process.chdir(ROOT_PATH);
    const pjPath = path.join(__dirname, './test-case/case-base');
    await yyt.run(pjPath, { silent: true, path: pjPath });
  });

  it('yyt --env chrome', async () => {
    process.chdir(ROOT_PATH);
    const pjPath = path.join(__dirname, './test-case/case-base');
    process.chdir(pjPath);
    await yyt.run(pjPath, { silent: true, env: 'chrome' });
    process.chdir(ROOT_PATH);
  });
  it('yyt --mode dev', async () => {
    process.chdir(ROOT_PATH);
    await fn.server.start();
    const pjPath = path.join(__dirname, './test-case/case-base');
    process.chdir(pjPath);
    await yyt.run(pjPath, { silent: true, mode: 'dev' });

    const yytConfig = require(path.join(pjPath, 'yyt.config.js'));
    const reportPath = path.resolve(pjPath, yytConfig.dev.__extend.html_report_folder);
    expect(fs.existsSync(reportPath)).toEqual(true);

    const rFiles = await extFs.readFilePaths(reportPath);
    expect(rFiles.length).not.toEqual(0);

    await extFs.removeFiles(reportPath, true);
    process.chdir(ROOT_PATH);
    await fn.server.abort();
  });
  it('yyt --headless', async () => {
    process.chdir(ROOT_PATH);
    const pjPath = path.join(__dirname, './test-case/case-base');
    process.chdir(pjPath);
    await yyt.run('', { silent: true, headless: true });
    process.chdir(ROOT_PATH);
  });

  it('yyt --proxy', async () => {
    process.chdir(ROOT_PATH);
    await fn.server.start();
    const pjPath = path.join(__dirname, './test-case/case-base');
    process.chdir(pjPath);
    await yyt.run(pjPath, { silent: true, proxy: 1234 });
    process.chdir(ROOT_PATH);
    await fn.server.abort();
  });
}


