import { z } from "zod";
import { createMapper, isSchema } from "../src/main.js";

export class Test {
  name: string | undefined;
  constructor(name: string) {
    this.name = name;
  }
}
const testSchema = z.instanceof(Test);

export const dataSchema = z.object({
  //   value: z.instanceof(Test),
  value: testSchema,
});

export type Data = z.infer<typeof dataSchema>;
// type Data = {
//   value: Test;
// }

export const data: Data = {
  value: new Test("hello world"),
};

const jsonMapper = createMapper(
  dataSchema,
  (schema) => isSchema(testSchema, schema), // type prediction helper method come with package
  (schema) => schema.transform((value) => value.name),
  (schema) =>
    z
      .string()
      .transform((value) => new Test(value))
      .pipe(schema)
).mapper();

type Json = z.infer<typeof jsonMapper.encoderSchema>;
// type Json = {
//   value: string | undefined;
// }

const jsonData: Json = {
  value: "hello world",
};

console.log(jsonMapper.encode(data));
// { value: 'hello world' }
console.log(jsonMapper.decode(jsonData));
// { value: Test { name: 'hello world' } }
