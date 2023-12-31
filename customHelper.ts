// inspired by https://github.com/google/data-layer-helper/

type DataLayerOptions = {
  listener: Function;
  listenToPast: boolean | undefined;
};

export class DataLayerHelper {
  private dataLayer_: any[];
  private listener_: Function;
  private listenToPast_: boolean | undefined;
  private processed_: boolean;
  private executingListener_: boolean;
  private unprocessed_: any[];

  constructor(dataLayer: any[], options: DataLayerOptions) {
    options = {
      listener: options["listener"] || (() => {}),
      listenToPast: options["listenToPast"] || false,
    };

    /**
     * The dataLayer to help with.
     * @private @const {!Array<*>}
     */
    this.dataLayer_ = dataLayer;

    /**
     * The listener to notify of changes to the dataLayer.
     * @private @const {function(!Object<string, *>, *)}
     */
    this.listener_ = options["listener"];

    /**
     * The internal marker for checking if the listener
     * should be called for previous state changes.
     */
    this.listenToPast_ = options["listenToPast"];

    /**
     * The internal marker for checking if the helper has been processed.
     * @private {boolean}
     */
    this.processed_ = false;

    /**
     * The internal marker for checking if the listener
     * is currently on the stack.
     * @private {boolean}
     */
    this.executingListener_ = false;

    /**
     * The internal queue of dataLayer updates that have not yet been processed
     * because another command is in the process of running.
     * @private @const {!Array<*>}
     */
    this.unprocessed_ = [];

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
    if (this.processed_) {
      console.log(
        "Process has already been run. This method should only run a single time to prepare the helper."
      );
      return;
    }

    // Mark helper as having been processed.
    this.processed_ = true;

    const startingLength = this.dataLayer_.length;

    for (let i = 0; i < startingLength; i++) {
      // Run the commands one at a time to maintain the correct
      // length of the queue on each command.
      this.processStates_([this.dataLayer_[i]], !this.listenToPast_);
    }
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
    if (!this.processed_) {
      return;
    }
    this.unprocessed_.push.apply(this.unprocessed_, states);

    // Checking executingListener here protects against multiple levels of
    // loops trying to process the same queue. This can happen if the listener
    // itself is causing new states to be pushed onto the dataLayer.
    if (this.executingListener_) {
      return;
    }

    while (this.unprocessed_.length > 0) {
      const update = this.unprocessed_.shift();

      if (!skipListener) {
        this.executingListener_ = true;
        this.listener_(update);
        this.executingListener_ = false;
      }
    }
  }
}

(window as { [key: string]: any })["DataLayerHelper"] = DataLayerHelper;
