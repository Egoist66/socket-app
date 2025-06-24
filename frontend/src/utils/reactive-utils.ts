import { delay } from "./delay";

type OperationType = 'set' | 'delete';

interface ChangeEvent<T = any> {
  operation: OperationType;
  path: (string | symbol)[];
  target: any;
  newValue?: T;
  oldValue?: T;
}

type RefCallback = (change: ChangeEvent) => void;


/**
 * Creates a reactive reference to a value, allowing for observation of changes
 * through a callback. The value can be any type, including objects, in which 
 * case a deep proxy is created to observe changes to its properties.
 *
 * @template T The type of the value being observed.
 * @param {T} value The initial value to be wrapped in a reactive reference.
 * @param {RefCallback} [callback] An optional callback function that is called
 *        whenever a change is made to the value or its properties. The callback
 *        receives a ChangeEvent object describing the change.
 * @returns {{ value: T }} An object containing the reactive reference to the value.
 */

export function ref<T>(value: T, callback?: RefCallback): { value: T } {
  const isObject = (val: unknown): val is object => 
    val !== null && typeof val === 'object';


  /**
   * Creates a deep proxy of an object that will notify the callback whenever any
   * property is changed, including nested properties. The callback will receive a
   * ChangeEvent object with the operation type, path to the changed property, and
   * the new and old values of the property.
   *
   * @template U The type of the object being proxied.
   * @param {U} target The object to proxy.
   * @param {(string | symbol)[]} [path] The current path to the property being proxied.
   * @returns {U} The proxied object.
   */
  const createProxy = <U extends object>(
    target: U, 
    path: (string | symbol)[] = []
  ): U => {
    return new Proxy(target, {
      get(target: U, key: string | symbol) {
        if (key === 'value') return target;
        
        const value = Reflect.get(target, key);
        if (isObject(value)) {
          return createProxy(value, [...path, key]);
        }
        return value;
      },

      set(
        target: U, 
        key: string | symbol, 
        newValue: any
      ): boolean {
        const oldValue = Reflect.get(target, key);
        const result = Reflect.set(target, key, newValue);
        
        if (result && callback) {
          callback({
            operation: 'set',
            path: [...path, key],
            target,
            newValue,
            oldValue
          });
        }
        return result;
      },

      deleteProperty(
        target: U, 
        key: string | symbol
      ): boolean {
        const oldValue = Reflect.get(target, key);
        const result = Reflect.deleteProperty(target, key);
        
        if (result && callback) {
          callback({
            operation: 'delete',
            path: [...path, key],
            target,
            oldValue
          });
        }
        return result;
      }
    });
  };

  const wrapper = {
    value: isObject(value) ? createProxy(value) : value
  };

  return new Proxy(wrapper, {
    get(target: typeof wrapper, key: string | symbol) {
      if (key === 'value') return target.value;
      return undefined;
    },

    set(
      target: typeof wrapper, 
      key: string | symbol, 
      newValue: T
    ): boolean {
      if (key === 'value') {
        const oldValue = target.value;
        target.value = isObject(newValue) ? createProxy(newValue) : newValue;
        
        if (callback) {
          callback({
            operation: 'set',
            path: [],
            target: wrapper,
            newValue: target.value,
            oldValue
          });
        }
        return true;
      }
      return false;
    }
  }) as { value: T };
}

/**
 * Creates a reactive property that encapsulates a value and allows subscription to changes.
 * The returned object provides access to the current value, a history of values, and a subscription
 * mechanism to notify subscribers whenever the value changes.
 *
 * @template T The type of the value being observed.
 * @param {T} value The initial value of the reactive property.
 * @returns {Object} An object with the properties:
 *   - `value`: The current value of the reactive property.
 *   - `subscribe`: A function to add subscribers that will be notified on value changes.
 */

export type ReactiveState<T> = {
  value: T;
  subscribe: (...subscribers: ((value: T) => void)[]) => void;
  history: () => Promise<T[]>;
};
/**
 * Creates a reactive property that encapsulates a value and allows subscription to changes.
 * The returned object provides access to the current value, a history of values, and a subscription
 * mechanism to notify subscribers whenever the value changes.
 *
 * @template T The type of the value being observed.
 * @param {T} value The initial value of the reactive property.
 * @returns {Object} An object with the properties:
 *   - `value`: The current value of the reactive property.
 *   - `subscribe`: A function to add subscribers that will be notified on value changes.
 *   - `history`: A function that returns a promise that resolves with an array of all values that the reactive
 *     property has taken on.
 */
export function reactive<T>(value: T): ReactiveState<T> {
  class Reactive {
    private _value: T;
    private _values: T[] = [];
    private subscribers: ((value: T) => void)[];

    /**
     * @param {T} value The initial value of the reactive property.
     */
    constructor() {
      this._value = value;

      /**
       * A list of subscriber functions to be called when the reactive property's value changes.
       * @type {Array<function>}
       * @private
       */
      this.subscribers = [];
    }

    /**
     * Retrieves the current value of the reactive property.
     * @returns {T} The current value.
     */
    get value(): T {
      return this._value;
    }

    /**
     * Sets the value of the reactive property. All subscribers will be notified.
     * @param {T} newValue The new value of the reactive property.
     */
    set value(newValue: T) {
      this._value = newValue;

      //console.log(this._values);

      this.subscribers.forEach((sub) => sub(newValue));
      this._values.push(this._value);
    }

    /**
     * Subscribes one or more functions to be notified when the reactive property's value changes.
     * Each function will be called with the new value as its argument whenever the value is updated.
     * @param {...function} subscribers The functions to subscribe for change notifications.
     */

    subscribe(...subscribers: ((value: T) => void)[]) {
      subscribers.forEach((subscriber) => this.subscribers.push(subscriber));
    }

    async history(): Promise<T[]> {
      await delay(1000);
      return this._values;
    }
  }

  return new Reactive();
}
