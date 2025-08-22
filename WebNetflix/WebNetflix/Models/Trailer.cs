using System.ComponentModel.DataAnnotations;

namespace WebNetflix.Models
{
    public class Trailer
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [Url]
        public string ImageUrl { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string YouTubeCode { get; set; } = string.Empty;

        [Range(0, 10)]
        public double Rating { get; set; }

        [MaxLength(999)]
        public string? Description { get; set; }
    }
}
