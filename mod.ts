export interface HKT {
    param: Record<string, unknown>
    result: unknown
}

export type Call<F extends HKT, T> = (F & { param: T })["result"]

export interface Not extends HKT {
    result: this["param"] extends true ? false : true
}

export interface Is<T> extends HKT {
    result: this["param"] extends T ? true : false
}

export interface String extends HKT {
    result: this["param"] extends string | number | boolean 
        ? `${this["param"]}` : ""
}

export type Map<F extends HKT, List> =
    List extends [infer Head, ...infer Tail]
        ? [Call<F, Head>, ...Map<F, Tail>]
        : []
export type Filter<F extends HKT, List> =
    List extends [infer Head, ...infer Tail]
        ? Call<F, Head> extends true
            ? [Head, ...Filter<F, Tail>]
            : Filter<F, Tail>
        : []
export type Join<Delimiter extends string, List> =
    List extends [infer Head, ...infer Tail]
        ? Head extends string
            ? Tail extends []
                ? Head
                : `${Head}${Delimiter}${Join<Delimiter, Tail>}`
            : ""
        : ""

type T = Join<",", Map<String, [1, 2 | 4, 3]>>