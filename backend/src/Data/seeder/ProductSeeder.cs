
using Microsoft.EntityFrameworkCore;

public static class ProductSeeder
{

    public static async Task SeedAsync(AppDbContext context)
    {
        if (!await context.Products.AnyAsync())
            context.Products.AddRange(
                  new() { ProductId = 1, CategoryId = 2, SupplierId = 1, ProductName = "Coca Cola Lon", Barcode = "8900000000001", Price = 314838, Unit = "Hộp" },
                    new() { ProductId = 2, CategoryId = 1, SupplierId = 3, ProductName = "Pepsi Lon", Barcode = "8900000000002", Price = 114807, Unit = "Cái" },
                    new() { ProductId = 3, CategoryId = 3, SupplierId = 3, ProductName = "Trà Xanh 0 độ", Barcode = "8900000000003", Price = 415725, Unit = "Tuýp" },
                    new() { ProductId = 4, CategoryId = 2, SupplierId = 1, ProductName = "Sting dâu", Barcode = "8900000000004", Price = 351670, Unit = "Cái" },
                    new() { ProductId = 5, CategoryId = 3, SupplierId = 2, ProductName = "Red Bull", Barcode = "8900000000005", Price = 402179, Unit = "Lon" },
                    new() { ProductId = 6, CategoryId = 2, SupplierId = 2, ProductName = "Bánh Oreo", Barcode = "8900000000006", Price = 209283, Unit = "Chai" },
                    new() { ProductId = 7, CategoryId = 5, SupplierId = 3, ProductName = "Bánh Chocopie", Barcode = "8900000000007", Price = 212528, Unit = "Lon" },
                    new() { ProductId = 8, CategoryId = 1, SupplierId = 2, ProductName = "Kẹo Alpenliebe", Barcode = "8900000000008", Price = 34313, Unit = "Lon" },
                    new() { ProductId = 9, CategoryId = 5, SupplierId = 1, ProductName = "Kẹo bạc hà", Barcode = "8900000000009", Price = 316289, Unit = "Cái" },
                    new() { ProductId = 10, CategoryId = 1, SupplierId = 2, ProductName = "Socola KitKat", Barcode = "8900000000010", Price = 139959, Unit = "Chai" },
                    new() { ProductId = 11, CategoryId = 5, SupplierId = 1, ProductName = "Nước mắm Nam Ngư", Barcode = "8900000000011", Price = 51792, Unit = "Chai" },
                    new() { ProductId = 12, CategoryId = 2, SupplierId = 2, ProductName = "Nước tương Maggi", Barcode = "8900000000012", Price = 462539, Unit = "Lon" },
                    new() { ProductId = 13, CategoryId = 5, SupplierId = 3, ProductName = "Muối i-ốt", Barcode = "8900000000013", Price = 173302, Unit = "Cái" },
                    new() { ProductId = 14, CategoryId = 1, SupplierId = 1, ProductName = "Bột ngọt Ajinomoto", Barcode = "8900000000014", Price = 443069, Unit = "Cái" },
                    new() { ProductId = 15, CategoryId = 2, SupplierId = 2, ProductName = "Dầu ăn Tường An", Barcode = "8900000000015", Price = 281354, Unit = "Tuýp" },
                    new() { ProductId = 16, CategoryId = 2, SupplierId = 1, ProductName = "Nồi cơm điện", Barcode = "8900000000016", Price = 405347, Unit = "Hộp" },
                    new() { ProductId = 17, CategoryId = 1, SupplierId = 3, ProductName = "Ấm siêu tốc", Barcode = "8900000000017", Price = 113087, Unit = "Chai" },
                    new() { ProductId = 18, CategoryId = 3, SupplierId = 2, ProductName = "Quạt máy", Barcode = "8900000000018", Price = 69968, Unit = "Hộp" },
                    new() { ProductId = 19, CategoryId = 4, SupplierId = 1, ProductName = "Bếp gas mini", Barcode = "8900000000019", Price = 416845, Unit = "Lon" },
                    new() { ProductId = 20, CategoryId = 3, SupplierId = 3, ProductName = "Máy xay sinh tố", Barcode = "8900000000020", Price = 334564, Unit = "Hộp" },
                    new() { ProductId = 21, CategoryId = 1, SupplierId = 1, ProductName = "Sữa rửa mặt Hazeline", Barcode = "8900000000021", Price = 188475, Unit = "Lon" },
                    new() { ProductId = 22, CategoryId = 4, SupplierId = 1, ProductName = "Kem dưỡng da Pond's", Barcode = "8900000000022", Price = 413840, Unit = "Hộp" },
                    new() { ProductId = 23, CategoryId = 3, SupplierId = 3, ProductName = "Dầu gội Sunsilk", Barcode = "8900000000023", Price = 158950, Unit = "Tuýp" },
                    new() { ProductId = 24, CategoryId = 4, SupplierId = 2, ProductName = "Sữa tắm Dove", Barcode = "8900000000024", Price = 336928, Unit = "Chai" },
                    new() { ProductId = 25, CategoryId = 1, SupplierId = 1, ProductName = "Nước hoa Romano", Barcode = "8900000000025", Price = 352508, Unit = "Cái" },
                    new() { ProductId = 26, CategoryId = 1, SupplierId = 1, ProductName = "Cà phê G7", Barcode = "8900000000026", Price = 201228, Unit = "Lon" },
                    new() { ProductId = 27, CategoryId = 2, SupplierId = 1, ProductName = "Trà Lipton", Barcode = "8900000000027", Price = 38039, Unit = "Cái" },
                    new() { ProductId = 28, CategoryId = 2, SupplierId = 3, ProductName = "Sữa Vinamilk", Barcode = "8900000000028", Price = 252845, Unit = "Chai" },
                    new() { ProductId = 29, CategoryId = 3, SupplierId = 1, ProductName = "Sữa TH True Milk", Barcode = "8900000000029", Price = 35278, Unit = "Hộp" },
                    new() { ProductId = 30, CategoryId = 3, SupplierId = 2, ProductName = "Nước suối Lavie", Barcode = "8900000000030", Price = 331637, Unit = "Lon" },
                    new() { ProductId = 31, CategoryId = 5, SupplierId = 3, ProductName = "Khăn giấy Tempo", Barcode = "8900000000031", Price = 102525, Unit = "Chai" },
                    new() { ProductId = 32, CategoryId = 4, SupplierId = 3, ProductName = "Giấy vệ sinh Pulppy", Barcode = "8900000000032", Price = 495429, Unit = "Chai" },
                    new() { ProductId = 33, CategoryId = 3, SupplierId = 2, ProductName = "Bình nước Lock&Lock", Barcode = "8900000000033", Price = 354771, Unit = "Gói" },
                    new() { ProductId = 34, CategoryId = 2, SupplierId = 1, ProductName = "Hộp nhựa Tupperware", Barcode = "8900000000034", Price = 297415, Unit = "Cái" },
                    new() { ProductId = 35, CategoryId = 1, SupplierId = 3, ProductName = "Dao Inox", Barcode = "8900000000035", Price = 47523, Unit = "Hộp" },
                    new() { ProductId = 36, CategoryId = 3, SupplierId = 1, ProductName = "Bàn chải Colgate", Barcode = "8900000000036", Price = 136417, Unit = "Chai" },
                    new() { ProductId = 37, CategoryId = 2, SupplierId = 2, ProductName = "Kem đánh răng P/S", Barcode = "8900000000037", Price = 93713, Unit = "Hộp" },
                    new() { ProductId = 38, CategoryId = 2, SupplierId = 3, ProductName = "Nước súc miệng Listerine", Barcode = "8900000000038", Price = 223906, Unit = "Gói" },
                    new() { ProductId = 39, CategoryId = 1, SupplierId = 2, ProductName = "Bông tẩy trang", Barcode = "8900000000039", Price = 317819, Unit = "Tuýp" },
                    new() { ProductId = 40, CategoryId = 4, SupplierId = 1, ProductName = "Khẩu trang 3M", Barcode = "8900000000040", Price = 464252, Unit = "Gói" },
                    new() { ProductId = 41, CategoryId = 3, SupplierId = 1, ProductName = "Bánh mì sandwich", Barcode = "8900000000041", Price = 279350, Unit = "Cái" },
                    new() { ProductId = 42, CategoryId = 5, SupplierId = 2, ProductName = "Mì Gói Hảo Hảo", Barcode = "8900000000042", Price = 9413, Unit = "Hộp" },
                    new() { ProductId = 43, CategoryId = 1, SupplierId = 2, ProductName = "Mì Omachi", Barcode = "8900000000043", Price = 26616, Unit = "Hộp" },
                    new() { ProductId = 44, CategoryId = 5, SupplierId = 2, ProductName = "Bún khô", Barcode = "8900000000044", Price = 350911, Unit = "Gói" },
                    new() { ProductId = 45, CategoryId = 3, SupplierId = 1, ProductName = "Phở ăn liền", Barcode = "8900000000045", Price = 407779, Unit = "Tuýp" },
                    new() { ProductId = 46, CategoryId = 1, SupplierId = 1, ProductName = "Nước ngọt Sprite", Barcode = "8900000000046", Price = 230083, Unit = "Hộp" },
                    new() { ProductId = 47, CategoryId = 1, SupplierId = 3, ProductName = "Trà sữa đóng Chai", Barcode = "8900000000047", Price = 15130, Unit = "Cái" },
                    new() { ProductId = 48, CategoryId = 3, SupplierId = 3, ProductName = "Snack Oishi", Barcode = "8900000000048", Price = 43415, Unit = "Cái" },
                    new() { ProductId = 49, CategoryId = 4, SupplierId = 2, ProductName = "Snack Lay's", Barcode = "8900000000049", Price = 83536, Unit = "Tuýp" },
                    new() { ProductId = 50, CategoryId = 1, SupplierId = 2, ProductName = "Kẹo dẻo Haribo", Barcode = "8900000000050", Price = 328680, Unit = "Cái"  }
            );
        await context.SaveChangesAsync();
    }
}



