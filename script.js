var totalCarrinho = 0

// criar a variável modalKey sera global
let modalKey = 0

// variavel para controlar a quantidade inicial de pizzas na modal
let quantPizzas = 1

let cart = [] // carrinho

// funcoes auxiliares ou uteis
const seleciona = (elemento) => document.querySelector(elemento)
const selecionaTodos = (elemento) => document.querySelectorAll(elemento)

const formatoReal = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const formatoMonetario = (valor) => {
    if(valor) {
        return valor.toFixed(2)
    }
}

const formatoMonetario1 = (subtotal) => {
    if(subtotal) {
        return subtotal.toFixed(2)
    }
}

const abrirModal = () => {
    seleciona('.pizzaWindowArea').style.opacity = 0 // transparente
    seleciona('.pizzaWindowArea').style.display = 'flex'
    setTimeout(() => seleciona('.pizzaWindowArea').style.opacity = 1, 150)
}

const fecharModal = () => {
    seleciona('.pizzaWindowArea').style.opacity = 0 // transparente
    setTimeout(() => seleciona('.pizzaWindowArea').style.display = 'none', 500)
}

const botoesFechar = () => {
    // BOTOES FECHAR MODAL
    selecionaTodos('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach( (item) => item.addEventListener('click', fecharModal) )
}

const preencheDadosDasPizzas = (pizzaItem, item, index) => {
    // setar um atributo para identificar qual elemento foi clicado
	pizzaItem.setAttribute('data-key', index)
    pizzaItem.querySelector('.pizza-item--img img').src = item.img
    pizzaItem.querySelector('.pizza-item--price').innerHTML = formatoReal(item.price)
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name
    
}

const preencheDadosModal = (item) => {
    seleciona('#um').src = item.img
    seleciona('#dois').src = item.img2
    seleciona('.pizzaInfo h1').innerHTML = item.name
    seleciona('.pizzaInfo--desc').innerHTML = item.description
    seleciona('.pizzaInfo--actualPrice').innerHTML = formatoReal(item.price)
}

const pegarKey = (e) => {
    // .closest retorna o elemento mais proximo que tem a class que passamos
    // do .pizza-item ele vai pegar o valor do atributo data-key
    let key = e.target.closest('.pizza-item').getAttribute('data-key')
    // console.log('Pizza clicada ' + key)
    // console.log(pizzaJson[key])

    // garantir que a quantidade inicial de pizzas é 1
    quantPizzas = 1

    // Para manter a informação de qual pizza foi clicada
    modalKey = key

    return key
}

const preencherTamanhos = (key) => {
    // tirar a selecao de tamanho atual e selecionar o tamanho grande
    //seleciona('.pizzaInfo--size.selected').classList.remove('selected')

    // selecionar todos os tamanhos
    selecionaTodos('.pizzaInfo--size').forEach((size, sizeIndex) => {
        // selecionar o tamanho grande
        (sizeIndex == 0) ? size.classList.add('selected') : ''
        size.querySelector('span').innerHTML = suplementosJson[key].sizes[sizeIndex]
    })
}

const escolherTamanhoPreco = (key) => {
    // Ações nos botões de tamanho
    // selecionar todos os tamanhos
    selecionaTodos('.pizzaInfo--size').forEach((size, sizeIndex) => {
        size.addEventListener('click', (e) => {
            // clicou em um item, tirar a selecao dos outros e marca o q vc clicou
            // tirar a selecao de tamanho atual e selecionar o tamanho grande
            seleciona('.pizzaInfo--size.selected').classList.remove('selected')
            // marcar o que vc clicou, ao inves de usar e.target use size, pois ele é nosso item dentro do loop
            size.classList.add('selected')

            // mudar o preço de acordo com o tamanho
            seleciona('.pizzaInfo--actualPrice').innerHTML = formatoReal(pizzaJson[key].price[sizeIndex])
        })
    })
}

const slider = document.querySelectorAll('.slider');
const btnPrev = document.getElementById('prev-button');
const btnNext = document.getElementById('next-button');

let currentSlide = 0;

function hideSlider() {
  slider.forEach(item => item.classList.remove('on'))
}

function showSlider() {
  slider[currentSlide].classList.add('on')
}

function nextSlider() {
  hideSlider()
  if(currentSlide === slider.length -1) {
    currentSlide = 0
  } else {
    currentSlide++
  }
  showSlider()
}

function prevSlider() {
  hideSlider()
  if(currentSlide === 0) {
    currentSlide = slider.length -1
  } else {
    currentSlide--
  }
  showSlider()
}

btnNext.addEventListener('click', nextSlider)
btnPrev.addEventListener('click', prevSlider)
// console.log(slider)
currentSlide = currentSlide + 1
currentSlide = currentSlide - 1

const mudarQuantidade = () => {
    // Ações nos botões + e - da janela modal
    seleciona('.pizzaInfo--qtmais').addEventListener('click', () => {
        quantPizzas++
        seleciona('.pizzaInfo--qt').innerHTML = quantPizzas
    })

    seleciona('.pizzaInfo--qtmenos').addEventListener('click', () => {
        if(quantPizzas > 1) {
            quantPizzas--
            seleciona('.pizzaInfo--qt').innerHTML = quantPizzas	
        }
    })
}

const adicionarNoCarrinho = () => {
    seleciona('.pizzaInfo--addButton').addEventListener('click', () => {
        // pegar dados da janela modal atual
    	// qual pizza? pegue o modalKey para usar pizzaJson[modalKey]
    	// tamanho
	    let size = seleciona('.pizzaInfo--size.selected').getAttribute('data-key')
        let price = seleciona('.pizzaInfo--actualPrice').innerHTML.replace('R$&nbsp;', '')
        // crie um identificador que junte id e tamanho
	    // concatene as duas informacoes separadas por um símbolo, vc escolhe
	    let identificador = suplementosJson[modalKey].id+'t'+size
        // antes de adicionar verifique se ja tem aquele codigo e tamanho
        // para adicionarmos a quantidade
        let key = cart.findIndex( (item) => item.identificador == identificador )

        if(key > -1) {
            // se encontrar aumente a quantidade
            cart[key].qt += quantPizzas
        } else {
            // adicionar objeto pizza no carrinho
            let pizza = {
                identificador,
                id: suplementosJson[modalKey].id,
                size, // size: size
                qt: quantPizzas,
                price: new Decimal(price.replace(',', '.')), // price: price ou price: parseFloat(price)
                subtotal: 0
            }
            cart.push(pizza)
            // passar o subtotal para variavel global
            // subtotal = (pizza.qt * parseFloat(pizza.price)).toFixed(2)
            pizza.subtotal = pizza.qt * pizza.price
            // console.log("Preço: " + pizza.price, pizza.subtotal)
            // PASSAR O SUBTOTAL
            totalCarrinho = totalCarrinho + pizza.subtotal
        }
        fecharModal()
        abrirCarrinho()
        atualizarCarrinho()
    })
}

const abrirCarrinho = () => {
    if(cart.length > 0) {
	    seleciona('aside').classList.add('show')   // mostrar o carrinho
        seleciona('header').style.display = 'flex' // mostrar barra superior
    }

    // exibir aside do carrinho no modo mobile
    seleciona('.menu-openner').addEventListener('click', () => {
        if(cart.length > 0) {
            seleciona('aside').classList.add('show')
            seleciona('aside').style.left = ''
        }
    })
}

const fecharCarrinho = () => {
    // fechar o carrinho com o botão X no modo mobile
    seleciona('.menu-closer').addEventListener('click', () => {
        seleciona('aside').style.left = '100vw' // usando 100vw ele ficara fora da tela
        seleciona('header').style.display = 'flex'
    })
}

const atualizarCarrinho = () => {
    // exibir número de itens no carrinho
	seleciona('.menu-openner span').innerHTML = cart.length
	
	// mostrar ou nao o carrinho
	if(cart.length > 0) {

		// mostrar o carrinho
		seleciona('aside').classList.add('show')

		// zerar meu .cart para nao fazer insercoes duplicadas
		seleciona('.cart').innerHTML = ''

        // crie as variaveis antes do for
		let subtotal = 0
		let desconto = 0
		let total    = 0

        // para preencher os itens do carrinho, calcular subtotal
		for(let i in cart) {
			// use o find para pegar o item por id
			let pizzaItem = suplementosJson.find( (item) => item.id == cart[i].id )
            // console.log(pizzaItem)
            // em cada item pegar o subtotal
        	subtotal += cart[i].price * cart[i].qt
			// fazer o clone, exibir na telas e depois preencher as informacoes
			let cartItem = seleciona('.models .cart--item').cloneNode(true)
			seleciona('.cart').append(cartItem)

			let pizzaSizeName = cart[i].size
			let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`

			// preencher as informacoes
			cartItem.querySelector('img').src = pizzaItem.img
			cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName
			cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt

			// selecionar botoes + e -
			cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
				// console.log('Clicou no botão mais')
				// adicionar apenas a quantidade que esta neste contexto
				cart[i].qt++
				// atualizar a quantidade
				atualizarCarrinho()
			})

			cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
				// console.log('Clicou no botão menos')
				if(cart[i].qt > 1) {
					// subtrair apenas a quantidade que esta neste contexto
					cart[i].qt--
				} else {
					// remover se for zero
					cart.splice(i, 1)
				}

                (cart.length < 1) ? seleciona('header').style.display = 'flex' : ''

				// atualizar a quantidade
				atualizarCarrinho()
			})

			seleciona('.cart').append(cartItem)

		} // fim do for

		// fora do for
		// calcule desconto 10% e total
		//desconto = subtotal * 0.1
		desconto = subtotal * 0
		total = subtotal - desconto

		// exibir na tela os resultados
		// selecionar o ultimo span do elemento
		seleciona('.subtotal span:last-child').innerHTML = formatoReal(subtotal)
		seleciona('.desconto span:last-child').innerHTML = formatoReal(desconto)
		seleciona('.total span:last-child').innerHTML    = formatoReal(total)

	} else {
		// ocultar o carrinho
		seleciona('aside').classList.remove('show')
		seleciona('aside').style.left = '100vw'
	}
    return cart
}

const finalizarCompra = (cart) => {
    seleciona('.cart--finalizar').addEventListener('click', () => {
        console.log('Finalizar compra')
        gerarCompra(cart)
        seleciona('aside').classList.remove('show')
        seleciona('aside').style.left = '100vw'
        seleciona('header').style.display = 'flex'
    })
}

// MAPEAR pizzaJson para gerar lista de pizzas
suplementosJson.map((item, index ) => {
    //console.log(item)
    let pizzaItem = document.querySelector('.models .pizza-item').cloneNode(true)
    //console.log(pizzaItem)
    //document.querySelector('.pizza-area').append(pizzaItem)
    seleciona('.suplementos-area').append(pizzaItem)

    // preencher os dados de cada pizza
    preencheDadosDasPizzas(pizzaItem, item, index)
    
    // pizza clicada
    pizzaItem.querySelector('.pizza-item a').addEventListener('click', (e) => {
        e.preventDefault()
        // console.log('Clicou na pizza')

        let chave = pegarKey(e)

        // abrir janela modal
        abrirModal()

        // preenchimento dos dados
        preencheDadosModal(item)

        // pegar tamanho selecionado
        preencherTamanhos(chave)

		// definir quantidade inicial como 1
		seleciona('.pizzaInfo--qt').innerHTML = quantPizzas

        // selecionar o tamanho e preco com o clique no botao
        escolherTamanhoPreco(chave)

    })

    botoesFechar()

}) // fim do MAPEAR pizzaJson para gerar lista de pizzas

combosJson.map((item, index ) => {
    //console.log(item)
    let pizzaItem = document.querySelector('.models .pizza-item').cloneNode(true)
    //console.log(pizzaItem)
    //document.querySelector('.pizza-area').append(pizzaItem)
    seleciona('.combos-area').append(pizzaItem)

    // preencher os dados de cada pizza
    preencheDadosDasPizzas(pizzaItem, item, index)
    
    // pizza clicada
    pizzaItem.querySelector('.pizza-item a').addEventListener('click', (e) => {
        e.preventDefault()
        // console.log('Clicou na pizza')

        let chave = pegarKey(e)

        // abrir janela modal
        abrirModal()

        // preenchimento dos dados
        preencheDadosModal(item)

        // pegar tamanho selecionado
        preencherTamanhos(chave)

		// definir quantidade inicial como 1
		seleciona('.pizzaInfo--qt').innerHTML = quantPizzas

        // selecionar o tamanho e preco com o clique no botao
        escolherTamanhoPreco(chave)

    })

    botoesFechar()

})

// aula 05
// mudar quantidade com os botoes + e -
mudarQuantidade()
// /aula 05

// aula 06
adicionarNoCarrinho()
const carrinho = atualizarCarrinho() 
fecharCarrinho()
finalizarCompra(carrinho)

let compra = []
let mensagem = 'Olá, gostaria de comprar os seguintes produtos:'

function gerarCompra(carrinho) {
    carrinho.map((item, posicao,) => {
        console.log(item)
        compra[posicao] = {
          id: item.id,
          nome: suplementosJson[item.id-1].name,
          preco: parseFloat(item.price),
          qtd: item.qt,
          tam: item.size,
          subtotal: item.qt * parseFloat(item.price) - (item.qt * parseFloat(item.price) * 0),
        }
    })
    console.log(compra)
    compra.forEach(item => {
        mensagem += `
        ${item.nome}
        Quant:${item.qtd}
        Preço:${item.preco}
        SubTotal: ${item.subtotal.toFixed(2)}
        `
    })
    const subTotais = carrinho.map((item) => {
        return item.subtotal
    })
    const totalGeral = subTotais.reduce((acumulador, valor) => {
        return acumulador + valor
    })
    // APLICAR DESCONTO NO VALOR DO REDUCE
    const totalComDesconto = totalGeral - (totalGeral * 0)
    // enviar para o WhatsApp
    // mensagem e total da compra
    window.open(`https://wa.me/5598986080351?text=${mensagem} TOTAL: ${totalComDesconto.toFixed(2)}`,"_blank")
}
