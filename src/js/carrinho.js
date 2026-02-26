import { fmt } from './util.js';



export let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];



export function salvarCarrinho() {

  localStorage.setItem('carrinho', JSON.stringify(carrinho));

}



export function adicionarCarrinho(produto) {

  

  // garante padrão vindo do parser

  const produtoPadrao = {

    descricao: produto.descricao || "",

    nce: produto.nce || "",

    grupo: produto.grupo || "",

    saldo: Number(produto.saldo || 0),

    cor: produto.cor || "",

    preco: Number(produto.preco) || 0

  };

  

  const produtoExistente = carrinho.find(p => p.nce === produtoPadrao.nce);

  

  if (produtoExistente) {

    produtoExistente.quantidade += 1;

  } else {

    carrinho.push({

      ...produtoPadrao,

      quantidade: 1,

      garantia: 0

    });

  }

  

  salvarCarrinho();

  render();

}



export function limparCarrinho() {

  carrinho.length = 0;

  salvarCarrinho();

  render();

}



export function render() {

  const lista = document.getElementById('lista');

  const resultado = document.getElementById('resultado');

  

  if (!lista || !resultado) return;

  

  resultado.style.display = carrinho.length ? 'none' : 'none';

  lista.innerHTML = '';

  

  const garantias = JSON.parse(localStorage.getItem('garantias') || '[]');

  

  carrinho.forEach((p, index) => {

    console.log("PRECO NO CARRINHO:", p.preco);

    const div = document.createElement('div');

    div.classList.add('item');

    

    const g = garantias.find(k => k.nce === p.nce);

    const valorG1 = g ? (g.g1 || 0) * p.quantidade : 0;

    const valorG2 = g ? (g.g2 || 0) * p.quantidade : 0;

    

    div.innerHTML = `



  <div>



    <div class="box-descricao">

      <p class="descricao">${p.descricao}</p>

    </div>



    <div class="info-produto">

    <small class="nce" style="color:#C8AC00;font-weight:bold;">🔢: ${p.nce}</small> |

      <small style="color:blue;font-weight:bold;">🗄️: G${p.grupo || "-"}</small> |

      <small style="color:#F16800;font-weight:bold;">📦: ${p.saldo ?? "-"}</small>|

      <small style="font-weight:bold;font-size:10px;">🎨: ${p.cor || "-"}</small

    </div>



    <div class="box-quantidade">

      <div class="quantidade">

        Quantidade: <span>${p.quantidade}</span>

      </div>



      <div class="buttons">

        <button class="btn-minus">−</button>

        <button class="btn-plus">+</button>

      </div>

    </div>



    <div class="garantia-item">

      <label>Garantia:</label>

      <select class="select-garantia">

        <option value="0">Sem garantia</option>

        <option value="1">GE 1 (${fmt(valorG1)})</option>

        <option value="2">GE 2 (${fmt(valorG2)})</option>

      </select>

    </div>



  </div>



  <div>

    <strong class="valor-total">

     ${(Number(p.preco || 0) * Number(p.quantidade || 0)).toLocaleString('pt-BR', {

  style: 'currency',

  currency: 'BRL'

})}

    </strong>

  </div>

`;

    

    div.querySelector('.btn-plus').onclick = () => {

      p.quantidade++;

      salvarCarrinho();

      render();

    };

    

    div.querySelector('.btn-minus').onclick = () => {

      if (p.quantidade > 1) p.quantidade--;

      else carrinho.splice(index, 1);

      salvarCarrinho();

      render();

    };

    

    const select = div.querySelector('.select-garantia');

    select.value = p.garantia;

    select.onchange = e => {

      p.garantia = Number(e.target.value);

      salvarCarrinho();

      render();

    };

    

    //BOTÃO APAGAR

    const btnApagar = document.createElement('button');

    btnApagar.textContent = 'Apagar';

    btnApagar.className = 'btn-apagar';

    btnApagar.innerHTML = `<img src="./src/img/trash-can.png" alt="Imagem logo lixeira">`

    btnApagar.onclick = () => {

      carrinho = carrinho.filter(item => item.nce !== p.nce);

      salvarCarrinho();

      render();

    };

    

    div.appendChild(btnApagar);

    lista.appendChild(div);

  });

}





render();






