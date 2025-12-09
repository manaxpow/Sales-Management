public static class FileHelper
{
    /// <summary>
    /// Lưu file vào wwwroot/images/products và trả về đường dẫn tương đối
    /// </summary>
    public static async Task<string> SaveProductImage(IFormFile file, string productName)
    {
        if (file == null || file.Length == 0)
            return string.Empty;

        // Tạo tên file
        var fileName = "product" + "_" + Guid.NewGuid() + Path.GetExtension(file.FileName);

        // Đường dẫn tuyệt đối
        var savePath = Path.Combine(
            Directory.GetCurrentDirectory(),
            "wwwroot", "images", "products",
            fileName
        );

        // Tạo folder nếu chưa có
        var folder = Path.GetDirectoryName(savePath);
        if (!Directory.Exists(folder))
            Directory.CreateDirectory(folder);

        // Lưu file
        using (var stream = new FileStream(savePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Trả về đường dẫn tương đối để lưu vào DB
        return $"/images/products/{fileName}";
    }

    /// <summary>
    /// Xóa ảnh cũ trong wwwroot
    /// </summary>
    public static void DeleteImage(string? imagePath)
    {
        if (string.IsNullOrEmpty(imagePath) || imagePath == "/images/defaultImg.png")
            return;

        var fullPath = Path.Combine(
            Directory.GetCurrentDirectory(),
            "wwwroot",
            imagePath.TrimStart('/')
        );

        if (System.IO.File.Exists(fullPath))
        {
            System.IO.File.Delete(fullPath);
        }
    }
}
