import { formatarMoeda, parseMoeda } from './moeda';

export class InputMoeda extends HTMLInputElement {
	get valueAsNumber() {
		return parseMoeda(this.value);
	}
	set valueAsNumber(value) {
		this.value = formatarMoeda(value);
	}

	sanitizeInput() {
		const text = this.value;
		const selection = this.selectionEnd;
		const num = Number(text.replace(/\D+/g, '')) / 100;
		this.valueAsNumber = num;
		const formatted = this.value;
		if (selection == null) return;

		let digitosDepoisDaSelecao = 0;
		for (let i = selection; i < text.length; i++) {
			if (text[i].match(/\d/)) digitosDepoisDaSelecao++;
		}
		if (digitosDepoisDaSelecao === 0) return;

		let novaSelecao = formatted.length;
		for (let i = formatted.length - 1; i >= 0; i--) {
			if (formatted[i].match(/\d/)) digitosDepoisDaSelecao--;
			if (digitosDepoisDaSelecao < 0) break;
			novaSelecao = i;
		}

		this.setSelectionRange(novaSelecao, novaSelecao);
	}
}

let proto: object | null = InputMoeda.prototype;
while (proto !== null && !Object.prototype.hasOwnProperty.call(proto, 'value'))
	proto = Object.getPrototypeOf(proto);
const props = proto && Object.getOwnPropertyDescriptor(proto, 'value');

const dispararOnChangeComPrimeiroValor = (input: InputMoeda) => {
	if (!props || !props.get || !props.set) return;
	Object.defineProperty(input, 'value', {
		get: props.get,
		set(this: InputMoeda, value) {
			let old = this.value;
			delete this.value;
			this.value = value;
			this.sanitizeInput();
			console.log('primeiro', this.value, old);
			if (this.value === old) return;

			const evt = document.createEvent('Event');
			evt.initEvent('change', true, true);
			setTimeout(() => {
				this.dispatchEvent(evt);
			}, 0);
		},
		enumerable: true,
		configurable: true,
	});
};

export const corrigirCampoMoeda = (input: HTMLInputElement) => {
	const modified = corrigirCampoMoedaSemAguardarPrimeiroValor(input);
	dispararOnChangeComPrimeiroValor(modified);
	return modified;
};

export const corrigirCampoMoedaSemAguardarPrimeiroValor = (
	input: HTMLInputElement
) => {
	const modified: InputMoeda = Object.setPrototypeOf(
		input,
		InputMoeda.prototype
	);
	modified.removeAttribute('onkeypress');
	modified.addEventListener('input', () => modified.sanitizeInput());
	if (modified.value === '') modified.value = '0,00';
	return modified;
};
