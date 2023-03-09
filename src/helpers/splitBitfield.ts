/** Splits permission bitfield into it's individual components. */
export function splitBitfield<T extends number>(bitfield: T): T[] {
    const values: T[] = [];
    while (bitfield) {
        const bit = bitfield & (~bitfield + 1);
        values.push(bit as T);
        (bitfield as number) ^= bit;
    }
    return values;
}
