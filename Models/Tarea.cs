using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TP_Gestion_Tareas.Utilidades;

namespace TP_Gestion_Tareas.Models
{
  public class Tarea
  {
    [Key]
    public int TareaID { get; set; }
    public string Titulo { get; set; }
    public string Descripcion { get; set; }
    public DateTime Fecha { get; set; }
    public DateTime FechaFin { get; set; }
    public DateTime FechaLimite { get; set; }

    public Prioridades Prioridad { get; set; }

    public bool Realizada { get; set; }
    public bool Eliminada { get; set; }

    public string UsuarioID { get; set; }

    [NotMapped]
    public string FechaFormateada { get { return Fecha.ToString("yyyy-MM-dd"); } }
    public string FechaFinFormateada { get { return FechaFin.ToString("yyyy-MM-dd"); } }
    public string FechaLimiteFormateada { get { return FechaLimite.ToString("yyyy-MM-dd"); } }

    [NotMapped]
    public string PrioridadString { get { return Prioridad.ToString(); } }

  }

}