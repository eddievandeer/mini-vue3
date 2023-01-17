import { effect, track, trigger } from './effect'

export type ComputedGetter<T> = (...args: any[]) => T
export type ComputedSetter<T> = (v: T) => void

export function computed<T>(getter: ComputedGetter<T>) {
  let value: T
  let dirty = true

  const effectFn = effect(getter, {
    lazy: true,
    scheduler: () => {
      dirty = true
      // trigger effects
      trigger(obj, 'value')
    },
  })

  const obj = {
    get value() {
      if (dirty) {
        value = effectFn()
        dirty = false
      }
      // track dependencies
      track(obj, 'value')
      return value
    },
  }

  return obj
}
