import { parsePrecoSeguro } from './util.js';



export function parseProdutos(txt){

  const l=txt.split(/\r?\n/),p=[];

  for(const x of l){

    const n=x.match(/\b(\d{5,})\b/);

    const pr=x.match(/(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2}))\s*$/);

    if(!n||!pr) continue;

    p.push({

      nce:n[1],

      descricao:x.slice(x.indexOf(n[1])+n[1].length,x.lastIndexOf(pr[1])).trim(),

      preco:parsePrecoSeguro(pr[1])

    });

  }

  return p;

}



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



