using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebNetflix.Data;
using WebNetflix.DTOs;
using WebNetflix.Models;
using WebNetflix.Services;

namespace WebNetflix.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly PasswordService _passwords;
        private readonly JwtService _jwt;
        private readonly EmailService _emailService;

        public AuthController(AppDbContext db, PasswordService passwords, JwtService jwt, EmailService emailService)
        {
            _db = db;
            _passwords = passwords;
            _jwt = jwt;
            _emailService = emailService;
        }

        // POST: /api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            var email = dto.Email.Trim().ToLowerInvariant();

            var exists = await _db.Users.AnyAsync(u => u.Email == email);
            if (exists) return BadRequest("User with this email already exists");

            // просте правило: мінімум 8, буква+цифра (можеш посилити)
            if (dto.Password.Length < 8 || !dto.Password.Any(char.IsDigit) || !dto.Password.Any(char.IsLetter))
                return BadRequest("Password must be at least 8 chars, with letters and digits");

            var user = new User { Email = email };
            user.PasswordHash = _passwords.HashPassword(user, dto.Password);

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return StatusCode(201); // Created
        }

        // POST: /api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            var email = dto.Email.Trim().ToLowerInvariant();
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user is null) return Unauthorized("Invalid credentials");

            if (!_passwords.VerifyPassword(user, dto.Password))
                return Unauthorized("Invalid credentials");

            var token = _jwt.GenerateToken(user);
            return Ok(new { token });
        }

        // GET: /api/auth/me  (приклад захищеного ендпойнта)
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var email = User.Claims.FirstOrDefault(c => c.Type.EndsWith("email", StringComparison.OrdinalIgnoreCase))?.Value;
            if (email is null) return Unauthorized();

            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user is null) return Unauthorized();

            return Ok(new { user.Id, user.Email, user.AvatarUrl, user.CreatedAt });
        }

        // POST: /api/auth/request-password-reset
        [HttpPost("request-password-reset")]
        public async Task<IActionResult> RequestPasswordReset([FromBody] RequestPasswordResetDto dto)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null) return Ok(); // Не видаємо наявність пошти

            // Генеруємо токен для reset
            var token = Guid.NewGuid().ToString();
            var resetLink = $"http://localhost:5045/swagger/index.html";

            // Надсилаємо лист
            await _emailService.SendEmailAsync(
                user.Email,
                "Password Reset",
                $"Click <a href='{resetLink}'>here</a> to reset your password."
            );

            // Зберігаємо токен у БД
            user.PasswordResetToken = token;
            user.PasswordResetTokenExpires = DateTime.UtcNow.AddHours(1);
            await _db.SaveChangesAsync();

            return Ok();
        }


        // POST: /api/auth/reset-password
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            var user = await _db.Users
                .FirstOrDefaultAsync(u => u.PasswordResetToken == dto.Token &&
                                          u.PasswordResetTokenExpires > DateTime.UtcNow);

            if (user == null) return BadRequest("Invalid or expired token");

            // Перевірка паролю
            if (dto.NewPassword.Length < 8 || !dto.NewPassword.Any(char.IsDigit) || !dto.NewPassword.Any(char.IsLetter))
                return BadRequest("Password must be at least 8 chars, with letters and digits");

            user.PasswordHash = _passwords.HashPassword(user, dto.NewPassword);
            user.PasswordResetToken = null;
            user.PasswordResetTokenExpires = null;
            user.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return Ok();
        }
    }
}
