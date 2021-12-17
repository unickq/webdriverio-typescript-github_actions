import * as fs from "fs";

export const config: WebdriverIO.Config = {
  hostname: "localhost",
  port: 4444,
  path: "/wd/hub",

  specs: ["./test/specs/**/*.ts"],

  exclude: [
    // 'path/to/excluded/files'
  ],

  maxInstances: 10,

  capabilities: [
    {
      maxInstances: 5,
      browserName: "chrome",
      acceptInsecureCerts: true,
    },
  ],

  // Level of logging verbosity: trace | debug | info | warn | error | silent
  logLevel: "error",
  //
  // Set specific log levels per logger
  // loggers:
  // - webdriver, webdriverio
  // - @wdio/browserstack-service, @wdio/devtools-service, @wdio/sauce-service
  // - @wdio/mocha-framework, @wdio/jasmine-framework
  // - @wdio/local-runner
  // - @wdio/sumologic-reporter
  // - @wdio/cli, @wdio/config, @wdio/utils
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  // logLevels: {
  //     webdriver: 'info',
  //     '@wdio/appium-service': 'info'
  // },
  //

  bail: 0,
  baseUrl: "https://the-internet.herokuapp.com/",
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  framework: "mocha",

  reporters: [
    "spec",
    [
      "junit",
      {
        outputDir: "junit-report",
        outputFileFormat: (options: any) => `wdio-${options.cid}.xml`,
        addFileAttribute: true,
      },
    ],
    [
      "allure",
      {
        outputDir: "allure-results",
        disableWebdriverScreenshotsReporting: false,
      },
    ],
  ],

  mochaOpts: {
    ui: "bdd",
    timeout: 60_000,
  },

  onPrepare() {
    ["allure-results", "allure-report", "junit-report"].forEach((dir) => {
      if (fs.existsSync(dir)) {
        fs.rmdirSync(dir, { recursive: true });
      }
    });
  },

  async afterTest(test: any, context: any, result: any) {
    if (!result.passed) {
      await browser.takeScreenshot();
    }
  },
};
