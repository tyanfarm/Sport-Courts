namespace BE.Services;

public interface IImageUploader {
    Task<string> Upload(IFormFile file, string folder, string filename);
}