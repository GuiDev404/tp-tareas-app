console.log('[TAREAS]')

const fechaEsMayor = (fechaMayor, fechaMenor)=>
  new Date(fechaMayor).getTime() > new Date(fechaMenor).getTime();

const fechaAInput = (fecha)=> {
  const año = fecha.getFullYear()
  let mes = fecha.getMonth() + 1;
  let diaDelMes = fecha.getDate()

  if(mes < 10){
    mes = '0'+mes
  } 

  if(diaDelMes < 10){
    diaDelMes = '0'+diaDelMes
  } 

  return `${año}-${mes}-${diaDelMes}`
};

const currentUrl = new URL(window.location.href)
const params = currentUrl.searchParams;

$('.admin-panel__main').prepend(
  contenidoVacioListaTareas({ text: 'No se encontraron tareas, pruebe con otros filtros.' })
)

$('#priority').val(params.get('priority') || '-1')
$('#status').val(params.get('status') || '-1')

const filtros = document.querySelectorAll('#priority, #status')


const sumarDiasAFecha = (fecha, dias = 1)=> {
  const fechaMasDias = new Date(fecha.setDate(fecha.getDate() + dias))
  const fechaInput = fechaAInput(fechaMasDias);

  return fechaInput
}

function diasEntreFechas(fechaInicio, fechaFin) {
  const fechaInicioMs = fechaInicio.getTime();
  const fechaFinMs = fechaFin.getTime();

  if(!fechaFinMs || !fechaInicioMs || fechaFinMs < fechaInicioMs) return '';
  const diff = Math.abs(fechaFinMs - fechaInicioMs);

  // (1000*60*60*24) --> milisegundos -> segundos -> minutos -> horas(24) = 1 dia
  const DIA_EN_MS = (1000*60*60*24) 
  return Math.floor(diff / DIA_EN_MS);
}
  
jQuery.validator.addMethod("fechaEsMayor", function(inputValue, element, validar) {
  if(validar){

    if(validar.value && inputValue){
      return fechaEsMayor(inputValue, validar.value);
    }
  }

  return true;
});

jQuery.validator.addMethod("fechaEsMenor", function(inputValue, element, validar) {
  if(validar){

    if(validar.value && inputValue){
      return fechaEsMayor(validar.value, inputValue);
    }
  }

  return true;
});

$(document).ready(function (){
  const fecha_vencimiento = document.getElementById('fecha_vencimiento')
  const fecha_inicio = document.getElementById('fecha')
  const cantidad_dias = document.getElementById('cantidad_dias')

  fecha_inicio.setAttribute('min', fechaAInput(new Date()))

  // ----- SECCION MIN MAX ATRIBUTOS DE INPUTS FECHAS
  fecha_inicio.addEventListener('input', function (e){
      const valueAsDate = e.target.valueAsDate;

      const minAttrValue = sumarDiasAFecha(valueAsDate, 1);
 
      fecha_vencimiento.setAttribute('min', minAttrValue)
      
      const dias = diasEntreFechas(valueAsDate, new Date(fecha_vencimiento.value))
      cantidad_dias.value = dias;
  });

  fecha_vencimiento.addEventListener('input', function (e){
      const valueAsDate = e.target.valueAsDate;

      fecha_inicio.setAttribute('max', fechaAInput(valueAsDate))

      const dias = diasEntreFechas(new Date(fecha_inicio.value), valueAsDate)
      cantidad_dias.value = dias;
  });


  $('#modalForm').validate({
    errorClass: 'text-danger small d-block mt-1',
    rules: {
      titulo: {
        required: true,
      },
      descripcion: {
        required: true,
      },
      fecha: {
        min: false,
        required: true,
        date: true,
        fechaEsMenor: fecha_vencimiento
      },
      fecha_vencimiento: {
        required: true,
        date: true,
        fechaEsMayor: fecha_inicio
      },
      prioridad: {
        required: true,
        // seleccionRequerida: true
      },
    },
    messages: {
      titulo: {
        required: "El titulo de la tarea es requerido",
      },
      descripcion: {
        required: "La descripcion de la tarea es requerida",
      },
      fecha: {
        min: 'La fecha debe ser mayor o igual al dia actual',
        max: 'La fecha debe ser menor a la fecha de finalizacion',
        required: "La fecha de inicio es requerida",
        date: "Ingrese una fecha valida",
        fechaEsMenor: "Debe ser menor a la fecha de finalizacion"
      },
      fecha_vencimiento: {
        min: 'La fecha debe ser mayor a la fecha de inicio',
        required: "La fecha de finalizacion es requerida",
        date: "Ingrese una fecha valida",
        fechaEsMayor: "Debe ser mayor a la fecha de inicio"
      },
      prioridad: {
        required: "El titulo de la tarea es requerido",
        // seleccionRequerida: true
      },
    },
    // errorPlacement: function(error, element) {

    //   // CAMBIA DE LUGAR EL MENSAJE DE LOS ERRORES
    //   if (element.attr("name") === "productos" || element.attr("name") === "productoId") {
    //     error.insertAfter("#container_autocomplete_productos");
    //   } else {
    //     // UTILIZA LA UBICACIÓN PREDETERMINADA PARA OTROS CAMPOS
    //     error.insertAfter(element); 
    //   }
    // },
    // showErrors: function (errorMap, errorList) {
    //   this.defaultShowErrors();
    //   // ELIMINA LAS CLASES DE ERROR PORQUE LAS AGREGA A LOS INPUTS. 😤😤
    //   const classNameExclude = 'text-danger small d-block mt-1';

    //   $.each(errorList, function(idx, error) {
    //     $(error.element).removeClass(classNameExclude);
    //   });
    // }
  })
})

function limpiarFormulario () {
  document.getElementById('modalForm').reset()
  document.getElementById('tareaId').value = 0;
}

function busquedaFiltros (){
    const currentURL = new URL(this.window.location.href);
    const params = currentURL.searchParams;
    
    const status = params.get('status');
    const priority = params.get('priority');
    
    if(status || priority){
      if(!$('#no-results').length){
        $('.admin-panel__main').prepend(
          contenidoVacioListaTareas({ text: 'No se encontraron tareas, pruebe con otros filtros.' })
        )
      }
      $('#no-results').addClass('d-none')
      

      const hideElements = element=> element.classList.add('d-none')
      const showElements = element=> {
        element.classList.remove('d-none')
  
        const parent = element.parentElement;
        if(parent && parent.classList.contains('tasks_date')){
          parent.firstElementChild.classList.remove('d-none');
        }
        
      }
  
      const TODAS_LAS_TAREAS = document.querySelectorAll('.list-group-item');
      const FECHAS_TAREAS = document.querySelectorAll('.date_task');
      FECHAS_TAREAS.forEach(hideElements)
      TODAS_LAS_TAREAS.forEach(hideElements)
      
      let listaTarea = TODAS_LAS_TAREAS
      if((priority === '-1' || !priority) && (status === '-1' || !status)){
        listaTarea = TODAS_LAS_TAREAS;
      } else if ((priority && priority !== '-1') && (!status || status === '-1')) {
        listaTarea = document.querySelectorAll(`.list-group-item[data-priority="${priority}"]`);
      } else if ((status && status !== '-1') && (!priority || priority === '-1')) {
        listaTarea = document.querySelectorAll(`.list-group-item[data-status="${status}"]`);
      } else {
        listaTarea = document.querySelectorAll(`.list-group-item[data-status="${status}"][data-priority="${priority}"]`);
      }
  
      if(listaTarea.length){
     
        listaTarea.forEach(showElements);
      } else {
        
        $('#no-results').removeClass('d-none')
      }
    }
  
  
}

function obtenerTareas({ isInit = false } = {}) {

  $.ajax({
    url : '../../Tareas/ObtenerTareas',
    type : 'GET',
    dataType : 'json',
    success : function(resultado) {
      // resultado = []
      if(resultado){
        const listTask = document.getElementById('list-task')
        // const listFooter = document.getElementById('list-footer')
        
        const bgPrioridades = ['bg-danger', 'bg-warning', 'bg-info']

        // let filtros = `<div class="d-flex gap-2 justify-content-center align-items-center p-2 h-100">
       
        //     <select class="form-select form-select-sm" id="priority" >
        //       <option selected value="-1" class="text-muted">[PRIORIDAD]</option>
        //       <option value="0">ALTA</option>
        //       <option value="1">MEDIA</option>
        //       <option value="2">BAJA</option>
        //     </select>
        //     <select class="form-select form-select-sm" id="status" >
        //       <option selected value="-1" class="text-muted">[ESTADO]</option>
        //       <option value="0">EN CURSO</option>
        //       <option value="1">FINALIZADA</option>
        //     </select>
         
        // </div>`
  
        const tareasHTML = resultado.map(tarea=> `
          <div class="tasks_date">
            <p class="my-0 position-sticky bg-light text-dark py-2 px-3 border-bottom border-top date_task">
              <i class="bi bi-calendar2-week"></i>
              <small class="fw-bold ms-2">
                ${tarea.fecha}
              </small>
            </p>

            ${tarea.tareas?.map(t=> {
              const classTxtRealizada = t.realizada ? 'text-decoration-line-through' : '';
              
              
              return `
              <div title="VER DETALLE" class="list-group-item list-group-item-action py-3 lh-tight cursor-pointer border-end-0" data-id="${t.tareaID}" data-priority="${t.prioridad}" data-status="${Number(t.realizada)}">
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
          </div>
        `)
        .join('')

        if(resultado.length > 0){
          listTask.classList.remove('d-flex','flex-column', 'justify-content-center', 'align-items-center')
          
          // listFooter.innerHTML = filtros;
          listTask.innerHTML = tareasHTML;

          if(isInit){
            busquedaFiltros()
          }

        } else {
          listTask.classList.add('d-flex','flex-column', 'justify-content-center', 'align-items-center')

          listTask.innerHTML = contenidoVacioListaTareas({ text: 'No hay tareas aún.' })
          $('#no-results').removeClass('d-none')

          // listFooter.innerHTML = filtros;
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

  if(!$('#modalForm').valid()) return;


  if(nuevaTarea.descripcion.trim() === '' || nuevaTarea.fecha.trim() === '' || nuevaTarea.prioridad === '-1'){
    Toastify({
      text: "Complete los campos requeridos!",
      className: "bg-success text-white rounded-2",
      duration: 3000,
      close: true,
      gravity: "bottom", 
      position: "right", 
      style: {
        background: "#dc3545",
      }
    }).showToast();
  }

  $.ajax({
    url : '../../Tareas/GuardarTarea',
    data : nuevaTarea,
    type : 'POST',
    dataType : 'json',
    success : function(resultado) {
      if(resultado == 2){
        Toastify({
          text: "Ya tienes una tarea con esa descripcion!",
          className: "bg-success text-white rounded-2",
          duration: 3000,
          close: true,
          gravity: "bottom", 
          position: "right", 
          style: {
            background: "#dc3545",
          }
        }).showToast();
        return;
      }

      if(resultado === 1){
        obtenerTareas()
        limpiarFormulario()
        
        Toastify({
          text: "Tarea guardada correctamente!",
          className: "bg-success text-white rounded-2",
          duration: 3000,
          close: true,
          gravity: "bottom", 
          position: "right", 
          style: {
            background: "#198754",
          }
        }).showToast();
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
  const bgPrioridades = ['bg-danger', 'bg-warning', 'bg-info']

  console.log(tarea);
  $('#modal_detalle .modal-body').html(`
    <small class="mb-2 fw-light badge ${bgPrioridades[tarea.prioridad]}">
      ${tarea.prioridadString}
    </small>
    
    <small class="mb-2 fw-light badge ${tarea.realizada ? 'bg-danger' : 'bg-success'}">
      ${tarea.realizada ? 'Realizada' : 'Activa'} 
    </small>

    <h2 class="fw-semibold h4 text-capitalize"> 
      ${tarea.titulo}
    </h2>
    <p class="small text-muted">
      Del <strong class="fw-semibold"> <time datetime="${tarea.fechaFormateada}">${new Date(tarea.fecha).toLocaleDateString()}</time> </strong> hasta <strong class="fw-semibold"> <time datetime="${tarea.fechaFinFormateada}">${new Date(tarea.fechaFin).toLocaleDateString()}</time> </strong>
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

  $('#cancel-btn').removeClass('d-none')
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
      obtenerTareas();
      
      if(seElimino){
        Toastify({
          text: "Tarea eliminada correctamente!",
          className: "bg-success text-white rounded-2",
          duration: 3000,
          close: true,
          gravity: "bottom", 
          position: "right", 
          style: {
            background: "#198754",
          }
        }).showToast();
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
 
window.onload = function (){
  obtenerTareas({ isInit: true })
};

$('#cancel-btn').on('click', function (event){
  limpiarFormulario();
  event.target.classList.add('d-none')
})

filtros.forEach(filtro=> {
  filtro.addEventListener('input', function (e){

    if(e.target !== null){
      const { id,value } = e.target;

      params.set(id, value.toLowerCase());
      
      window.history.pushState(null, null, currentUrl.href)
      window.dispatchEvent(new Event('popstate'));
    }
  })
})

window.addEventListener('popstate', busquedaFiltros)