const selectCurrencyOne = document.querySelector(".currency-base-one")
const selectCurrencyTwo = document.querySelector(".currency-base-two")
const conversionRate = document.querySelector(".conversion-rate")
const valueCurrencyOne= document.querySelector(".value-currency-one")
const valueCurrencyTwo = document.querySelector(".value-currency-two")
const contentMessage = document.querySelector(".content-message")
const pLastUpdate = document.querySelector(".last-update")
const image = document.querySelector(".image")


const dataState = (() => {

    let dataCurrency = {}

    return{
        setData: (data) => {
            dataCurrency = data
            console.log(dataCurrency)
           
        },

        getData: () => dataCurrency
    }

})()


const getUrl = (base)=>`https://v6.exchangerate-api.com/v6/80f86a50579c06c75265fb9a/latest/${base}`
 
//Apresenta mensagem de erro quando não é possivel converter os valores
const showErrorMessage = (err) => {

    contentMessage.textContent = err.message
    contentMessage.classList.add("error-message")

    setTimeout(()=>{
        contentMessage.innerHTML = ""
        contentMessage.classList.remove("error-message")
    }, 3000)
}

//Busca os dados na API e atualiza o estado do objeto com as informações de converção
const getDataConversion = async (base) =>{

    try{
        let resp = await fetch(getUrl(base))

        let data = await resp.json()

        dataState.setData(data)


        if (!resp.ok){
            throw new Error("Não foi possível realizar a conversão")
        }
    }
    catch(err){
        showErrorMessage(err)
        
    }
   

}

//Calcula e mostra a taxa de conversão entre as moedas escolhidas 
const getConversionRate = () =>{

    let baseOne = selectCurrencyOne.value
    let baseTwo = selectCurrencyTwo.value
    let valueConverted =  dataState.getData().conversion_rates[baseTwo]

    conversionRate.innerHTML = 
    `<p class = "text-conversion-rate"> 1 ${baseOne} é equivalente a <strong>
    ${ 1 * valueConverted.toFixed(2)} ${baseTwo}</strong></p>`

    pLastUpdate.textContent = ` Ultima atualização: ${dataState.getData().time_last_update_utc}`
    
}


//Seta o valor padrão das moedas a a ser convertido
const setValueCurrencys = () => {

    valueCurrencyOne.value = "1"
    valueCurrencyTwo.textContent =  
        dataState.getData().conversion_rates[selectCurrencyTwo.value].toFixed(2)
}

//Escutador de evento do select da primeira moeda
const changeSelectCurrencyOne = async (e) => {

    await getDataConversion(e.target.value)

    image.classList.add("image-rotate")
    setTimeout( () => {
         image.classList.remove("image-rotate")
    }, 1000);

    getConversionRate()
    setValueCurrencys()
}


//Escutador de evento do select da segunda moeda
const changeSelectCurrencyTwo = () => {

    image.classList.add("image-rotate")

    setTimeout( () => {
         image.classList.remove("image-rotate")
    }, 1000);

    getConversionRate()
    setValueCurrencys()
}


//Escutador de eventos do input do valor a ser convertido
const changeValueConverted = (e) => {
 
    if(e.target.value == ""){
        valueCurrencyTwo.textContent = ""
    }

    else{
        let rate = selectCurrencyTwo.value
        valueCurrencyTwo.textContent = 
        e.target.value *  dataState.getData().conversion_rates[rate].toFixed(2)
    }
 
}

//Carrega as opções do select com a base das moedas
const fillOptionsCurrency = (baseSelected) => {

    let bases = Object.keys(dataState.getData().conversion_rates)

    let basesTags = bases.map(base => 
        `<option ${base === baseSelected ? "selected" : ""}>${base}</option>`
    ).join("")

    return basesTags

}

//Inicia a aplicação
const init = async (base) => {

    await getDataConversion(base)
    
    selectCurrencyOne.innerHTML = fillOptionsCurrency("BRL")
    selectCurrencyTwo.innerHTML = fillOptionsCurrency("USD")

    getConversionRate()
}


init("BRL")


valueCurrencyOne.addEventListener("input", changeValueConverted)
selectCurrencyOne.addEventListener("change", changeSelectCurrencyOne)
selectCurrencyTwo.addEventListener("change", changeSelectCurrencyTwo)
