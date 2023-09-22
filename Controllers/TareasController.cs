using System.Diagnostics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using TP_Gestion_Tareas.Data;
using TP_Gestion_Tareas.Models;
using TP_Gestion_Tareas.Utilidades;

namespace TP_Gestion_Tareas.Controllers;

[Authorize]
public class TareasController : Controller
{
    private readonly ILogger<TareasController> _logger;
    private readonly ApplicationDbContext _context;
    private readonly UserManager<IdentityUser> _userManager;


    public TareasController(ILogger<TareasController> logger, ApplicationDbContext context, UserManager<IdentityUser> userManager)
    {
        _logger = logger;
        _context = context;
        _userManager = userManager;

    }

    public IActionResult Index()
    {
        var prioridadesValues = Enum.GetValues(typeof(Prioridades));
        var prioridades = 
            from Prioridades p in prioridadesValues
            select new { ID = (int)p, Nombre = p.ToString() };

        ViewBag.Prioridades = new SelectList(prioridades , "ID", "Nombre");
        
        return View();
    }

    public JsonResult ObtenerTareas (int? tareaId){
        string usuarioIDActual = _userManager.GetUserId(HttpContext.User);

        IEnumerable<Tarea> tareas = _context.Tareas
            .Where(t => t.UsuarioID == usuarioIDActual)
            .OrderByDescending(t=> t.Fecha)
            .ThenBy(tarea => tarea.Prioridad);

        if(tareaId != null){
            tareas = tareas.Where(tarea => tarea.TareaID == tareaId);
        }

        return Json(tareas);
    }

    public JsonResult GuardarTarea(int tareaId, string descripcion, DateTime fecha, int prioridad)
    {
        int resultado = 0;

        string usuarioIDActual = _userManager.GetUserId(HttpContext.User);

        if(!string.IsNullOrEmpty(descripcion) && fecha != default && prioridad != -1){
            descripcion = descripcion.ToLower().Trim();
            
            if(tareaId == 0){

                Tarea nuevaTarea = new (){
                    Descripcion = descripcion,
                    Fecha = fecha,
                    Prioridad = (Prioridades)prioridad,
                    UsuarioID = usuarioIDActual
                };

                Tarea? tareaYaExistente = _context.Tareas
                    .FirstOrDefault(t=> t.Descripcion.ToLower().Trim() == descripcion && t.UsuarioID == usuarioIDActual);

                if(tareaYaExistente != null){
                    resultado = 2;
                } else {
                    _context.Tareas.Add(nuevaTarea);
                    _context.SaveChanges();
                    resultado = 1;
                }

            } else {
                Tarea? tareaYaExistente = _context.Tareas
                    .FirstOrDefault(t=> t.Descripcion.ToLower().Trim() == descripcion && t.TareaID != tareaId && t.UsuarioID == usuarioIDActual);
                
                if(tareaYaExistente == null){
                    Tarea? tareaActualizar = _context.Tareas
                        .FirstOrDefault(t=> t.TareaID == tareaId && t.UsuarioID == usuarioIDActual);

                    if(tareaActualizar != null){
                        tareaActualizar.Descripcion = descripcion;
                        tareaActualizar.Prioridad = (Prioridades)prioridad;
                        tareaActualizar.Fecha = fecha;

                        _context.SaveChanges();
                        resultado = 1;
                    }
                } else {
                    resultado = 2;
                }

            }
        }

        return Json(resultado);
    }

    public JsonResult EliminarTarea(int tareaId)
    {
        bool resultado = false;
        string usuarioIDActual = _userManager.GetUserId(HttpContext.User);

        Tarea? tareaAEliminar = _context.Tareas
                    .SingleOrDefault(t => t.TareaID == tareaId && t.UsuarioID == usuarioIDActual);

        if (tareaAEliminar != null)
        {
            tareaAEliminar.Eliminada = !tareaAEliminar.Eliminada;
            _context.SaveChanges();
            resultado = tareaAEliminar.Eliminada;
        }

        return Json(resultado);
    }

    public JsonResult CompletarTarea(int tareaId)
    {
        bool resultado = false;
        string usuarioIDActual = _userManager.GetUserId(HttpContext.User);

        Tarea? tareaAEliminar = _context.Tareas
                    .SingleOrDefault(t => t.TareaID == tareaId && t.UsuarioID == usuarioIDActual);

        if (tareaAEliminar != null)
        {
            tareaAEliminar.Realizada = !tareaAEliminar.Realizada;
            _context.SaveChanges();
            resultado = true;
        }

        return Json(resultado);
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
