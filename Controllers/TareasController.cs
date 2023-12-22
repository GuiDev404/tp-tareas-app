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
        var directions = from Prioridades d in Enum.GetValues(typeof(Prioridades))
           select new { ID = ((int)d).ToString(), Name = d.ToString() };

        ViewBag.Prioridades = new SelectList(directions , "ID", "Name");
        
        return View();
    }

    public JsonResult ObtenerTareas (int? tareaId){
        string usuarioIDActual = _userManager.GetUserId(HttpContext.User);

        var tareas = _context.Tareas
            .Where(t => t.UsuarioID == usuarioIDActual && !t.Eliminada);
        
        if(tareaId != null){
            tareas = tareas.Where(t=> t.TareaID == tareaId);
        }

        var tareasAgrupadas = tareas
            .ToList() // Traer los datos de la base de datos a la memoria
            .GroupBy(g => g.FechaFormateada)
            .Select(f => new { fecha = f.Key, tareas = f.OrderBy(t=> t.Prioridad) })
            .OrderByDescending(t=> t.fecha);

        return Json(tareasAgrupadas);
    }

    public JsonResult GuardarTarea(int tareaId, string titulo, string descripcion, DateTime fecha, DateTime fechaFin, Prioridades prioridad)
    {
        int resultado = 0;

        string usuarioIDActual = _userManager.GetUserId(HttpContext.User);

        if(!string.IsNullOrEmpty(descripcion)){
            if(tareaId == 0){
                Tarea nuevaTarea = new (){
                    Titulo = titulo,
                    Descripcion = descripcion,
                    Fecha = fecha,
                    FechaFin = fechaFin,
                    Prioridad = prioridad,
                    UsuarioID = usuarioIDActual,
                };

                _context.Tareas.Add(nuevaTarea);
                _context.SaveChanges();
                resultado = 1;
            } else {
                Tarea? tareaActualizar = _context.Tareas
                    .FirstOrDefault(t=> t.TareaID == tareaId && t.UsuarioID == usuarioIDActual);

                if(tareaActualizar != null){
                    tareaActualizar.Titulo = titulo;
                    tareaActualizar.Descripcion = descripcion;
                    tareaActualizar.Prioridad = prioridad;
                    tareaActualizar.Fecha = fecha;
                    tareaActualizar.FechaFin = fechaFin;

                    _context.SaveChanges();
                    resultado = 1;
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
            tareaAEliminar.FechaLimite = DateTime.Now;
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
