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
});
