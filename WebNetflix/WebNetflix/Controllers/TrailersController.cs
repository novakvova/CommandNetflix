using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebNetflix.Data;
using WebNetflix.Models;

namespace WebNetflix.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TrailersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TrailersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/trailers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TrailerDto>>> GetTrailers([FromQuery] string? search)
        {
            var query = _context.Trailers.Include(t => t.Genres).AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.Trim().ToLower();
                query = query.Where(t => t.Title.ToLower().Contains(s));
            }

            var trailers = await query.ToListAsync();

            // Мапимо на DTO
            var dtos = trailers.Select(t => new TrailerDto
            {
                Id = t.Id,
                Title = t.Title,
                ImageUrl = t.ImageUrl,
                YouTubeCode = t.YouTubeCode,
                Rating = t.Rating,
                Description = t.Description,
                Genres = t.Genres.Select(g => new GenreDto { Id = g.Id, Name = g.Name }).ToList()
            });

            return Ok(dtos);
        }

        // GET: api/trailers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TrailerDto>> GetTrailer(int id)
        {
            var trailer = await _context.Trailers
                .Include(t => t.Genres)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (trailer == null)
                return NotFound();

            var dto = new TrailerDto
            {
                Id = trailer.Id,
                Title = trailer.Title,
                ImageUrl = trailer.ImageUrl,
                YouTubeCode = trailer.YouTubeCode,
                Rating = trailer.Rating,
                Description = trailer.Description,
                Genres = trailer.Genres.Select(g => new GenreDto { Id = g.Id, Name = g.Name }).ToList()
            };

            return Ok(dto);
        }

        // POST: api/trailers
        [HttpPost]
        public async Task<ActionResult<TrailerDto>> PostTrailer([FromBody] TrailerCreateDto dto)
        {
            var trailer = new Trailer
            {
                Title = dto.Title,
                ImageUrl = dto.ImageUrl,
                YouTubeCode = dto.YouTubeCode,
                Rating = dto.Rating,
                Description = dto.Description
            };

            if (dto.GenresIds.Any())
            {
                trailer.Genres = await _context.Genres
                    .Where(g => dto.GenresIds.Contains(g.Id))
                    .ToListAsync();
            }

            _context.Trailers.Add(trailer);
            await _context.SaveChangesAsync();

            var resultDto = new TrailerDto
            {
                Id = trailer.Id,
                Title = trailer.Title,
                ImageUrl = trailer.ImageUrl,
                YouTubeCode = trailer.YouTubeCode,
                Rating = trailer.Rating,
                Description = trailer.Description,
                Genres = trailer.Genres.Select(g => new GenreDto { Id = g.Id, Name = g.Name }).ToList()
            };

            return CreatedAtAction(nameof(GetTrailer), new { id = trailer.Id }, resultDto);
        }

        // PUT: api/trailers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTrailer(int id, TrailerCreateDto dto)
        {
            var trailer = await _context.Trailers
                .Include(t => t.Genres)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (trailer == null)
                return NotFound();

            // Оновлюємо поля
            trailer.Title = dto.Title;
            trailer.ImageUrl = dto.ImageUrl;
            trailer.YouTubeCode = dto.YouTubeCode;
            trailer.Rating = dto.Rating;
            trailer.Description = dto.Description;

            // Оновлюємо жанри
            trailer.Genres.Clear();
            if (dto.GenresIds.Any())
            {
                var genres = await _context.Genres
                    .Where(g => dto.GenresIds.Contains(g.Id))
                    .ToListAsync();
                trailer.Genres = genres;
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/trailers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTrailer(int id)
        {
            var trailer = await _context.Trailers.FindAsync(id);
            if (trailer == null)
                return NotFound();

            _context.Trailers.Remove(trailer);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
