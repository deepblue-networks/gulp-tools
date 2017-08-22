describe("environment suite", function() {
  const handler = require('../src/environment');

  it("hasFlag function", function() {
    expect(handler.hasFlag('--watch', ['--watch'])).toBe(true);
    expect(handler.hasFlag('-w', [])).toBe(false);
    expect(handler.hasFlag('-w', ['--watch', '-w'])).toBe(true);
  });

  it("init environment", function() {
    // init
    // ignore user process env
    process.env.ENVIRONMENT = 'unknow';
    handler.environment = handler.PRODUCTION;

    // set by flag but unknow
    handler.initEnvironment({env: 'banana'});
    expect(handler.environment).not.toBe('banana');
    expect(handler.environment).toBe(handler.PRODUCTION);

    // set by flag
    handler.initEnvironment({env: handler.DEVELOPMENT});
    expect(handler.environment).toBe(handler.DEVELOPMENT);

  });
});