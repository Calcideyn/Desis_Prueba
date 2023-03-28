<?php
// Incluye el Archivo de Connecion a la BD
include ('connection.php');
// Comprueba que venga el Nombre por POST, para realizar el insert del voto
if (isset($_POST['Nombre-Apellido']))
{
// Asigna los valores recibidos por POST a variables
$Nombre_Voto = $_POST['Nombre-Apellido'];
$Alias_Voto = $_POST['Alias'];
$Rut_Voto = $_POST['Rut'];
$Email_Voto = $_POST['Email'];
$ID_Candidato = $_POST['ID_Candidato'];
//Consulta de si hay algun registro de voto con el rut y los cuenta
$sql_rut = "select * from votos where Rut_Voto = ?";
$query = $conexion -> prepare($sql_rut);
$query->execute([$Rut_Voto]);
$count = $query->rowCount();
//consulta si hay algun registro, de ser asi le muestra un error y lo redirecciona
if($count >= 1){
echo "<script>alert('Solo se puede votar una vez');window.location.href = 'index.html'</script>";
}
else{
//al no tener registro de voto con el rut, realiza un insert
$sql_insert = "INSERT INTO votos (Nombre_Voto , Alias_Voto , Rut_Voto , Email_Voto , ID_Candidato) VALUES (?,?,?,?,?)";
$stmt= $conexion->prepare($sql_insert);
$stmt->execute([$Nombre_Voto , $Alias_Voto , $Rut_Voto , $Email_Voto , $ID_Candidato]);
$ID_Voto = $conexion->lastInsertId();
//Obtiene el ultimo ID insertado, e inserta en la tabla de referencia, las referencas
foreach($_POST["referencia"] as $ref) {
    $sql_insert = "INSERT INTO referencia_voto (ID_Voto , Referencia ) VALUES (?,?)";
    $stmt= $conexion->prepare($sql_insert);
    $stmt->execute([ $ID_Voto, $ref ]); 
}
//Alerta que muestra que el voto fue realizado correctamente
echo "<script>alert('Voto realizado correctamente');window.location.href = 'index.html'</script>";

}
}

//Si solo viene por post idRegion, Se consulta las comunas pertenecientas a dicha region y las devuelve en formato Json
else if(isset($_POST['idRegion'])){
   
    $sql_comuna = "SELECT comuna_id, comuna_nombre
    FROM comunas INNER JOIN provincias on comunas.provincia_id = provincias.provincia_id 
    INNER join regiones on regiones.region_id = provincias.region_id where regiones.region_id = :id_region";
     $id_region = $_POST['idRegion'];
     $query = $conexion -> prepare($sql_comuna);
    $query -> execute(array(':id_region' => $id_region));
    $results = $query -> fetchAll(PDO::FETCH_OBJ);
    $json = json_encode($results);
    echo $json;
}
//Si solo viene por post idComuna, Se consulta los candidatos pertenecientas a dicha comuna y las devuelve en formato Json
else if(isset($_POST['idComuna'])){
     $sql_candidato = "SELECT * from candidatos where comuna_id  = :idComuna";
     $id_comuna = $_POST['idComuna'];
     $query = $conexion -> prepare($sql_candidato);
    $query -> execute(array(':idComuna' => $id_comuna));
    $results = $query -> fetchAll(PDO::FETCH_OBJ);
    $json = json_encode($results);
    echo $json;
}
//En caso de no enviar ningun dato por POST, se envia todas las regionces de chile en formato Json
else {
$sql_region = "SELECT * FROM regiones";
$query = $conexion -> prepare($sql_region);
$query -> execute();
$results = $query -> fetchAll(PDO::FETCH_OBJ);
$json = json_encode($results);
echo $json;
}
?>