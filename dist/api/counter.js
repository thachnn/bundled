export class Counter {
    constructor() {
        this._files = 0;
        this._directories = 0;
    }
    set files(num) {
        this._files = num;
    }
    get files() {
        return this._files;
    }
    set directories(num) {
        this._directories = num;
    }
    get directories() {
        return this._directories;
    }
    /**
     * @deprecated use `directories` instead
     */
    /* c8 ignore next 3 */
    get dirs() {
        return this._directories;
    }
}
