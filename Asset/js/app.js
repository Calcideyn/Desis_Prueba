//Numeros necesarios para la exprecion regular, utilizada en validar Alias
var numeros = "0123456789";
//Funcion utilizada al momento de votar, comporobar datos y enviar formulario
function Votar() {
  if (validarNombre() != true) {
    alert("Por favor ingrese su Nombre y Apellido");
  }
  if (validarAlias() != true) {
    alert("El Alias debe ser de minimo 5 caracteres y poseer números");
  }
  if (validarEmail() != true) {
    alert("El correo Electronico no es valido");
  }
  if (
    validarNombre() != true &&
    validarAlias() != true &&
    validarEmail() != true
  ) {
    document.getElementById("Formulario_Votacion").submit();
  }
}
//Funcion que valida que el nombre no este en vacio 
function validarNombre() {
  var TextoNombre = document.getElementById("Nombre-Apellido").value;
  if (TextoNombre != "") {
    return true;
  } else {
    return false;
  }
}
//Funcion que valida que el alias sea de minimo 5 texto
//recorre la cadena de texto y revisa que tenga minimo 1 numero
function validarAlias() {
  var Alias = document.getElementById("Alias").value;
  var CantidadLetras = Alias.length;
  var NumerosTexto = 0;
  for (i = 0; i < Alias.length; i++) {
    if (numeros.indexOf(Alias.charAt(i), 0) != -1) {
      NumerosTexto++;
    }
  }
  if (NumerosTexto >= 1 && CantidadLetras >= 5) {
    return true;
  } else {
    return false;
  }
}
//Funcion CheckRut, utilizada para revisar y dar formato a rut
function checkRut(rut) {
  // Despejar Puntos
  var valor = rut.value.replace(".", "");
  // Despejar Guión
  valor = valor.replace("-", "");

  // Aislar Cuerpo y Dígito Verificador
  cuerpo = valor.slice(0, -1);
  dv = valor.slice(-1).toUpperCase();

  // Formatear RUN
  rut.value = cuerpo + "-" + dv;

  // Si no cumple con el mínimo ej. (n.nnn.nnn)
  if (cuerpo.length < 7) {
    rut.setCustomValidity("RUT Incompleto");
    return false;
  }

  // Calcular Dígito Verificador
  suma = 0;
  multiplo = 2;

  // Para cada dígito del Cuerpo
  for (i = 1; i <= cuerpo.length; i++) {
    // Obtener su Producto con el Múltiplo Correspondiente
    index = multiplo * valor.charAt(cuerpo.length - i);

    // Sumar al Contador General
    suma = suma + index;

    // Consolidar Múltiplo dentro del rango [2,7]
    if (multiplo < 7) {
      multiplo = multiplo + 1;
    } else {
      multiplo = 2;
    }
  }

  // Calcular Dígito Verificador en base al Módulo 11
  dvEsperado = 11 - (suma % 11);

  // Casos Especiales (0 y K)
  dv = dv == "K" ? 10 : dv;
  dv = dv == 11 ? 0 : dv;

  // Validar que el Cuerpo coincide con su Dígito Verificador
  if (dvEsperado != dv) {
    rut.setCustomValidity("RUT Inválido");
    return false;
  }

  // Si todo sale bien, eliminar errores (decretar que es válido)
  rut.setCustomValidity("");
}
//Funcion que valida el Email y con una exprecion regular revisa el formato del Email
function validarEmail() {
  var email = document.getElementById("Email");

  var validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;

  if (validEmail.test(email.value)) {
    return true;
  } else {
    return false;
  }
}
//Funcion en Ajax, que al momento de cargar la pagina, busca todas las regiones de chile en la BD
//las carga en el select con ID region
$(document).ready(function () {
  $.ajax({
    url: "Asset/PHP/app.php",
    dataType: "json",
      success: function (data) {
      $.each(data, function (index, item) {
        $("#region").append(
          "<option value='" +
            item.region_id +
            "'>" +
            item.region_nombre +
            "</option>"
        );
      });
    },
  });
});
//Funcion en Ajax, que al momento de seleccionar una region, todas las comunas correspondientes
// a dicha region  se cargan en el select con ID comuna desde la BD
function getComuna() {
  idRegion = $("#region").find(":selected").val();
  $.ajax({
    type: "POST",
    url: "Asset/PHP/app.php",
    dataType: "json",
    data: { idRegion },
    success: function (data) {
      $("#comuna").empty();
      $("#comuna").append("<option>Seleccione Comuna</option>");
      $.each(data, function (index, item) {
        $("#comuna").append(
          "<option value='" +
            item.comuna_id +
            "'>" +
            item.comuna_nombre +
            "</option>"
        );
      });
    },
  });
}
//Funcion en Ajax, que al momento de seleccionar una comuna, se carga todos los Candidatos que posee
// a dicha comuna desde la BD
function getCandidato() {
  idComuna = $("#comuna").find(":selected").val();
  $.ajax({
    type: "POST",
    url: "Asset/PHP/app.php",
    dataType: "json",
    data: { idComuna },
    success: function (data) {
      $("#candidato").empty();
      $.each(data, function (index, item) {
        $("#candidato").append(
          "<option value='" +
            item.id_candidato +
            "'>" +
            item.Nombre_cadidato +
            "</option>"
        );
      });
    },
  });
}
//Funcion que revisa que no se tengan mas de 2 referencias seleccionadas
$(".referencia").click(function () {
  var checked = $(".referencia:checked").length;

  if (checked > 2) {
    this.checked = false;
  } else {
    if (this.checked) {
      this.checked = true;
    }
  }
});
