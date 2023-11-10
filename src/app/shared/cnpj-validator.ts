// Regex para validação de string no formato CNPJ
export const regexCNPJ = /^\d{2}.\d{3}.\d{3}\/\d{4}-\d{2}$/

// Método de validação
// Referência: https://pt.wikipedia.org/wiki/Cadastro_Nacional_da_Pessoa_Jur%C3%ADdica
export function validCNPJ(value: string | number | number[] = '') {
  if (!value) return false

  // Aceita receber o valor como string, número ou array com todos os dígitos
	const isString = typeof value === 'string';
  const validTypes = isString || typeof value === 'number' || Array.isArray(value);

  // Elimina valor de tipo inválido
  if (!validTypes) return false

  // Filtro inicial para entradas do tipo string
  if (isString) {
		const stringValue = value as string
    // Teste Regex para veificar se é uma string apenas dígitos válida
    const digitsOnly = /^\d{14}$/.test(stringValue)
    // Teste Regex para verificar se é uma string formatada válida
    const validFormat = regexCNPJ.test(stringValue)
    // Verifica se o valor passou em ao menos 1 dos testes
    const isValid = digitsOnly || validFormat

    // Se o formato não é válido, retorna inválido
    if (!isValid) return false
  }

  // Elimina tudo que não é dígito
  const numbers = matchNumbers(value)

  // Valida a quantidade de dígitos
  if (numbers.length !== 14) return false

  // Elimina inválidos com todos os dígitos iguais
  const items = [...new Set(numbers)]
  if (items.length === 1) return false

  // Separa os 2 últimos dígitos verificadores
  const digits = numbers.slice(12)

  // Valida 1o. dígito verificador
  const digit0 = validCalc(12, numbers)
  if (digit0 !== digits[0]) return false

  // Valida 2o. dígito verificador
  const digit1 = validCalc(13, numbers)
  return digit1 === digits[1]
}

// Cálculo validador
function validCalc(x: number, numbers: number[]) {
  const slice = numbers.slice(0, x)
  let factor = x - 7
  let sum = 0

  for (let i = x; i >= 1; i--) {
    const n = slice[x - i]
    sum += n * factor--
    if (factor < 2) factor = 9
  }

  const result = 11 - (sum % 11)

  return result > 9 ? 0 : result
}

// Elimina tudo que não é dígito
function matchNumbers(value: string | number | number[] = '') {
  const match = value.toString().match(/\d/g)
  return Array.isArray(match) ? match.map(Number) : []
}