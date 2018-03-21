import tentarAteEncontrarFactory from './tentarAteEncontrarFactory';

const tentarAteEncontrarComValorFactory = (
  obterElementos: (ids: string[]) => Promise<HTMLElement[]>
) => {
  const tentarAteEncontrar = tentarAteEncontrarFactory(obterElementos);
  return (ids: string[]): Promise<HasValue[]> =>
    new Promise(resolve => {
      (tentarAteEncontrar(ids) as Promise<HasValue[]>).then(
        (els: HasValue[]) => {
          const timer = setInterval(() => {
            if (els.every(el => el.value !== '')) {
              clearInterval(timer);
              resolve(els);
            }
          }, 100);
        },
        () => {
          // just wait
        }
      );
    });
};

export default tentarAteEncontrarComValorFactory;
