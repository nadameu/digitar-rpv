export const dividirString = (str: string, i: number): [string, string] => {
	const left = str.slice(0, i);
	const right = str.slice(i);
	return [left, right];
};

export const dividirStringHex = (
	str: string,
	i: number = 7
): [number, string] => {
	const [left, rest] = dividirString(str, i);
	const num = parseInt(left, 16);
	return [num, rest];
};

export const dividirStringMoeda = (
	str: string,
	i: number = 7
): [number, string] => {
	const [centavos, rest] = dividirStringHex(str, i);
	return [centavos / 100, rest];
};
