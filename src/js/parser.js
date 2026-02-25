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
  return txt.split(/\r?\n/).map(l=>{
    const m=l.match(/\b(\d{5,})\b.*?(\d+[.,]\d{2})\s+(\d+[.,]\d{2})/);
    return m?{nce:m[1],g1:parsePrecoSeguro(m[2]),g2:parsePrecoSeguro(m[3])}:null;
  }).filter(Boolean);
}

