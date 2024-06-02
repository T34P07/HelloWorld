export function lerp(a: number, b: number, t: number): number {
	return (1 - t) * a + t * b;
}

export function inverseLerp(a: number, b: number, v: number): number {
	return (v - a) / (b - a);
}

export function map(v: number, a: number, b: number, a1: number, b1: number): number {
	return lerp(a1, b1, inverseLerp(a, b, v));
}
