console.log('TAREAS')

function obtenerTareas() {

  $.ajax({
    url : '../../Tareas/ObtenerTareas',
    type : 'GET',
    dataType : 'json',
    success : function(resultado) {
      if(resultado){
        const tBody = document.getElementById('tBody');
        tBody.innerHTML = ''

        resultado.forEach(tarea => {
          let acciones = `
            <button class="btn btn-primary" onclick="setearTarea(${tarea.tareaID})"> Editar </button>
            <button class="btn btn-danger" onclick="eliminarTarea(${tarea.tareaID})"> 
              Deshabilitar
            </button>
          `;

          if(tarea.eliminada){
            acciones = `<button class="btn btn-success" onclick="eliminarTarea(${tarea.tareaID})">
              Habilitar
            </button>`
          }

          const coloresPrioridad = ['danger', 'warning', 'info']
          const colorPrioridad = coloresPrioridad[tarea.prioridad];

          tBody.innerHTML += `
            <tr class="${tarea.realizada ? 'tarea-completada' : ''}">  
                <td> ${tarea.descripcion} </td>
                <td> ${tarea.fechaFormateada} </td>
                <td> 
                    <span class="badge bg-${colorPrioridad}"> ${tarea.prioridadString} </span>
                </td>
                <td>
                  <label>
                    <input type="checkbox" ${tarea.realizada ? 'checked' : ''} onchange="completarTarea(${tarea.tareaID});" ${tarea.eliminada ? 'disabled' : ''} />
                    Listo
                  </label>
                </td>
                <td> ${acciones} </td>
            </tr>
          `;
          
        });
      }
    },
    error: function (error){
      console.log(error)
    }
  })
}

function guardarTarea() {
  const nuevaTarea = {
    tareaId: $('#tareaId').val(),
    descripcion: $('#descripcion').val(),
    fecha: $('#fecha').val(),
    prioridad: $('#prioridad').val()
  }

  console.log(nuevaTarea)

  $.ajax({
    url : '../../Tareas/GuardarTarea',
    data : nuevaTarea,
    type : 'POST',
    dataType : 'json',
    success : function(resultado) {
      if(resultado === 1){
        obtenerTareas()
        $('#modal').modal('hide');
      }
    },
    error: function (error){
      console.log(error)
    }
  })
}

function setearTarea(tareaId) {
  if(tareaId){
    $.ajax({
      url: '../../Tareas/ObtenerTareas',
      type: 'GET',
      data: {
        tareaId: tareaId
      },
      dataType: 'json'
    })
    .done(function (tareas){
      if(tareas && tareas.length > 0){
        const tarea = tareas[0];
        console.log(tarea);
        
        $('#modal').modal('show');

        $('#tareaId').val(tarea.tareaID);
        $('#descripcion').val(tarea.descripcion);
        $('#fecha').val(tarea.fechaFormateada);
        $('#prioridad').val(tarea.prioridad);
      }
    })
    .fail(function (error){
      console.log(error)
    })
  }
}

function eliminarTarea(tareaId){
  if(tareaId){
    $.ajax({
      url: '../../Tareas/EliminarTarea',
      type: 'POST',
      data: {
        tareaId: tareaId
      },
      dataType: 'json'
    })
    .done(function (seElimino){
      console.log(seElimino);
      obtenerTareas();
      
      if(seElimino){
        alert('TAREA ELIMINADA')
      } else {
        alert('TAREA HABILITADA')  
      }
      
    })
    .fail(function (error){
      console.log(error)
    })
  }
}

function completarTarea(tareaId){
  if(tareaId){
    $.ajax({
      url: '../../Tareas/CompletarTarea',
      type: 'POST',
      data: {
        tareaId: tareaId
      },
      dataType: 'json'
    })
    .done(function (resultado){
      console.log(resultado);
      
      if(resultado){
        obtenerTareas();
        alert('TAREA COMPLETADA!')
      } 
      
    })
    .fail(function (error){
      console.log(error)
    })
  }
}

window.onload = obtenerTareas();