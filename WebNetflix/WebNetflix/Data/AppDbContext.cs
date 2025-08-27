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
        public DbSet<Genre> Genres => Set<Genre>();

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

            // багато-до-багатьох Trailer <-> Genre
            modelBuilder.Entity<Trailer>()
                .HasMany(t => t.Genres)
                .WithMany(g => g.Trailers)
                .UsingEntity<Dictionary<string, object>>(
                    "TrailerGenre",
                    j => j
                        .HasOne<Genre>()
                        .WithMany()
                        .HasForeignKey("GenreId")
                        .OnDelete(DeleteBehavior.Cascade),
                    j => j
                        .HasOne<Trailer>()
                        .WithMany()
                        .HasForeignKey("TrailerId")
                        .OnDelete(DeleteBehavior.Cascade),
                    j =>
                    {
                        j.HasKey("TrailerId", "GenreId");
                        j.ToTable("TrailerGenres");
                    });

            // багато-до-багатьох User <-> Favorite Trailers
            modelBuilder.Entity<User>()
                .HasMany(u => u.FavoriteTrailers)
                .WithMany(t => t.FavoritedByUsers)
                .UsingEntity<Dictionary<string, object>>(
                    "UserFavoriteTrailer",
                    j => j
                        .HasOne<Trailer>()
                        .WithMany()
                        .HasForeignKey("TrailerId")
                        .OnDelete(DeleteBehavior.Cascade),
                    j => j
                        .HasOne<User>()
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade),
                    j =>
                    {
                        j.HasKey("UserId", "TrailerId");
                        j.ToTable("UserFavoriteTrailers");
                    });

            base.OnModelCreating(modelBuilder);
        }
    }
}
