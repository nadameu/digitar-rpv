declare module 'uglifyjs-webpack-plugin';
declare module 'userscript-meta';

declare module '*.html' {
	const text: string;
	export default text;
}

declare module '*.json' {
	const value: any;
	export default value;
}

declare interface HasValue extends Partial<HTMLElement> {
	value: string;
}
