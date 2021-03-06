const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedasSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario')
const resultado = document.querySelector('#resultado')

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

//Crear promise
const obtenerCriptos = criptomoneda => new Promise( resolve =>{     resolve(criptomoneda)
})

document.addEventListener('DOMContentLoaded', () =>{
    consultarCriptomonedas()

    formulario.addEventListener('submit', submitFormulario)

    criptomonedasSelect.addEventListener('change', leerValor)
    monedasSelect.addEventListener('change', leerValor)
})


function consultarCriptomonedas(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD'

    fetch(url)
        .then( respuesta => respuesta.json())
        .then( resultado => obtenerCriptos(resultado.Data))
        .then( criptomonedas =>selectCriptos(criptomonedas))
        .catch(error => console.log(error))
}

function selectCriptos(criptomonedas){
    criptomonedas.forEach(cripto => {
        const { FullName , Name} = cripto.CoinInfo

        const option = document.createElement('option')
        option.value = Name
        option.textContent = FullName
        criptomonedasSelect.appendChild(option)

    })
}

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value
}

function submitFormulario(e){
    e.preventDefault();

    //validar

    const {moneda, criptomoneda} = objBusqueda

    if( moneda === '' || criptomoneda ===''){
        mostrarAlerta('Ambos campos son oobligatorios')
        return
    }

    //Consultar API
    consultarAPI()
}

function mostrarAlerta(mensaje){
    const existeError = document.querySelector('.error')

    if( existeError){
        const divMensaje = document.createElement('div')
        divMensaje.classList.add('error')
    
        //Mensaje de error
    
        divMensaje.textContent = mensaje
    
        formulario.appendChild(divMensaje)
    
        setTimeout( () => {
            divMensaje.remove()
        },3000)
    }
   
}

function consultarAPI(){
    const { moneda, criptomoneda} = objBusqueda

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`

    mostrarSpinner()

    fetch(url)
        .then( respuesta => respuesta.json() )
        .then( cotizacion => {mostrarCotizacion(cotizacion.DISPLAY[criptomoneda][moneda])
        })
}

function mostrarCotizacion(cotizacion){

    limpiarHTML()

    console.log(cotizacion);
    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR ,LASTUPDATE} = cotizacion
    
    const precio = document.createElement('p')
    precio.classList.add('precio')
    precio.innerHTML = `
        El precio es: <span>${PRICE}</span>
    `

    const precioAlto = document.createElement('p')
    precioAlto.innerHTML = ` <p>Precio mas alto del dia: <span>${HIGHDAY} </span></p>`

    const precioBajo = document.createElement('p')
    precioBajo.innerHTML = ` <p>Precio mas bajoo del dia: <span>${LOWDAY} </span></p>`

    const ultimasHoras = document.createElement('p')
    ultimasHoras.innerHTML = ` <p>Variacion ultimas 24hs: <span>${CHANGEPCT24HOUR}% </span></p>`

    const ultimaActualizacion = document.createElement('p')
    ultimaActualizacion.innerHTML = ` <p>Ultima actualizacion: <span>${LASTUPDATE} </span></p>`

    resultado.appendChild(precio)
    resultado.appendChild(precioAlto)
    resultado.appendChild(precioBajo)
    resultado.appendChild(ultimasHoras)
    resultado.appendChild(ultimaActualizacion)

    formulario.appendChild(resultado);
}


function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
}

function mostrarSpinner(){
    limpiarHTML()
    const spinner = document.createElement('div')

    spinner.classList.add('spinner')

    spinner.innerHTML = `
        
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
        
    `
    resultado.appendChild(spinner)
}