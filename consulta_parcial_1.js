use("tareas");

db.tarea.aggregate([
    {
        $lookup:{
            from: "estado_tarea",
            localField:"id_estado_tarea",
            foreignField:"_id",
            as: "est_tar",
        }
    },
    {
        $unwind: "$est_tar"
    },
    {
        $lookup: {
          from: "responsable",
          localField: "id_responsable",
          foreignField: "_id",
          as: "resp"
        }
    },
    {
        $unwind: "$resp"
    },
    {
        $lookup: {
          from: "proyecto",
          localField: "id_proyecto",
          foreignField: "_id",
          as: "proy"
        }
    },
    {
        $unwind:"$proy"
    },
    {
        $match:{  
            
            $and:[{"est_tar.estado_tarea":"Vencida"},{$or:[{"resp.edad":{$gte:57}},{"resp.edad":{$lte:25}}]}]
                            
        }
    },
    {
        $project: {
            _id: 0,
            nombre_tarea: 1,
            estado_tarea: "$est_tar.estado_tarea",
            nombre_proyecto: "$proy.nombre_proyecto",
            nombre_responsable: "$resp.nombre_responsable",
            apellido_responsable:"$resp.apellido_responsable",
            edad:"$resp.edad",
            grupo_etareo:{
                $cond:{
                    if:{$and:[{$gt:["$resp.edad",17]},{$lte:["$resp.edad",30]}]},
                    then:"adulto joven",
                    else:{
                        $cond:{
                            if:{$and:[{$gt:["$resp.edad",30]},{$lte:["$resp.edad",50]}]},
                            then:"Adulto medio",
                            else:"Adulto mayor"
                        }
                    }
                }
            }
            

        }
    },
    {
        $sort:{nombre_responsable:1}
    },

])

/*
De la base de datos "tareas", crear una consulta 
 de las diferentes colecciones  de tal forma que los 
datos apreciados sean consistentes y tengan relación entre sí.

La consulta debe reflejar:

El nombre de la tarea, el estado de la terea, el nombre del proyecto asociado
a esa tarea, el nombre del responsable de esa tarea, el apellido del responsble asocido
a esa tarea, la edad del responsble y debe indicar su grupo etareo así:
Si es mayor de 17 años y menor igual a 30 el grupo etareo debe decir: "adulto joven".
Si es mayor de 30 y menor igual  50 entonces el grupo etareo debe decir: "adulto medio".
Si es mayor de 50 el grupo etareo dirá "adulto mayor".
Aunque se debe programar el estado de la tarea: Terminada, Pendiente o Vencida
de acuerdo a como lo indique la colección de la  BD, 
en un match solo se traerán las treas que hayan sido vencidas. En caso de 
comentarse el match se deberán ver las otras tareas que tanto las pendientes como las terminadas:
aplica para los otros campos que se está solicitando.

A continuación un ejemplo de unos supuestos datos, suponiendo que es un solo documento el que retorna la consulta,
aunque en realidad el estudiante mediante el análisis sabrá si es relmente uno o más documentos.

 {
    "nombre_tarea": "Tarea 19",
    "estado_tarea": "Vencida",
    "nombre_proyecto": "Estudio de suelos en Mocoa en pro de construcción de edificiós de más de 20 pisos",
    "nombre_responsable": "Belinda",
    "apellido_responsable": "Aragón",
    "edad": 23,
    "grupo_etareo": "adulto joven"
  }

  La consulta se debe ordenar alfabéticamente por el nombre del responsable

*/