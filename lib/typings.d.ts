interface PluginOptions {
	metadata: Object;
	filename: string;
}
interface Compiler {
	hooks: Hooks;
}
interface Hooks {
	emit: Hook;
}
interface Hook {
	tap: (pluginName: string, fn: (compilation: Compilation) => void) => void;
}
interface Compilation {
	assets: Assets;
}
interface Assets {
	[filename: string]: Asset;
}
interface Asset {
	source: () => string;
	size: () => number;
}
