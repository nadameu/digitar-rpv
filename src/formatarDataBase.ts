export const formatarDataBase = (data: Date): string => {
	const ano = data.getFullYear();
	const mes = data.getMonth() + 1;
	return `${mes.toString().padStart(2, '0')}/${ano}`;
};
