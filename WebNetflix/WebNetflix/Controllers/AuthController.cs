using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
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
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            AppDbContext db,
            PasswordService passwords,
            JwtService jwt,
            EmailService emailService,
            ILogger<AuthController> logger)
        {
            _db = db;
            _passwords = passwords;
            _jwt = jwt;
            _emailService = emailService;
            _logger = logger;
        }

        // POST: /api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            var email = dto.Email.Trim().ToLowerInvariant();
            _logger.LogInformation("Register attempt for {Email}", email);

            var exists = await _db.Users.AnyAsync(u => u.Email == email);
            if (exists)
            {
                _logger.LogWarning("Registration failed: {Email} already exists", email);
                return BadRequest("User with this email already exists");
            }

            if (dto.Password.Length < 8 || !dto.Password.Any(char.IsDigit) || !dto.Password.Any(char.IsLetter))
            {
                _logger.LogWarning("Weak password during registration for {Email}", email);
                return BadRequest("Password must be at least 8 chars, with letters and digits");
            }

            var user = new User { Email = email };
            user.PasswordHash = _passwords.HashPassword(user, dto.Password);

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            _logger.LogInformation("User {Email} registered successfully", email);
            return StatusCode(201); // Created
        }

        // POST: /api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            var email = dto.Email.Trim().ToLowerInvariant();
            _logger.LogInformation("Login attempt for {Email}", email);

            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user is null)
            {
                _logger.LogWarning("Login failed: {Email} not found", email);
                return Unauthorized("Invalid credentials");
            }

            if (!_passwords.VerifyPassword(user, dto.Password))
            {
                _logger.LogWarning("Login failed: invalid password for {Email}", email);
                return Unauthorized("Invalid credentials");
            }

            var token = _jwt.GenerateToken(user);
            _logger.LogInformation("User {Email} logged in successfully", email);

            return Ok(new { token });
        }

        // GET: /api/auth/me
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            // ✅ отримуємо email безпосередньо з claim
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            if (email == null)
            {
                return Unauthorized("Email claim is missing");
            }

            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null) return Unauthorized();

            return Ok(new
            {
                user.Id,
                user.Email,
                user.AvatarUrl,
                user.CreatedAt
            });
        }






        // POST: /api/auth/request-password-reset
        [HttpPost("request-password-reset")]
        public async Task<IActionResult> RequestPasswordReset([FromBody] RequestPasswordResetDto dto)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null)
            {
                _logger.LogWarning("Password reset requested for non-existing email {Email}", dto.Email);
                return Ok(); // не видаємо
            }

            var token = Guid.NewGuid().ToString();
            var resetLink = $"http://localhost:5045/swagger/index.html";

            await _emailService.SendEmailAsync(
                user.Email,
                "Password Reset",
                $"Click <a href='{resetLink}'>here</a> to reset your password."
            );

            user.PasswordResetToken = token;
            user.PasswordResetTokenExpires = DateTime.UtcNow.AddHours(1);
            await _db.SaveChangesAsync();

            _logger.LogInformation("Password reset requested for {Email}", user.Email);
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

            if (user == null)
            {
                _logger.LogWarning("Invalid or expired token used for password reset");
                return BadRequest("Invalid or expired token");
            }

            if (dto.NewPassword.Length < 8 || !dto.NewPassword.Any(char.IsDigit) || !dto.NewPassword.Any(char.IsLetter))
            {
                _logger.LogWarning("Weak new password for {Email} during reset", user.Email);
                return BadRequest("Password must be at least 8 chars, with letters and digits");
            }

            user.PasswordHash = _passwords.HashPassword(user, dto.NewPassword);
            user.PasswordResetToken = null;
            user.PasswordResetTokenExpires = null;
            user.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();

            _logger.LogInformation("Password successfully reset for {Email}", user.Email);
            return Ok();
        }
    }
}
