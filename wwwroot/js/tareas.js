console.log('TAREAS')

function limpiarFormulario() {
  $('#tareaId').val(0);
  $('#prioridad').val(-1);
  document.getElementById('modalForm').reset();
} 


$('#modal').on('hide.bs.modal', function (event) {
  const tareaId = $('#tareaId').val()

  if(tareaId !== '0'){
    limpiarFormulario()
  }
})

$('#modal').on('shown.bs.modal	', function (event) {
  const tareaId = $('#tareaId').val()
  
  document.querySelector('.modal-title').innerText = (tareaId === '0' ? 'Nueva tarea' : 'Actualizar tarea');
})

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
            ${!tarea.realizada 
                ? `<button class="btn btn-primary" onclick="setearTarea(${tarea.tareaID})"> Editar </button>` : ''
            }
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
            <tr class="${tarea.realizada ? 'bg-danger text-decoration-line-through' : ''}" style="--bs-bg-opacity: .4;" >  
                <td> ${tarea.descripcion} </td>
                <td> ${tarea.fechaFormateada} </td>
                <td> 
                    <span class="badge bg-${colorPrioridad} ${tarea.realizada ? 'text-decoration-line-through' : ''} "> ${tarea.prioridadString} </span>
                </td>
                <td class="text-center">
                  <label class="form-check ">
                    <input type="checkbox" ${tarea.realizada ? 'checked' : ''} onchange="completarTarea(${tarea.tareaID});" ${tarea.eliminada ? 'disabled' : ''} class="form-check-input" />
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

  if(nuevaTarea.descripcion.trim() === '' || nuevaTarea.fecha.trim() === '' || nuevaTarea.prioridad === '-1'){
    alert('Complete los campos requeridos')
  }

  $.ajax({
    url : '../../Tareas/GuardarTarea',
    data : nuevaTarea,
    type : 'POST',
    dataType : 'json',
    success : function(resultado) {
      if(resultado == 2){
        alert('Ya tienes una tarea con esa descripcion')
        return;
      }

      if(resultado === 1){
        obtenerTareas()
        limpiarFormulario();
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

window.onload = function () {
  obtenerTareas();

  const selectPrioridades = document.getElementById('prioridad')
  selectPrioridades.insertAdjacentHTML(
    "afterbegin", 
    `<option value="-1" selected> --- SELECCIONE UNA PRIORIDAD ---  </option>`
  );

}