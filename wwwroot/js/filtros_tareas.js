// window.addEventListener('load', function (){
//   const currentUrl = new URL(window.location.href)
//   const params = currentUrl.searchParams;

//   $('.admin-panel__main').prepend(
//     contenidoVacioListaTareas({ text: 'No se encontraron tareas, pruebe con otros filtros.' })
//   )

//   $('#priority').val(params.get('priority') || '-1')
//   $('#status').val(params.get('status') || '-1')
 
//   const filtros = document.querySelectorAll('#priority, #status')

//   function busquedaFiltros (){
//     const currentURL = new URL(this.window.location.href);
//     const params = currentURL.searchParams;
    
//     const status = params.get('status');
//     const priority = params.get('priority');
    
//     if(status || priority){
//       const hideElements = element=> element.classList.add('d-none')
//       const showElements = element=> {
//         element.classList.remove('d-none')
  
//         const parent = element.parentElement;
//         if(parent && parent.classList.contains('tasks_date')){
//           parent.firstElementChild.classList.remove('d-none');
//         }
        
//       }
  
//       const TODAS_LAS_TAREAS = document.querySelectorAll('.list-group-item');
//       const FECHAS_TAREAS = document.querySelectorAll('.date_task');
//       FECHAS_TAREAS.forEach(hideElements)
//       TODAS_LAS_TAREAS.forEach(hideElements)
      
//       let listaTarea = TODAS_LAS_TAREAS
//       if((priority === '-1' || !priority) && (status === '-1' || !status)){
//         listaTarea = TODAS_LAS_TAREAS;
//       } else if ((priority && priority !== '-1') && (!status || status === '-1')) {
//         listaTarea = document.querySelectorAll(`.list-group-item[data-priority="${priority}"]`);
//       } else if ((status && status !== '-1') && (!priority || priority === '-1')) {
//         listaTarea = document.querySelectorAll(`.list-group-item[data-status="${status}"]`);
//       } else {
//         listaTarea = document.querySelectorAll(`.list-group-item[data-status="${status}"][data-priority="${priority}"]`);
//       }
  
//       if(listaTarea.length){
//         $('#no-results').addClass('d-none')
//         listaTarea.forEach(showElements);
//       } else {
//         $('#no-results').removeClass('d-none')
//       }
//     }
  
  
//   }

  // busquedaFiltros()
  
//   filtros.forEach(filtro=> {
//     filtro.addEventListener('input', function (e){
//       console.log(e.target);

//       // if(e.target !== null){
//         const { id,value } = e.target;

//         params.set(id, value.toLowerCase());
        
//         window.history.pushState(null, null, currentUrl.href)
//         window.dispatchEvent(new Event('popstate'));
//       // }
//     })
//   })

//   window.addEventListener('popstate', busquedaFiltros)
   
// })