//@ts-ignore
import formulario from './formulario.html';
import limparTabIndexFactory from './limparTabIndexFactory';
import obterElementosFactory from './obterElementosFactory';
import vincularSoma from './vincularSoma';
import tentarAteEncontrarFactory from './tentarAteEncontrarFactory';
import tentarAteEncontrarComValorFactory from './tentarAteEncontrarComValorFactory';
import preencherFormulario from './preencherFormulario';

const divs = ['divCalcValsBrutos'];
const inputs = [
  'txtValorBruto',
  'txtValorBrutoPrincipal',
  'txtValorBrutoJurosSelic',
  'gm-digitar-rpv__ex-corrente',
  'gm-digitar-rpv__ex-anterior',
  'txtValorTotal',
  'txtValorPrincipal',
  'txtValorJuros',
  'txtValorExCorrente',
  'txtValorExAnterior',
];
const buttons = ['btnAplicarCalcValsBrutos'];

const appFactory = (doc: Document) => {
  const limparTabIndex = limparTabIndexFactory(doc);
  const obterElementos = obterElementosFactory(doc);
  const tentarAteEncontrar = tentarAteEncontrarFactory(obterElementos);
  const tentarAteEncontrarComValor = tentarAteEncontrarComValorFactory(
    obterElementos
  );

  return () => {
    return tentarAteEncontrar(divs).then(([div]) => {
      div.insertAdjacentHTML('beforeend', formulario);
      return Promise.all([
        tentarAteEncontrar(buttons) as Promise<HTMLButtonElement[]>,
        tentarAteEncontrarComValor(inputs) as Promise<HTMLInputElement[]>,
      ]).then(([buttons, inputs]) => {
        const [aplicar] = buttons;
        const [
          inputBrutoTotal,
          inputBrutoPrincipal,
          inputBrutoJuros,
          inputBrutoCorrente,
          inputBrutoAnterior,
          inputTotal,
          inputPrincipal,
          inputJuros,
          inputCorrente,
          inputAnterior,
        ] = inputs;
        limparTabIndex();
        vincularSoma(inputBrutoPrincipal, inputBrutoJuros, inputBrutoTotal);
        vincularSoma(inputPrincipal, inputJuros, inputTotal);
        preencherFormulario(
          inputBrutoTotal,
          [inputCorrente, inputAnterior],
          [inputBrutoCorrente, inputBrutoAnterior]
        );
        aplicar.addEventListener('click', () => {
          preencherFormulario(
            inputTotal,
            [inputBrutoCorrente, inputBrutoAnterior],
            [inputCorrente, inputAnterior]
          );
        });
      });
    });
  };
};
export default appFactory;
