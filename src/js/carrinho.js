import { fmt } from './util.js';

export let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

export function salvarCarrinho() {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

export function adicionarCarrinho(produto) {
  const produtoExistente = carrinho.find(p => p.nce === produto.nce);

  if (produtoExistente) {
    produtoExistente.quantidade += 1;
  } else {
    carrinho.push({
      ...produto,
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

  resultado.style.display = carrinho.length ? 'block' : 'none';
  lista.innerHTML = '';

  const garantias = JSON.parse(localStorage.getItem('garantias') || '[]');

  carrinho.forEach((p, index) => {
    const div = document.createElement('div');
    div.classList.add('item');

    const g = garantias.find(k => k.nce === p.nce);
    const valorG1 = g ? (g.g1 || 0) * p.quantidade : 0;
    const valorG2 = g ? (g.g2 || 0) * p.quantidade : 0;

    div.innerHTML = `
      <div>
        <div class="descricao">
        <strong class="nce">${p.nce}</strong>
        <small>${p.descricao}</small>
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
          ${(p.preco * p.quantidade).toLocaleString('pt-BR', {
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