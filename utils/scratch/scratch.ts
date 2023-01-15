// // Optional chaining and nullish coalescing with info on hard privacy (#variable) class fields

// class Foo {
//   // hard privacy
//   #name: string;
//   constructor(rawName?: string) {
//     // nullish coalesing, does not check for falsy, only nullish
//     this.#name = rawName ?? "(no name)";
//   }
//   log() {
//     console.log(this.#name);
//   }
// }

// // Tuple types and recursive type aliases

// // Variatic tuple types
// type Foo2<T extends any[]> = [boolean, ...T, boolean];

// // labelled tuple types
// // before
// type Address = [number, string, string, number];

// function printAddress(...address: Address) {}

// //
// type Address2 = [
//   streetNumber: number,
//   city: string,
//   state: string,
//   postal: number
// ];

// function printAddress2(...address: Address2) {}

// // Recursive type aliases
// {
//   // Type for representing a json before
//   type JSONValue = string | number | boolean | null | JSONArray | JSONObject;

//   interface JSONObject {
//     [k: string]: JSONValue;
//   }

//   interface JSONArray extends Array<JSONValue> {}
//   // End Type for representing a json

//   const val: JSONValue = {
//     name: "mike",
//     address: {
//       street: "Spear St",
//     },
//   };
// }
// {
//   // Now, we can direcly apply the recursion without intermediate types/interfaces
//   type JSONValue =
//     | string
//     | number
//     | boolean
//     | null
//     | JSONValue[]
//     | {
//         [key: string]: JSONValue;
//       };

//   const val: JSONValue = {
//     name: "mike",
//     address: {
//       street: "Spear St",
//     },
//   };
// }

// // Template type literals
// {
//   type Corner = `${Capitalize<"top" | "bottom">}-${"left" | "right"}`;
// }

// // using ts-ignore and ts-expect-error

// {
//   //   @ts-expect-error
//   const num1: number = "hello";

//   //   @ts-ignore
//   const num2: number = "hello";
// }
// {
//   ////   @ts-expect-error {remote two comment slashes to activate the next line}
//   const num1: number = 5;

//   //   @ts-ignore
//   const num2: number = 5;
// }

// // Error handling with unknown
// {
//   function somethingRisky() {}

//   try {
//     somethingRisky();
//   } catch (error) {
//     if (error instanceof Error) {
//       console.log(error.stack);
//     } else {
//       console.log(error);
//     }
//   }
// }

// // Enforcing narrowing and typeguards with unknown
// {
//   function somethingRisky() {}
//   function isError(err: any): err is Error {
//     return err instanceof Error;
//   }

//   try {
//     somethingRisky();
//   } catch (error) {
//     if (isError(error)) {
//       console.log(error.stack);
//     } else {
//       console.log(error);
//     }
//   }
// }
// export {};
