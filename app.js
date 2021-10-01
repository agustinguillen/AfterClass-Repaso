//------------------APP DE PELICULAS - AFTECLASS DOM--------------------//
const baseUrl = "https://currency-exchange.p.rapidapi.com/exchange";
let calculos = [];
let carritoFake = [];
let fecha = new Date();
let fechaFormato = fecha.toLocaleDateString("es-AR");
let id = Number(localStorage.getItem("proximoID")) || 0;

class Exchange {
  constructor(id, moneda1, moneda2, valor1, valor2, fecha) {
    this.id = id;
    this.moneda1 = moneda1;
    this.moneda2 = moneda2;
    this.valor1 = valor1;
    this.valor2 = valor2;
    this.fecha = fecha;
  }
}

function getCurrency(e) {
  e.preventDefault();
  if ($("#moneda1").val() !== "" || $("#moneda2").val() !== "") {
    const settings = {
      "async": true,
      "crossDomain": true,
      "url": `${baseUrl}?from=${$("#moneda1").val()}&to=${$(
        "#moneda2"
      ).val()}&q=1.0`,
      "method": "GET",
      "headers": {
        "x-rapidapi-key": "dd8c9b746cmsh16c2dbc5f41e74cp1765d2jsnd8b477815ac0",
        "x-rapidapi-host": "currency-exchange.p.rapidapi.com",
      },
    };

    $.ajax(settings).done(function (response) {
      console.log(response);
      let resultado = Number($("#valor1").val()) * Number(response);
      $("#valor2").val(resultado);
      $("#valor2").addClass("input-yellow");
    });
  }
}

function mostrarResultado() {
  let moneda1 = $("#moneda1").val();
  let moneda2 = $("#moneda2").val();
  let valor1 = Number($("#valor1").val());
  let valor2 = Number($("#valor2").val());
  let resultado = new Exchange(id, moneda1, moneda2, valor1, valor2, fechaFormato);
  calculos.push(resultado);
  localStorage.setItem("calculos", JSON.stringify(calculos));
  $("#resultados")
    .append(
      `<div id="${id}" class="resultado"><strong>${valor1} ${moneda1} es igual a ${valor2} ${moneda2}</strong> <span>${fechaFormato}</span><button class="agregar">+</button><button class="eliminar">X</button></div>`
    )
    .hide()
    .fadeIn(500);
  $(".eliminar").click((e) => eliminarResultado(e));
  $(".agregar").click((e) => agregarAlCarrito(e));
  id++;
  localStorage.setItem("proximoID", id);
}

function cargarResultados() {
  let guardados = JSON.parse(localStorage.getItem("calculos"));
  let carritoGuardado = JSON.parse(localStorage.getItem("carrito"));
  carritoFake = carritoGuardado || [];
  console.log(guardados);
  if (guardados !== undefined && guardados !== null) {
    calculos = guardados;
    for (const calculo of calculos) {
      $("#resultados")
        .append(
          `<div id="${calculo.id}" class="resultado"><strong>${calculo.valor1} ${calculo.moneda1} es igual a ${calculo.valor2} ${calculo.moneda2}</strong> <span>${fechaFormato}</span><button class="agregar">+</button><button class="eliminar">X</button></div>`
        )
        .hide()
        .fadeIn(500);
    }
    $(".eliminar").click((e) => eliminarResultado(e));
    $(".agregar").click((e) => agregarAlCarrito(e));
  }
}

function eliminarResultado(e) {
  let elemento = e.target.parentNode;
  $(`#${elemento.id}`).fadeOut(500, function () {
    $(this).remove();
  });
  console.log(e.target.parentNode.id);
  let nuevoCalculos = calculos.filter(
    (item) => item.id !== Number(elemento.id)
  );
  calculos = nuevoCalculos;
  localStorage.setItem("calculos", JSON.stringify(calculos));
}

function agregarAlCarrito(e){
    let elemento = e.target.parentNode;
    let item = calculos.find(i => i.id == elemento.id);
    carritoFake.push(item);
    localStorage.setItem('carrito', JSON.stringify(carritoFake));
}

$(document).ready(function () {
  cargarResultados();
  $("#formulario").submit((e) => {
    getCurrency(e);
  });
  $("#guardar").click(mostrarResultado);
});
