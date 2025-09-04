using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebNetflix.Data;
using WebNetflix.Models;

namespace WebNetflix.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FavoriteTrailersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FavoriteTrailersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/FavoriteTrailers/5
        [HttpGet("{userId}")]
        public async Task<ActionResult<IEnumerable<TrailerDto>>> GetFavoriteTrailers(int userId)
        {
            var user = await _context.Users
                .Include(u => u.FavoriteTrailers)
                .ThenInclude(t => t.Genres)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound("Користувача не знайдено");

            var trailersDto = user.FavoriteTrailers.Select(t => new TrailerDto
            {
                Id = t.Id,
                Title = t.Title,
                ImageUrl = t.ImageUrl,
                YouTubeCode = t.YouTubeCode,
                Rating = t.Rating,
                Description = t.Description,
                Genres = t.Genres.Select(g => new GenreDto { Id = g.Id, Name = g.Name }).ToList()
            }).ToList();

            return Ok(trailersDto);
        }


        // POST: api/FavoriteTrailers/5/10
        [HttpPost("{userId}/{trailerId}")]
        public async Task<IActionResult> AddFavoriteTrailer(int userId, int trailerId)
        {
            var user = await _context.Users
                .Include(u => u.FavoriteTrailers)
                .FirstOrDefaultAsync(u => u.Id == userId);
            var trailer = await _context.Trailers.FindAsync(trailerId);

            if (user == null || trailer == null)
                return NotFound("Користувача або трейлера не знайдено");

            if (!user.FavoriteTrailers.Contains(trailer))
                user.FavoriteTrailers.Add(trailer);

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/FavoriteTrailers/5/10
        [HttpDelete("{userId}/{trailerId}")]
        public async Task<IActionResult> RemoveFavoriteTrailer(int userId, int trailerId)
        {
            var user = await _context.Users
                .Include(u => u.FavoriteTrailers)
                .FirstOrDefaultAsync(u => u.Id == userId);
            var trailer = await _context.Trailers.FindAsync(trailerId);

            if (user == null || trailer == null)
                return NotFound("Користувача або трейлера не знайдено");

            if (user.FavoriteTrailers.Contains(trailer))
                user.FavoriteTrailers.Remove(trailer);

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
