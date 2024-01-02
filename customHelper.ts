// inspired by https://github.com/google/data-layer-helper/

export class DataLayerHelper {
  private dataLayer_: any[];
  private listener_: Function;
  private listenToPast_: boolean;
  private pastHasBeenProcessed_: boolean;
  private queue_: any[];

  constructor(dataLayer: any[], listener: Function, listenToPast = true) {
    this.dataLayer_ = dataLayer;
    this.listener_ = listener;
    this.listenToPast_ = listenToPast;
    this.pastHasBeenProcessed_ = false;
    this.queue_ = [];

    // Add listener for future state changes.
    const oldPush = this.dataLayer_.push;
    const that = this;
    this.dataLayer_.push = function () {
      const states = [].slice.call(arguments, 0);
      const result = oldPush.apply(that.dataLayer_, states);
      that.processStates_(states);
      return result;
    };

    this.processPast();
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
  processPast() {
    if (this.pastHasBeenProcessed_) {
      console.log(
        "ProcessPast has already been run. This method should only run a single time to prepare the helper."
      );
      return;
    }

    // Mark helper as having been processed.
    this.pastHasBeenProcessed_ = true;

    if (!this.listenToPast_) return;

    this.dataLayer_.forEach((item) => this.processStates_([item]));
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
  processStates_(states: any[]) {
    if (!this.pastHasBeenProcessed_) {
      return;
    }

    this.queue_.push.apply(this.queue_, states);

    while (this.queue_.length > 0) {
      const update = this.queue_.shift();
      this.listener_(update);
    }
  }
}
