export type Handler<A, U, E> = [A] extends [never]
    ? () => Promise<U | ([E] extends [never] ? never : { error: E })>
    : (args: A) => Promise<U | ([E] extends [never] ? never : { error: E })>;
