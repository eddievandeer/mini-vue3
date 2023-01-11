type Dep = Set<ReactiveEffect>
type KeyToDepMap = Map<any, Dep>
const targetMap = new WeakMap<any, KeyToDepMap>()

export interface ReactiveEffect<T = any> {
  (): T
  _isEffect: true
  id: number
  active: boolean
  raw: () => T
  deps: Array<Dep>
}

let activeEffect: ReactiveEffect
const effectStack: ReactiveEffect[] = []

export function effect<T>(fn: () => T) {
  const effect = createReactiveEffect(fn)

  effect()
  return effect
}

let uid = 0

export function createReactiveEffect<T = any>(fn: () => T): ReactiveEffect<T> {
  const effect = function reactiveEffect(): unknown {
    try {
      cleanup(effect)
      effectStack.push(effect)
      activeEffect = effect
      return fn()
    } finally {
      effectStack.pop()
      activeEffect = effectStack[effectStack.length - 1]
    }
  } as ReactiveEffect

  effect._isEffect = true
  effect.id = uid++
  effect.active = true
  effect.raw = fn
  effect.deps = []

  return effect
}

function cleanup(effect: ReactiveEffect) {
  const { deps } = effect

  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect)
    }

    deps.length = 0
  }
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
    activeEffect.deps.push(deps)
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

  const effects = new Set(depsMap.get(key))
  effects && effects.forEach(run)
}
