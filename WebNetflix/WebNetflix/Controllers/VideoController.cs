using Microsoft.AspNetCore.Mvc;

namespace WebNetflix.Controllers
{
    public class VideoController : Controller
    {
        [HttpGet("video")]
        public IActionResult GetVideo()
        {
            var videoPath = Path.Combine("Videos", "sample.mp4");
            Console.WriteLine(videoPath);
            var stream = new FileStream(videoPath, FileMode.Open, FileAccess.Read, FileShare.Read);
            return File(stream, "video/mp4", enableRangeProcessing: true);
        }
    }
}
