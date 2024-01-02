// inspired by https://github.com/google/data-layer-helper/

export class DataLayerHelper {
  private dataLayer_: any[];
  private listener_: Function;
  private listenToPast_: boolean;
  private hasBeenProcessed_: boolean;
  private queue: any[];

  constructor(dataLayer: any[], listener: Function, listenToPast = true) {
    this.dataLayer_ = dataLayer;
    this.listener_ = listener;
    this.listenToPast_ = listenToPast;
    this.hasBeenProcessed_ = false;
    this.queue = [];

    // Add listener for future state changes.
    const oldPush = this.dataLayer_.push;
    const that = this;
    this.dataLayer_.push = function () {
      const states = [].slice.call(arguments, 0);
      const result = oldPush.apply(that.dataLayer_, states);
      that.processStates_(states);
      return result;
    };

    this.process();
  }

  /**
   * Processes the current dataLayer.
   * The helper will not respond to pushes to the dataLayer until
   * this method has been executed. This method will
   * always execute at construction time.
   *
   * Note: This method should only be called a single time to prepare
   * the helper.
   * @export
   */
  process() {
    if (this.hasBeenProcessed_) {
      console.log(
        "Process has already been run. This method should only run a single time to prepare the helper."
      );
      return;
    }

    // Mark helper as having been processed.
    this.hasBeenProcessed_ = true;
    this.dataLayer_.forEach((item) =>
      this.processStates_([item], !this.listenToPast_)
    );
  }

  /**
   * Calls the listener each time the states are updated.
   *
   * @param {!Array<*>} states The update objects to process, each
   *     representing a change to the state of the page.
   * @param {boolean=} skipListener If true, the existing states will not cause the listener
   *     to be executed. This is useful for processing past states that the
   *     listener might not care about.
   * @private
   */
  processStates_(states: any[], skipListener = false) {
    if (!this.hasBeenProcessed_) {
      return;
    }

    this.queue.push.apply(this.queue, states);

    while (this.queue.length > 0) {
      const update = this.queue.shift();

      if (!skipListener) {
        this.listener_(update);
      }
    }
  }
}

(window as { [key: string]: any })["DataLayerHelper"] = DataLayerHelper;
