console.log('TAREAS')

function limpiarFormulario() {
  document.getElementById('modalForm').reset()
  document.getElementById('tareaId').value = 0;
}

function obtenerTareas() {

  $.ajax({
    url : '../../Tareas/ObtenerTareas',
    type : 'GET',
    dataType : 'json',
    success : function(resultado) {
      if(resultado){
        
        const listTask = document.getElementById('list-task')
        const listTaskResponsive = document.getElementById('list-task-responsive')

        const bgPrioridades = ['bg-danger', 'bg-warning', 'bg-info']

        const tareasHTML = resultado.map(tarea=> `
          <p class="my-0 position-sticky bg-light text-dark py-2 px-3 border-bottom border-top date_task">
            <i class="bi bi-calendar2-week"></i>
            <small class="fw-bold ms-2">
              ${tarea.fecha}
            </small>
          </p>

          ${tarea.tareas?.map(t=> {
            const classTxtRealizada = t.realizada ? 'text-decoration-line-through' : '';
 
            
            return `
            <div class="list-group-item list-group-item-action py-3 lh-tight" data-id="${t.tareaID}">
              <div style="min-height: 30px" class="d-flex w-100 align-items-center justify-content-between">
                <span class="${classTxtRealizada}">${t.titulo}</span>
                
                <div class="t-actions" style="z-index: 99;">
                  <button ${t.realizada ? 'disabled' : ''} class="btn btn-light border btn-sm" data-edit >
                  <svg width="14" height="14" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" /></svg>
                  </button>
                  <button ${t.realizada ? 'disabled' : ''} class="btn btn-light border btn-sm" data-delete >
                  <svg width="14" height="14" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7h16" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /><path d="M10 12l4 4m0 -4l-4 4" /></svg>
                  </button>
                  </button>
                  <button  class="btn btn-light border btn-sm" data-estado >
                    <svg width="14" height="14" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                      ${t.realizada 
                          ? `
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M18.333 2c1.96 0 3.56 1.537 3.662 3.472l.005 .195v12.666c0 1.96 -1.537 3.56 -3.472 3.662l-.195 .005h-12.666a3.667 3.667 0 0 1 -3.662 -3.472l-.005 -.195v-12.666c0 -1.96 1.537 -3.56 3.472 -3.662l.195 -.005h12.666zm-2.626 7.293a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" stroke-width="0" fill="currentColor" />
                          `
                          : `
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
                          <path d="M9 12l2 2l4 -4" />
                          </svg>
                          `
                      }
                        
                  </button>
                </div>
              </div>
              <div class="col-10 mt-2">  
                <span class="small ${classTxtRealizada} fw-light badge ${bgPrioridades[t.prioridad]}">
                ${t.prioridadString}
              </span>
              </div>
            </div>
          `
          }).join('')}
        `)
        .join('')

        if(resultado.length > 0){
          listTask.classList.remove('d-flex','flex-column', 'justify-content-center', 'align-items-center')
          const contenidoListaTareas = `
            <div class="d-flex gap-2 p-2 m-0">
              <select class="form-select form-select-sm" aria-label=".form-select-sm example">
                <option selected class="text-muted">[PRIORIDAD]</option>
                <option value="1">ALTA</option>
                <option value="2">MEDIA</option>
                <option value="3">BAJA</option>
              </select>
              <select class="form-select form-select-sm" aria-label=".form-select-sm example">
                <option selected class="text-muted">[ESTADO]</option>
                <option value="2">EN CURSO</option>
                <option value="1">FINALIZADA</option>
              </select>
            </div>
            ${tareasHTML}
          ` 

          listTask.innerHTML = contenidoListaTareas;
          listTaskResponsive.innerHTML = contenidoListaTareas;
        } else {
          listTask.classList.add('d-flex','flex-column', 'justify-content-center', 'align-items-center')
          const contenidoVacioListaTareas = ` 
            <svg  width="50" height="50" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M7 3h10a2 2 0 0 1 2 2v10m0 4a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-14" />
              <path d="M11 7h4" />
              <path d="M9 11h2" />
              <path d="M9 15h4" />
              <path d="M3 3l18 18" />
            </svg>
            <p class="text-muted lead"> No hay tareas aún. </p>
          `
          listTask.innerHTML =  contenidoVacioListaTareas
          listTaskResponsive.innerHTML = contenidoVacioListaTareas;
        }
         
 
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
    titulo: $('#titulo').val(),
    descripcion: $('#descripcion').val(),
    fecha: $('#fecha').val(),
    fechaFin: $('#fecha_vencimiento').val(),
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
        limpiarFormulario()
        // $('#modal').modal('hide');
      }
    },
    error: function (error){
      console.log(error)
    }
  })
}

function tareaPorId(tareaId, fn) {
  if(tareaId){
    $.ajax({
      url: '../../Tareas/ObtenerTareas',
      type: 'GET',
      data: {
        tareaId: tareaId
      },
      dataType: 'json'
    })
    .done(function (respuesta){
      console.log(respuesta);
      if(respuesta && respuesta?.[0].tareas.length > 0){
        const tarea = respuesta[0].tareas[0];

        fn && fn(tarea)
      }
    })
    .fail(function (error){
      console.log(error)
    })
  }
}

function mostrarDetalleTarea(tarea) {
  console.log(tarea);
  $('#modal_detalle .modal-body').html(`
    <h2 class="fw-semibold"> ${tarea.titulo} </h2>
    <p class="small text-muted">
      <time datetime="${tarea.fechaFormateada}">${new Date(tarea.fecha).toLocaleDateString()}</time> -
      <time datetime="${tarea.fechaFinFormateada}">${new Date(tarea.fechaFin).toLocaleDateString()}</time>
    </p>
    <p class="lead"> ${tarea.descripcion} </p>
  `)
  $('#modal_detalle').modal('show');
}

function setearTarea(tarea) {
  $('#tareaId').val(tarea.tareaID);
  $('#descripcion').val(tarea.descripcion);
  $('#titulo').val(tarea.titulo);
  $('#fecha').val(tarea.fechaFormateada);
  $('#fecha_vencimiento').val(tarea.fechaFinFormateada);
  $('#prioridad').val(tarea.prioridad);
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
      } 
      
    })
    .fail(function (error){
      console.log(error)
    })
  }
}

const listTask = document.querySelectorAll('#list-task, #list-task-responsive');

listTask.forEach(list=> {
  list.addEventListener('click', function(e){
    const element = e.target;
  
    const btnSetEdit = element.closest('[data-edit]');
    const btnDelete = element.closest('[data-delete]');
    const btnStatus = element.closest('[data-estado]');
    const tarea = element.closest('.list-group-item');
  
    if(btnSetEdit){
      tareaPorId(tarea.dataset.id, setearTarea)
    } else if (btnDelete){
      eliminarTarea(tarea.dataset.id)
    } else if (btnStatus){
      completarTarea(tarea.dataset.id)
    } else if (tarea){
      tareaPorId(tarea.dataset.id, mostrarDetalleTarea)
    }
   
  })
  
})
 
window.onload = obtenerTareas();