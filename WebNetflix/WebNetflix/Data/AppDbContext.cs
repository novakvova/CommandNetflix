using Microsoft.EntityFrameworkCore;
using WebNetflix.Models;

namespace WebNetflix.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<PasswordResetToken> PasswordResetTokens => Set<PasswordResetToken>();
        public DbSet<Trailer> Trailers => Set<Trailer>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // твоя схема Neon
            modelBuilder.HasDefaultSchema("neondb_owner");

            // унікальний email
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // зв'язок ResetToken -> User
            modelBuilder.Entity<PasswordResetToken>()
                .HasOne(t => t.User)
                .WithMany()
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            base.OnModelCreating(modelBuilder);
        }
    }
}
