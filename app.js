const selectCurrencyOne = document.querySelector(".currency-base-one")
const selectCurrencyTwo = document.querySelector(".currency-base-two")
const conversionRate = document.querySelector(".conversion-rate")
const valueCurrencyOne= document.querySelector(".value-currency-one")
const valueCurrencyTwo = document.querySelector(".value-currency-two")
const contentMessage = document.querySelector(".content-message")
const arrow = document.querySelector(".image")

let dataCurrency 

const getUrl = (base)=>`https://v6.exchangerate-api.com/v6/80f86a50579c06c75265fb9a/latest/${base}`
 
const getDataConversion = async (base) =>{

    try{
        let resp = await fetch(getUrl(base))
        dataCurrency = await resp.json()


        if (!resp.ok){
            throw new Error("Não foi possível realizar a conversão")
        }
    }
    catch(err){
    
        contentMessage.textContent = err.message
        contentMessage.classList.add("error-message")
        setTimeout(()=>{
            contentMessage.innerHTML = ""
            contentMessage.classList.remove("error-message")
        }, 3000)
    }
   

}
const getConversionRate = () =>{
    let baseOne = selectCurrencyOne.value
    let baseTwo = selectCurrencyTwo.value
    let valueConverted = dataCurrency.conversion_rates[baseTwo]

    
    conversionRate.innerHTML = 
    `<p class = "text-conversion-rate"> 1 ${baseOne} é equivalente a <strong>${ 1 * valueConverted.toFixed(2)} 
    ${baseTwo}</strong></p>`
    
}



const changeSelectCurrencyOne = async (e) => {
    await getDataConversion(e.target.value)

    arrow.classList.add("image-rotate")
    setTimeout( () => {
         arrow.classList.remove("image-rotate")
    }, 1000);
    getConversionRate()
    valueCurrencyOne.value = "1"
    valueCurrencyTwo.textContent = dataCurrency.conversion_rates[selectCurrencyTwo.value].toFixed(2)
}


const changeSelectCurrencyTwo = () => {
    arrow.classList.add("image-rotate")
    setTimeout( () => {
         arrow.classList.remove("image-rotate")
    }, 1000);
    getConversionRate()
    valueCurrencyOne.value = "1"
    valueCurrencyTwo.textContent = dataCurrency.conversion_rates[selectCurrencyTwo.value].toFixed(2)
}

const getValueConverted = (e) => {
 
    if(e.target.value == ""){
        valueCurrencyTwo.textContent = ""
    }

    else{
        let rate = selectCurrencyTwo.value
        valueCurrencyTwo.textContent = e.target.value * dataCurrency.conversion_rates[rate].toFixed(2)
    }
 
}

const fillOptionsCurrency = (baseSelected) => {
    let bases = Object.keys(dataCurrency.conversion_rates)
    let basesTags = bases.map(base => 
        `<option ${base === baseSelected ? "selected" : ""}>${base}</option>`
    ).join("")

    return basesTags

}



const init = async (base) => {

    await getDataConversion(base)
    selectCurrencyOne.innerHTML = fillOptionsCurrency("BRL")
    selectCurrencyTwo.innerHTML = fillOptionsCurrency("USD")
    getConversionRate()
}


init("BRL")


valueCurrencyOne.addEventListener("input", getValueConverted)
selectCurrencyOne.addEventListener("change", changeSelectCurrencyOne)
selectCurrencyTwo.addEventListener("change", changeSelectCurrencyTwo)
