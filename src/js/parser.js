import { parsePrecoSeguro } from './util.js';

export function parseGarantias(txt){
  return txt
    .split(/\r?\n/)
    .map(l => {

      const nceMatch = l.match(/\b(\d{4,})\b/);
      if(!nceMatch) return null;

      const valores = [...l.matchAll(/(\d+[.,]\d{2})/g)]
        .map(v => parsePrecoSeguro(v[1]));

      if(valores.length === 0) return null;

      return {
        nce: nceMatch[1].trim(),
        g1: valores[0] || 0,
        g2: valores[1] || 0
      };

    })
    .filter(Boolean);
}

