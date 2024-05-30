function dc(numero: string, esCuenta: boolean): number {
  let pesos = [];
  if (esCuenta) pesos = [3, 2, 7, 6, 5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  else pesos = [3, 2, 7, 6, 5, 4, 3, 2, 5, 4, 3, 2];

  let s = 0;
  for (let i = 0; i < numero.length; i++) {
    const d = numero[i];
    s += Number(d) * pesos[i];
  }
  let resultado = Number(11 - (s % 11));
  if (resultado == 10) resultado = 0;
  else if (resultado == 11) resultado = 1;

  return resultado;
}

function getDigitoVerificador(
  entidad: string,
  sucursal: string,
  cuenta: string,
): string {
  const num1 = dc(entidad + sucursal, false);
  const num2 = dc(sucursal + cuenta, true);
  const d = `${num1}${num2}`;
  return d;
}

export function isValid(account_number: string): boolean {
  const entidad: string = account_number.slice(0, 4);
  const sucursal: string = account_number.slice(4, 8);
  const dc: string = account_number.slice(8, 10);
  const cuenta: string = account_number.slice(10);
  const calculo = getDigitoVerificador(entidad, sucursal, cuenta);

  if (calculo == dc) return true;

  return false;
}

export function isValidExpresion(account_number: string): boolean {
  if (!/^[0-9]{20}$/.test(account_number)) return false;
  return true;
}
