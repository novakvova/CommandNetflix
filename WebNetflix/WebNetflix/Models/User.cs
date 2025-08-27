using System.Text.Json.Serialization;
using WebNetflix.Models;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public string? AvatarUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Поля для скидання пароля
    public string? PasswordResetToken { get; set; }
    public DateTime? PasswordResetTokenExpires { get; set; }

    // Нове поле для збережених трейлерів
    [JsonIgnore] // Щоб уникнути циклів при серіалізації
    public ICollection<Trailer> FavoriteTrailers { get; set; } = new List<Trailer>();
}
