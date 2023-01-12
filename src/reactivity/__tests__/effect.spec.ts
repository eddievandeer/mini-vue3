import { effect } from "../effect";
import { reactive } from "../reactive";

describe("effect", () => {
  it("happy path", () => {
    const user = reactive({
      age: 10,
      number: 0
    });

    let nextAge = 0;

    effect(() => {
      nextAge = user.age + 1;
    });

    effect(() => {
      nextAge = nextAge + user.number
    })

    expect(nextAge).toBe(11);

    user.age++;
    expect(nextAge).toBe(12);

    user.number++;
    expect(nextAge).toBe(13);
  });

  it("should return runner when call effect", () => {
    let foo = 10;

    const runner = effect(() => {
      foo++;

      return "foo";
    });

    expect(foo).toBe(11);
    expect(runner()).toBe("foo");
  });

  it("should not execute the effect function when the dep is not used", () => {
    const obj = reactive({
      ok: true,
      text: "Hello",
    });

    let valueToShow;

    const effectFunction = jest.fn(() => {
      valueToShow = obj.ok ? obj.text : "not";
    });

    effect(effectFunction);

    expect(valueToShow).toBe("Hello");
    expect(effectFunction).toBeCalledTimes(1);

    obj.ok = false;
    expect(valueToShow).toBe("not");
    expect(effectFunction).toBeCalledTimes(2);

    // 当副作用函数不再读取某一个字段时，该字段无论发生什么变化都不应该执行副作用函数
    obj.text = "World";
    expect(effectFunction).toBeCalledTimes(2);
  });

  it("nested effect function", () => {
    const obj = reactive({
      foo: 1,
      bar: 2
    });

    let outer
    let inner

    effect(() => {
      effect(() => {
        inner = obj.bar
      })
      outer = obj.foo
    })

    expect(outer).toBe(1)
    expect(inner).toBe(2)

    obj.foo = 3
    expect(outer).toBe(3)
    expect(inner).toBe(2)
  })
});
