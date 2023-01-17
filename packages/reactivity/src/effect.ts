import { EMPTY_OBJ } from '@mini-vue3/shared'

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
  options: ReactiveEffectOptions
}

export interface ReactiveEffectOptions {
  lazy?: boolean
  scheduler?: (job: ReactiveEffect) => void
}

let activeEffect: ReactiveEffect
const effectStack: ReactiveEffect[] = []

export function effect<T>(
  fn: () => T,
  options: ReactiveEffectOptions = EMPTY_OBJ
) {
  const effect = createReactiveEffect(fn, options)

  if(!options.lazy) {
    effect()
  }

  return effect
}

let uid = 0

export function createReactiveEffect<T = any>(
  fn: () => T,
  options: ReactiveEffectOptions
): ReactiveEffect<T> {
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
  effect.options = options

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
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    // never been tracked
    return
  }

  const effects = new Set<ReactiveEffect>()

  // Do not add active effect to the set of effects to run
  const add = (effectsToAdd: Set<ReactiveEffect> | undefined) => {
    if (effectsToAdd) {
      effectsToAdd.forEach((effect) => {
        if (effect !== activeEffect) {
          effects.add(effect)
        }
      })
    }
  }

  add(depsMap.get(key))

  const run = (effect: ReactiveEffect) => {
    if (effect.options.scheduler) {
      effect.options.scheduler(effect)
    } else {
      effect()
    }
  }

  effects && effects.forEach(run)
}
