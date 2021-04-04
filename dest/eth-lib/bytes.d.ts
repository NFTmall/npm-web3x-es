declare const _default: {
    random: (bytes: any) => string;
    length: (a: any) => number;
    concat: (a: any, b: any) => any;
    flatten: (a: any) => string;
    slice: (i: any, j: any, bs: any) => string;
    reverse: (hex: any) => string;
    pad: (l: any, hex: any) => any;
    padRight: (l: any, hex: any) => any;
    fromAscii: (ascii: any) => string;
    toAscii: (hex: any) => string;
    fromString: (s: any) => string | null;
    toString: (bytes: any) => string | null;
    fromNumber: (num: any) => string;
    toNumber: (hex: any) => number;
    fromNat: (bn: any) => any;
    toNat: (bn: any) => any;
    fromArray: (arr: any) => string;
    toArray: (hex: any) => any;
    fromUint8Array: (arr: any) => string;
    toUint8Array: (hex: any) => Uint8Array;
};
export default _default;