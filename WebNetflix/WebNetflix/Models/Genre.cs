using System.ComponentModel.DataAnnotations;

namespace WebNetflix.Models
{
    public class Genre
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        public ICollection<Trailer> Trailers { get; set; } = new List<Trailer>();
    }
}
