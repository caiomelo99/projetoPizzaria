let modalQt: number = 1;
let cart: CartItem[] = [];
let modalKey: number = 0;


type CartItem = {
    identificador: string,
    id: number,
    keyDataPizza: number,
    qt: number
}
    

// Clonar e configurar pizzas
pizzaJson.map((item, index) => {
    let pizzaItem = document.querySelector('.models .pizza-item')?.cloneNode(true) as HTMLElement;
    document.querySelector('.pizza-area')!.append(pizzaItem);

    pizzaItem.setAttribute('data-key', index.toString());
    pizzaItem.querySelector('.pizza-item--img img')!.setAttribute('src', `${item.img}`);
    pizzaItem.querySelector('.pizza-item--price')!.innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name')!.innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc')!.innerHTML = item.description;

    pizzaItem.querySelector('a')!.addEventListener('click', (e) => {
        e.preventDefault();
        modalQt = 1;
        modalKey = index; // Define a pizza selecionada pela chave

        abrirModal(item);
    });
});

function abrirModal(item: any) {
    let modal = document.querySelector('.pizzaWindowArea') as HTMLElement;
    modal.style.display = 'flex';
    modal.style.opacity = '0';
    setTimeout(() => { modal.style.opacity = '1'; }, 200);

    // Atualizar informações do modal
    let pizzaWindowBody = document.querySelector('.pizzaWindowBody') as HTMLElement;
    pizzaWindowBody.querySelector('.pizzaBig img')!.setAttribute('src', `${item.img}`);
    pizzaWindowBody.querySelector('.pizzaInfo h1')!.innerHTML = item.name;
    pizzaWindowBody.querySelector('.pizzaInfo--desc')!.innerHTML = item.description;
    pizzaWindowBody.querySelector('.pizzaInfo--actualPrice')!.innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaWindowBody.querySelector('.pizzaInfo--qt')!.innerHTML = `${modalQt}`;

    // Selecionar o tamanho da pizza
    let pizzaSizes = document.querySelectorAll('.pizzaInfo--size') as NodeListOf<HTMLElement>;
    pizzaSizes.forEach((size: HTMLElement, sizeIndex: number) => {
        size.classList.remove('selected');
        if (sizeIndex === 2) size.classList.add('selected'); // Seleciona tamanho grande por padrão
        size.querySelector('span')!.innerHTML = item.sizes[sizeIndex];
    });
}

// Função fechar modal
function fecharModal() {
    const modal = document.querySelector('.pizzaWindowArea') as HTMLElement;
    modal.style.opacity = '0';
    setTimeout(() => { modal.style.display = 'none'; }, 200);
}

document.querySelectorAll('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton').forEach((item) => {
    item.addEventListener('click', fecharModal);
});

// Botões de adicionar e subtrair quantidade
let pizzaInfoQtArea = document.querySelector('.pizzaInfo--qtarea') as HTMLElement;
pizzaInfoQtArea.querySelector('.pizzaInfo--qtmais')?.addEventListener('click', () => {
    modalQt += 1;
    pizzaInfoQtArea.querySelector('.pizzaInfo--qt')!.innerHTML = `${modalQt}`;
});

pizzaInfoQtArea.querySelector('.pizzaInfo--qtmenos')?.addEventListener('click', () => {
    modalQt = Math.max(1, modalQt - 1);
    pizzaInfoQtArea.querySelector('.pizzaInfo--qt')!.innerHTML = `${modalQt}`;
});

// Alterar tamanho das pizzas
(document.querySelectorAll('.pizzaInfo--size') as NodeListOf<HTMLElement>).forEach((size: HTMLElement) => {
    size.addEventListener('click', () => {
        document.querySelector('.pizzaInfo--size.selected')?.classList.remove('selected');
        size.classList.add('selected');
    });
});

// Adicionar ao carrinho
document.querySelector('.pizzaInfo--addButton')?.addEventListener('click', () => {

    // Encontrar o tamanho selecionado
    const selectedSize = document.querySelector('.pizzaInfo--size.selected') as HTMLElement;
    
    // Verificar se o selectedSize não é nulo
    if (selectedSize) {
        let keyDataPizza = parseInt(selectedSize.getAttribute('data-key') || '0'); // Garantir que seja um número
        
        let identificador = pizzaJson[modalKey].id+'@'+keyDataPizza

        let key = cart.findIndex((item) => item.identificador == identificador)

        if(key > -1){
            cart[key].qt += modalQt
        }else{
            cart.push({
                identificador,
                id: pizzaJson[modalKey].id,
                keyDataPizza,
                qt: modalQt
            });
        }
        
    }
    updateCart()
    fecharModal();
    
});

//abrir menu pelo mobile
document.querySelector('.menu-openner')!.addEventListener('click', () => {
    if(cart.length > 0){
        document.querySelector('aside')!.style.left = '0'
    }
    document.querySelector('aside .menu-closer')!.addEventListener('click', () => {
        document.querySelector('aside')!.style.left = '100vw'
    })
})

//função para atualizar itens do carrinho
function updateCart(){

    document.querySelector('.menu-openner span')!.innerHTML = `${cart.length}`;

    if(cart.length > 0){
        document.querySelector('aside')?.classList.add('show');
        (document.querySelector('.cart') as HTMLElement)!.innerHTML = ''

        let desconto: number = 0
        let subtotal: number = 0
        let total: number = 0

        cart.map((key, index) => {
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
            subtotal += pizzaItem!.price * key.qt;
        
            // Configurações para exibir o item no carrinho
            let cartItem = document.querySelector('.models .cart--item')?.cloneNode(true) as HTMLElement;
            document.querySelector('.cart')!.append(cartItem);
        
            let pizzaName = `${pizzaItem?.name} (${pizzaSizeName})`;
            cartItem.querySelector('img')?.setAttribute('src', `${pizzaItem?.img}`);
            cartItem.querySelector('.cart--item-nome')!.innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt')!.innerHTML = `${key.qt}`;
        
            // Botões de incrementar e decrementar
            cartItem.querySelector('.cart--item-qtmenos')?.addEventListener('click', () => {
                key.qt = Math.max(0, key.qt - 1);
                if (key.qt < 1) {
                    cart.splice(index, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais')?.addEventListener('click', () => {
                key.qt++;
                updateCart();
            });
        
            // Calcula o desconto total com base na taxa de desconto acumulada
            desconto += pizzaItem!.price * key.qt * descontoRate;
        });
        
         total = subtotal - desconto;
        
        // Exibe os valores na tela
        document.querySelector('.subtotal span:last-child')!.innerHTML = `R$${subtotal.toFixed(2)}`;
        document.querySelector('.desconto span:last-child')!.innerHTML = `R$${desconto.toFixed(2)}`;
        document.querySelector('.total span:last-child')!.innerHTML = `R$${total.toFixed(2)}`;
        

        
    } else {
        document.querySelector('aside')!.classList.remove('show')
        document.querySelector('aside')!.style.left = '100vw'
    }
}