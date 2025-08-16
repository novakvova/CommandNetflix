using Microsoft.AspNetCore.Identity;
using WebNetflix.Models;

namespace WebNetflix.Services
{
    public class PasswordService
    {
        private readonly PasswordHasher<User> _hasher = new();

        public string HashPassword(User user, string password)
            => _hasher.HashPassword(user, password);

        public bool VerifyPassword(User user, string password)
            => _hasher.VerifyHashedPassword(user, user.PasswordHash, password) == PasswordVerificationResult.Success;
    }
}
