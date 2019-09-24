import { arredondarMoeda, formatarMoeda, parseMoeda } from './moeda';

describe('arredondarMoeda', () => {
	it('Funciona', () => {
		expect(arredondarMoeda(0.1 + 0.2)).toBe(0.3);
		expect(arredondarMoeda(0.00499)).toBe(0);
		expect(arredondarMoeda(0.005)).toBe(0.01);
	});
});

describe('formatarMoeda', () => {
	it('Lida com zeros', () => {
		expect(formatarMoeda(0)).toBe('0,00');
	});
	it('Agrupa dígitos', () => {
		expect(formatarMoeda(1000)).toBe('1.000,00');
	});
	it('Arredonda valores', () => {
		expect(formatarMoeda(0.00499)).toBe('0,00');
		expect(formatarMoeda(0.005)).toBe('0,01');
	});
	it('Todos os comprimentos', () => {
		expect(formatarMoeda(0.01)).toBe('0,01');
		expect(formatarMoeda(0.12)).toBe('0,12');
		expect(formatarMoeda(1.23)).toBe('1,23');
		expect(formatarMoeda(12.34)).toBe('12,34');
		expect(formatarMoeda(123.45)).toBe('123,45');
		expect(formatarMoeda(1234.56)).toBe('1.234,56');
		expect(formatarMoeda(12345.67)).toBe('12.345,67');
		expect(formatarMoeda(123456.78)).toBe('123.456,78');
		expect(formatarMoeda(1234567.89)).toBe('1.234.567,89');
		expect(formatarMoeda(12345678.9)).toBe('12.345.678,90');
		expect(formatarMoeda(123456789.01)).toBe('123.456.789,01');
		expect(formatarMoeda(1234567890.12)).toBe('1.234.567.890,12');
	});
});

describe('parseMoeda', () => {
	it('Lê valores com 0 ou mais casas decimais', () => {
		expect(parseMoeda('1234')).toBe(1234);
		expect(parseMoeda('1234,0')).toBe(1234);
		expect(parseMoeda('1234,5')).toBe(1234.5);
		expect(parseMoeda('1234,56')).toBe(1234.56);
		expect(parseMoeda('1234,567')).toBe(1234.567);
	});
	it('Lê valores com ou sem agrupador de dígitos', () => {
		expect(parseMoeda('1234,56')).toBe(1234.56);
		expect(parseMoeda('1.234,56')).toBe(1234.56);
	});
	it('Retorna 0 para valores vazios', () => {
		expect(parseMoeda('')).toBe(0);
	});
	it('Retorna NaN para valores inválidos', () => {
		expect(parseMoeda('texto')).toBe(NaN);
	});
});
