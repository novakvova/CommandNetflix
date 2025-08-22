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
        public async Task<ActionResult<IEnumerable<Trailer>>> GetTrailers()
        {
            return await _context.Trailers.ToListAsync();
        }

        // GET: api/trailers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Trailer>> GetTrailer(int id)
        {
            var trailer = await _context.Trailers.FindAsync(id);

            if (trailer == null)
                return NotFound();

            return trailer;
        }

        // POST: api/trailers
        [HttpPost]
        public async Task<ActionResult<Trailer>> PostTrailer(Trailer trailer)
        {
            _context.Trailers.Add(trailer);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTrailer), new { id = trailer.Id }, trailer);
        }

        // PUT: api/trailers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTrailer(int id, Trailer trailer)
        {
            if (id != trailer.Id)
                return BadRequest();

            _context.Entry(trailer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Trailers.Any(e => e.Id == id))
                    return NotFound();

                throw;
            }

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
