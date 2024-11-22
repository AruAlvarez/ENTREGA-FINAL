

function multiplicar(valor1, valor2) {
    return valor1 * valor2
}

function sumaTotal() {
    let table = document.getElementById('tabla')
    let total = 0
    for (let i = 1; i < table.rows.length - 1; i++) {
        total += parseInt(table.rows[i].cells[2].innerText)
    }
    table.rows[table.rows.length - 1].cells[2].innerText = total;
}

async function reservar() {
    const { value: email } = await Swal.fire({
        title: "Estás a un paso de tus próximas vacaciones!",
        input: "email",
        inputLabel: "Recibirás por email la confirmación de tu reserva y los próximos pasos a seguir",
        inputPlaceholder: "Ingresá tu dirección de email"
    });
    if (email) {
        Swal.fire(`Información enviada: ${email}`);
        deleteAllRows()
        document.getElementById('container2').innerHTML = ''
        document.getElementById('container3').innerHTML = ''
        document.getElementById('container4').innerHTML = ''
    }
}

document.getElementById('reservar').onclick = () => {
    reservar()
}

document.getElementById('limpiar').onclick = () => {
    limpiar()
}

function limpiar(){
    localStorage.clear()
    deleteAllRows()
    document.getElementById("container4").style = "display:none"
}

function deleteAllRows() {
    const tabla = document.getElementById('tabla');
    const tbody = tabla.getElementsByTagName('tbody')[0];

    while (tbody.rows.length > 0) {
        tbody.deleteRow(0);
    }
    tabla.rows[tabla.rows.length - 1].cells[2].innerText = ""
}

fetch('./js/destinos.json')
.then(response => response.json())
.then(data => data.forEach(el => {
    const card = document.createElement("div");
    const destino = document.createElement("p");
    const precio = document.createElement("p");
    const boton = document.createElement("button");

    card.className = "destino-card"
    card.id = el.id

    destino.innerText = el.destino;
    precio.innerText = `Desde $ ${el.precio}`;
    boton.innerText = "Quiero ir"
    boton.className="btn btn-outline-success"

    card.appendChild(destino);
    card.appendChild(precio)
    card.appendChild(boton)

    container.appendChild(card)

    boton.onclick = () => {
        limpiar()
        mostrarOpciones(el)
        localStorage.setItem("destino", JSON.stringify(el))
    
        
    };

}
)
)

function mostrarOpciones(el){
    const card2 = document.createElement("div");
        const tittle = document.createElement("p");
        const fecha = document.createElement("select");
        const option = document.createElement("option");
        const option2 = document.createElement("option");
        const cantidad = document.createElement("input");
        const boton2 = document.createElement("button");

        
        boton2.addEventListener("click", () =>
            swal.fire({
                position: "top-end",
                icon: "success",
                title: "Agregado",
                showConfirmButton: false,
                timer: 1500
            })
        )

        boton2.onclick = () => {
            addRow(el.destino, cantidad.value, multiplicar(cantidad.value, el.precio))
            document.getElementById("container4").style = "display:block"
        }


        card2.className = "aereo-card"

        tittle.innerText = "Elegí fecha de salida e indicá cantidad de pasajeros"
        option.value = el.fecha1
        option2.value = el.fecha2
        option.text = el.fecha1
        option2.text = el.fecha2
        boton2.innerText = "Agregar"
        boton2.className="btn btn-outline-success"
        cantidad.type = "number" 
        cantidad.min = "1"
        cantidad.max = "9"
        cantidad.value= 1

        card2.appendChild(tittle);
        card2.appendChild(fecha);
        card2.appendChild(cantidad);
        fecha.appendChild(option);
        fecha.appendChild(option2);
        card2.appendChild(boton2)

        container2.innerHTML = ""; 
        container2.appendChild(card2)
        container3.innerHTML = ""; 
        fetch('./js/extras.json')
        .then(response => response.json())
        .then(data => data.forEach(el => {
        
            const card3 = document.createElement("div");
            const extra = document.createElement("p");
            const precioExtra = document.createElement("p");
            const cantidadExtra = document.createElement("input")
            const boton3 = document.createElement("button");

      

            boton3.onclick = () => {
                if(cantidadExtra.value == 0){
                    Swal.fire({
                        title: "Alerta",
                        text: "Debe introducior un valor mayor a cero.",
                        icon: "error"
                    });
                }else{
                    addRow(el.extra, cantidadExtra.value, multiplicar(cantidadExtra.value, el.precioExtra))
                    swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Agregado",
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
                 
            }

            card3.className = "extra-card"
            card3.id = el.id
            
            extra.innerText = el.extra;
            precioExtra.innerText = `Desde $ ${el.precioExtra}`;
            boton3.innerText = "Agregar";
            boton3.className="btn btn-outline-success"
            cantidadExtra.type = "number"
            cantidadExtra.min = 1
            cantidadExtra.value = 0
            card3.appendChild(extra);
            card3.appendChild(precioExtra);
            card3.appendChild(cantidadExtra)
            card3.appendChild(boton3)
            container3.appendChild(card3)

        })
    )
}

function eliminarfila(row) {
    Swal.fire({
        title: "Estás seguro?",
        text: "Se eliminarán los servicios de tu carrito",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#052bd3",
        cancelButtonColor: "#ff0000",
        confirmButtonText: "Si, eliminar!"
    }).then((result) => {
        if (result.isConfirmed) {
            document.getElementById('tabla').deleteRow(row)
            sumaTotal()

            Swal.fire({
                title: "Eliminado",
                text: "Si te arrepentis, podes volver a reservarlo.",
                icon: "success"
            });
        }
    })
}

function addRow(valor, valor1, valor2) {
    var linea =  '<td>' + valor + '</td><td>' + valor1 + '</td><td>' + valor2 + '</td><td><button type="button" class="eliminar" onclick="eliminarfila(this.parentNode.parentNode.rowIndex)">Eliminar</button></td>'
    document.getElementById('tbody').insertRow(-1).innerHTML = linea
    sumaTotal()


    var carro = localStorage.getItem("carrito")
    linea = '<tr>'  + linea + '<tr>'
    if( localStorage.getItem("carrito"))
        localStorage.setItem("carrito", carro + linea)
    else
        localStorage.setItem("carrito", linea)
    
}

if (localStorage.getItem("carrito")) {
    document.getElementById("container4").style = "display:block"
    document.getElementById('tbody').innerHTML = localStorage.getItem("carrito")
    mostrarOpciones(JSON.parse( localStorage.getItem("destino")))

} 