using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebNetflix.Data;
using WebNetflix.Models;
using WebNetflix.Models.Dto;

namespace WebNetflix.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TrailersController : ControllerBase
    {
        private readonly AppDbContext _db;
        public TrailersController(AppDbContext db) => _db = db;

        // GET: api/trailers?genreId=1&sort=titleAsc
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TrailerDto>>> GetTrailers(
            [FromQuery] int? genreId,
            [FromQuery] string? sort,
            [FromQuery] string? search)
        {
            var q = _db.Trailers
                .AsNoTracking()
                .Include(t => t.Genres)
                .AsQueryable();

            if (genreId.HasValue)
                q = q.Where(t => t.Genres.Any(g => g.Id == genreId.Value));

            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.Trim().ToLower();
                q = q.Where(t => t.Title.ToLower().Contains(s));
            }

            q = sort switch
            {
                "titleAsc" => q.OrderBy(t => t.Title),
                "titleDesc" => q.OrderByDescending(t => t.Title),
                "ratingAsc" => q.OrderBy(t => t.Rating).ThenBy(t => t.Title),
                "ratingDesc" => q.OrderByDescending(t => t.Rating).ThenBy(t => t.Title),
                _ => q
            };

            var data = await q.Select(t => new TrailerDto
            {
                Id = t.Id,
                Title = t.Title,
                ImageUrl = t.ImageUrl,
                YouTubeCode = t.YouTubeCode,
                Rating = t.Rating,
                Description = t.Description,
                Genres = t.Genres
                    .OrderBy(g => g.Name)
                    .Select(g => new GenreDto { Id = g.Id, Name = g.Name })
                    .ToList()
            }).ToListAsync();

            return Ok(data);
        }

        // GET: api/trailers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TrailerDto>> GetTrailer(int id)
        {
            var t = await _db.Trailers
                .AsNoTracking()
                .Include(tr => tr.Genres)
                .FirstOrDefaultAsync(tr => tr.Id == id);

            if (t == null)
                return NotFound();

            return new TrailerDto
            {
                Id = t.Id,
                Title = t.Title,
                ImageUrl = t.ImageUrl,
                YouTubeCode = t.YouTubeCode,
                Rating = t.Rating,
                Description = t.Description,
                Genres = t.Genres
                    .OrderBy(g => g.Name)
                    .Select(g => new GenreDto { Id = g.Id, Name = g.Name })
                    .ToList()
            };
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

            if (dto.GenresIds?.Any() == true)
            {
                trailer.Genres = await _db.Genres
                    .Where(g => dto.GenresIds.Contains(g.Id))
                    .ToListAsync();
            }

            _db.Trailers.Add(trailer);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTrailer), new { id = trailer.Id }, new TrailerDto
            {
                Id = trailer.Id,
                Title = trailer.Title,
                ImageUrl = trailer.ImageUrl,
                YouTubeCode = trailer.YouTubeCode,
                Rating = trailer.Rating,
                Description = trailer.Description,
                Genres = trailer.Genres.Select(g => new GenreDto { Id = g.Id, Name = g.Name }).ToList()
            });
        }

        // PUT: api/trailers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTrailer(int id, [FromBody] TrailerCreateDto dto)
        {
            var trailer = await _db.Trailers
                .Include(t => t.Genres)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (trailer == null)
                return NotFound();

            trailer.Title = dto.Title;
            trailer.ImageUrl = dto.ImageUrl;
            trailer.YouTubeCode = dto.YouTubeCode;
            trailer.Rating = dto.Rating;
            trailer.Description = dto.Description;

            // оновлення жанрів
            trailer.Genres.Clear();
            if (dto.GenresIds?.Any() == true)
            {
                var genres = await _db.Genres
                    .Where(g => dto.GenresIds.Contains(g.Id))
                    .ToListAsync();
                foreach (var g in genres)
                    trailer.Genres.Add(g);
            }

            await _db.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/trailers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTrailer(int id)
        {
            var trailer = await _db.Trailers.FindAsync(id);
            if (trailer == null)
                return NotFound();

            _db.Trailers.Remove(trailer);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}
