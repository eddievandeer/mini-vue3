type Dep = Set<ReactiveEffect>
type KeyToDepMap = Map<any, Dep>
const targetMap = new WeakMap<any, KeyToDepMap>()

export interface ReactiveEffect<T = any> {
  (): T
}

let activeEffect: ReactiveEffect

export function effect<T>(fn: () => T) {
  const effect = createReactiveEffect(fn)

  effect()
  return effect
}

export function createReactiveEffect<T = any>(fn: () => T): ReactiveEffect<T> {
  const effect = function reactiveEffect(): unknown {
    activeEffect = effect
    return fn()
  } as ReactiveEffect

  return effect
}

export function track(target: any, key: string | symbol) {
  if (activeEffect === undefined) return

  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }

  if (!deps.has(activeEffect)) {
    deps.add(activeEffect)
  }
}

export function trigger(target: any, key: string | symbol) {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    // never been tracked
    return
  }

  const run = (effect: ReactiveEffect) => {
    effect()
  }

  const effects = depsMap.get(key)
  effects && effects.forEach(run)
}
