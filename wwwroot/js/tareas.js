console.log('TAREAS')

function obtenerTareas() {

  $.ajax({
    url : '../../Tareas/ObtenerTareas',
    type : 'GET',
    dataType : 'json',
    success : function(resultado) {
      if(resultado){
        console.log(resultado);
        const listTask = document.getElementById('list-task')
        const bgPrioridades = ['bg-danger', 'bg-warning', 'bg-info']

        const tareas = resultado.map(tarea=> `
          <p class="my-0 position-sticky py-2 px-3 border-bottom border-top date_task">
            <i class="bi bi-calendar2-week"></i>
            <small class="fw-bold ms-2">
              ${tarea.fecha}
            </small>
          </p>

          ${tarea.tareas.map(t=> `
            <a href="#" class="list-group-item list-group-item-action py-3 lh-tight">
              <div class="d-flex w-100 align-items-center justify-content-between">
                <strong class="mb-1">${t.descripcion}</strong>
                <span class="small badge ${bgPrioridades[t.prioridad]}">
                  ${t.prioridadString}
                </span>
              </div>
              <div class="col-10 mb-1 small">  </div>
            </a>
          `).join('')}
        `)
        .join('')

        listTask.innerHTML = tareas;
      
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