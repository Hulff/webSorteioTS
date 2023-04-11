let link = "https://web-sorteio-ts.vercel.app/getData"
let main = document.getElementById("main")
let h1 = document.getElementById("h1")
link = link+"getData"
console.log(link)

function searchData() {
fetch(link).then((response => response.json())).then( data =>{
    console.log(data)
    createList(data) 
    h1.innerHTML = "Número de inscritos = "+data.length
})
}
setTimeout(searchData(),500)

function createList(dado) {
    for(i=0;i<dado.length;i++) {
        let div = document.createElement("div")
        let h1 = document.createElement("h2")
        let h2 = document.createElement("h2")
        let h3 = document.createElement("h2")
        div.classList.add("divData")
        console.log(dado[i].nome)
        h2.innerHTML = "Nome:  "+ dado[i].nome
        console.log(dado[i].instagram)
        h1.innerHTML = "@ do Instagram:  "+dado[i].instagram
        console.log(dado[i].nInscricao)
        h3.innerHTML = "Numero de Inscrição:  "+dado[i].nInscricao
        div.appendChild(h2)
        div.appendChild(h1)
        div.appendChild(h3)
        main.appendChild(div)
    }
}