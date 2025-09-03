using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebNetflix.Data;
using WebNetflix.Models.Dto;

namespace WebNetflix.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GenresController : ControllerBase
    {
        private readonly AppDbContext _db;
        public GenresController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GenreDto>>> GetGenres()
        {
            var genres = await _db.Genres
                .AsNoTracking()
                .OrderBy(g => g.Name)
                .Select(g => new GenreDto { Id = g.Id, Name = g.Name })
                .ToListAsync();

            return Ok(genres);
        }
    }
}
