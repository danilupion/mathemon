import type { EnvironmentContext, JestEnvironmentConfig } from '@jest/environment';
import JSDOMEnvironment from 'jest-environment-jsdom';

// Temporal fix until dialogs get proper support in jsdom. See https://github.com/jsdom/jsdom/pull/3403
// When support is added, we could remove @jest/environment dependency
class JsdomEnvironmentWithDialog extends JSDOMEnvironment {
  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);
  }

  async setup() {
    await super.setup();

    this.global.HTMLDialogElement.prototype.show = function mock(this: HTMLDialogElement) {
      this.open = true;
    };

    this.global.HTMLDialogElement.prototype.showModal = function mock(this: HTMLDialogElement) {
      this.open = true;
    };

    this.global.HTMLDialogElement.prototype.close = function mock(this: HTMLDialogElement) {
      this.open = false;
    };
  }
}

export default JsdomEnvironmentWithDialog;
