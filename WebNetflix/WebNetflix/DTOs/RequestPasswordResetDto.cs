using System.ComponentModel.DataAnnotations;

namespace WebNetflix.DTOs
{
    public class RequestPasswordResetDto
    {
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
}
