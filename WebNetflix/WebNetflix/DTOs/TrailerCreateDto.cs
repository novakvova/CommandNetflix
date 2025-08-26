// DTO для створення трейлера
using System.ComponentModel.DataAnnotations;

public class TrailerDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string YouTubeCode { get; set; } = string.Empty;
    public double Rating { get; set; }
    public string? Description { get; set; }

    // Список імен жанрів або DTO жанру
    public List<GenreDto> Genres { get; set; } = new();
}

public class GenreDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class TrailerCreateDto
{
    [Required]
    public string Title { get; set; } = string.Empty;
    [Required, Url]
    public string ImageUrl { get; set; } = string.Empty;
    [Required]
    public string YouTubeCode { get; set; } = string.Empty;
    [Range(0, 10)]
    public double Rating { get; set; }
    public string? Description { get; set; }

    // передаємо тільки ID жанрів
    public List<int> GenresIds { get; set; } = new();
}
