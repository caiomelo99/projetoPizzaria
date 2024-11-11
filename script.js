"use strict";
var _a, _b, _c;
let modalQt = 1;
let cart = [];
let modalKey = 0;
// Clonar e configurar pizzas
pizzaJson.map((item, index) => {
    var _a;
    let pizzaItem = (_a = document.querySelector('.models .pizza-item')) === null || _a === void 0 ? void 0 : _a.cloneNode(true);
    document.querySelector('.pizza-area').append(pizzaItem);
    pizzaItem.setAttribute('data-key', index.toString());
    pizzaItem.querySelector('.pizza-item--img img').setAttribute('src', `${item.img}`);
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        modalQt = 1;
        modalKey = index; // Define a pizza selecionada pela chave
        abrirModal(item);
    });
});
function abrirModal(item) {
    let modal = document.querySelector('.pizzaWindowArea');
    modal.style.display = 'flex';
    modal.style.opacity = '0';
    setTimeout(() => { modal.style.opacity = '1'; }, 200);
    // Atualizar informações do modal
    let pizzaWindowBody = document.querySelector('.pizzaWindowBody');
    pizzaWindowBody.querySelector('.pizzaBig img').setAttribute('src', `${item.img}`);
    pizzaWindowBody.querySelector('.pizzaInfo h1').innerHTML = item.name;
    pizzaWindowBody.querySelector('.pizzaInfo--desc').innerHTML = item.description;
    pizzaWindowBody.querySelector('.pizzaInfo--actualPrice').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaWindowBody.querySelector('.pizzaInfo--qt').innerHTML = `${modalQt}`;
    // Selecionar o tamanho da pizza
    let pizzaSizes = document.querySelectorAll('.pizzaInfo--size');
    pizzaSizes.forEach((size, sizeIndex) => {
        size.classList.remove('selected');
        if (sizeIndex === 2)
            size.classList.add('selected'); // Seleciona tamanho grande por padrão
        size.querySelector('span').innerHTML = item.sizes[sizeIndex];
    });
}
// Função fechar modal
function fecharModal() {
    const modal = document.querySelector('.pizzaWindowArea');
    modal.style.opacity = '0';
    setTimeout(() => { modal.style.display = 'none'; }, 200);
}
document.querySelectorAll('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton').forEach((item) => {
    item.addEventListener('click', fecharModal);
});
// Botões de adicionar e subtrair quantidade
let pizzaInfoQtArea = document.querySelector('.pizzaInfo--qtarea');
(_a = pizzaInfoQtArea.querySelector('.pizzaInfo--qtmais')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
    modalQt += 1;
    pizzaInfoQtArea.querySelector('.pizzaInfo--qt').innerHTML = `${modalQt}`;
});
(_b = pizzaInfoQtArea.querySelector('.pizzaInfo--qtmenos')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
    modalQt = Math.max(1, modalQt - 1);
    pizzaInfoQtArea.querySelector('.pizzaInfo--qt').innerHTML = `${modalQt}`;
});
// Alterar tamanho das pizzas
document.querySelectorAll('.pizzaInfo--size').forEach((size) => {
    size.addEventListener('click', () => {
        var _a;
        (_a = document.querySelector('.pizzaInfo--size.selected')) === null || _a === void 0 ? void 0 : _a.classList.remove('selected');
        size.classList.add('selected');
    });
});
// Adicionar ao carrinho
(_c = document.querySelector('.pizzaInfo--addButton')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => {
    // Encontrar o tamanho selecionado
    const selectedSize = document.querySelector('.pizzaInfo--size.selected');
    // Verificar se o selectedSize não é nulo
    if (selectedSize) {
        let keyDataPizza = parseInt(selectedSize.getAttribute('data-key') || '0'); // Garantir que seja um número
        let identificador = pizzaJson[modalKey].id + '@' + keyDataPizza;
        let key = cart.findIndex((item) => item.identificador == identificador);
        if (key > -1) {
            cart[key].qt += modalQt;
        }
        else {
            cart.push({
                identificador,
                id: pizzaJson[modalKey].id,
                keyDataPizza,
                qt: modalQt
            });
        }
    }
    updateCart();
    fecharModal();
});
//abrir menu pelo mobile
document.querySelector('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
        document.querySelector('aside').style.left = '0';
    }
    document.querySelector('aside .menu-closer').addEventListener('click', () => {
        document.querySelector('aside').style.left = '100vw';
    });
});
//função para atualizar itens do carrinho
function updateCart() {
    var _a;
    document.querySelector('.menu-openner span').innerHTML = `${cart.length}`;
    if (cart.length > 0) {
        (_a = document.querySelector('aside')) === null || _a === void 0 ? void 0 : _a.classList.add('show');
        document.querySelector('.cart').innerHTML = '';
        let desconto = 0;
        let subtotal = 0;
        let total = 0;
        cart.map((key, index) => {
            var _a, _b, _c, _d;
            let pizzaItem = pizzaJson.find((item) => item.id == key.id);
            let pizzaSizeName;
            let descontoRate = 0; // Definindo a taxa de desconto baseada no tamanho
            // Define o nome do tamanho e a taxa de desconto
            switch (key.keyDataPizza) {
                case 0:
                    pizzaSizeName = 'P';
                    descontoRate = 0.3; // 30% de desconto
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    descontoRate = 0.2; // 20% de desconto
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    descontoRate = 0.1; // 10% de desconto
                    break;
            }
            // Adiciona o preço original ao subtotal
            subtotal += pizzaItem.price * key.qt;
            // Configurações para exibir o item no carrinho
            let cartItem = (_a = document.querySelector('.models .cart--item')) === null || _a === void 0 ? void 0 : _a.cloneNode(true);
            document.querySelector('.cart').append(cartItem);
            let pizzaName = `${pizzaItem === null || pizzaItem === void 0 ? void 0 : pizzaItem.name} (${pizzaSizeName})`;
            (_b = cartItem.querySelector('img')) === null || _b === void 0 ? void 0 : _b.setAttribute('src', `${pizzaItem === null || pizzaItem === void 0 ? void 0 : pizzaItem.img}`);
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = `${key.qt}`;
            // Botões de incrementar e decrementar
            (_c = cartItem.querySelector('.cart--item-qtmenos')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => {
                key.qt = Math.max(0, key.qt - 1);
                if (key.qt < 1) {
                    cart.splice(index, 1);
                }
                updateCart();
            });
            (_d = cartItem.querySelector('.cart--item-qtmais')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', () => {
                key.qt++;
                updateCart();
            });
            // Calcula o desconto total com base na taxa de desconto acumulada
            desconto += pizzaItem.price * key.qt * descontoRate;
        });
        total = subtotal - desconto;
        // Exibe os valores na tela
        document.querySelector('.subtotal span:last-child').innerHTML = `R$${subtotal.toFixed(2)}`;
        document.querySelector('.desconto span:last-child').innerHTML = `R$${desconto.toFixed(2)}`;
        document.querySelector('.total span:last-child').innerHTML = `R$${total.toFixed(2)}`;
    }
    else {
        document.querySelector('aside').classList.remove('show');
        document.querySelector('aside').style.left = '100vw';
    }
}
