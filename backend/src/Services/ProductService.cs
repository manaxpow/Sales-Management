using Microsoft.EntityFrameworkCore;

public class ProductService : IProductService {
    private readonly AppDbContext _db;
    public ProductService(AppDbContext db) { _db = db; }

    public async Task<ApiResponse<object>> GetAll(
        string? keyword,
        int? categoryId,
        int? supplierId,
        decimal? minPrice,
        decimal? maxPrice,
        int page = 1,
        int pageSize = 10) {
        var q = _db.Products.AsQueryable();

        if (!string.IsNullOrWhiteSpace(keyword))
            q = q.Where(p =>
                p.ProductName.Contains(keyword) ||
                p.Barcode.Contains(keyword));

        if (categoryId.HasValue) q = q.Where(p => p.CategoryId == categoryId.Value);
        if (supplierId.HasValue) q = q.Where(p => p.Supplierid == supplierId.Value);
        if (minPrice.HasValue) q = q.Where(p => p.Price >= minPrice.Value);
        if (maxPrice.HasValue) q = q.Where(p => p.Price <= maxPrice.Value);

        q = q.OrderByDescending(p => p.CreatedAt);

        var totalItems = await q.CountAsync();
        var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);
        var items = await q.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        var data = new {
            items,
            pagination = new {
                page,
                pageSize,
                totalItems,
                totalPages
            }
        };

        return new ApiResponse<object>().SuccessResponse(data, "Fetched products successfully");
    }

    public async Task<ApiResponse<Products>> GetById(int id) {
        var p = await _db.Products.FindAsync(id);
        if (p == null) return new ApiResponse<Products>().ErrorResponse("Product not found", 404);
        return new ApiResponse<Products>().SuccessResponse(p);
    }

    public async Task<ApiResponse<Products>> Create(Products product) {
        if (product.CreatedAt == default) product.CreatedAt = DateTime.Now;

        _db.Products.Add(product);
        await _db.SaveChangesAsync();

        return new ApiResponse<Products>().SuccessResponse(product, "Created product successfully", 201);
    }

    public async Task<ApiResponse<Products>> Update(int id, Products product) {
        var p = await _db.Products.FindAsync(id);
        if (p == null) return new ApiResponse<Products>().ErrorResponse("Product not found", 404);

        p.CategoryId = product.CategoryId;
        p.Supplierid = product.Supplierid;
        p.ProductName = product.ProductName;
        p.Barcode = product.Barcode;
        p.Price = product.Price;
        p.Unit = product.Unit;
        p.CreatedAt = product.CreatedAt == default ? p.CreatedAt : product.CreatedAt;

        await _db.SaveChangesAsync();
        return new ApiResponse<Products>().SuccessResponse(p, "Updated product successfully");
    }

    public async Task<ApiResponse<string>> Delete(int id) {
        var p = await _db.Products.FindAsync(id);
        if (p == null) return new ApiResponse<string>().ErrorResponse("Product not found", 404);

        _db.Products.Remove(p);
        await _db.SaveChangesAsync();
        return new ApiResponse<string>().SuccessResponse("Deleted product successfully");
    }

    public async Task<ApiResponse<object>> GetBySupplier(int supplierId, int page = 1, int pageSize = 10) {
        var q = _db.Products.Where(p => p.Supplierid == supplierId)
                            .OrderByDescending(p => p.CreatedAt);

        var totalItems = await q.CountAsync();
        var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);
        var items = await q.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        var data = new {
            items,
            pagination = new {
                page,
                pageSize,
                totalItems,
                totalPages
            }
        };

        return new ApiResponse<object>().SuccessResponse(data, "Fetched products by supplier successfully");
    }
}
