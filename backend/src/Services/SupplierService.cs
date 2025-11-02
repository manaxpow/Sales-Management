using Microsoft.EntityFrameworkCore;

public class SupplierService : ISupplierService {
    private readonly AppDbContext _db;
    public SupplierService(AppDbContext db) { _db = db; }

    public async Task<ApiResponse<IEnumerable<Suppliers>>> GetAll() {
        var list = await _db.Suppliers
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync();

        return new ApiResponse<IEnumerable<Suppliers>>()
            .SuccessResponse(list, "Fetched suppliers successfully");
    }

    public async Task<ApiResponse<Suppliers>> GetById(int id) {
        var sup = await _db.Suppliers.FindAsync(id);
        if (sup == null) return new ApiResponse<Suppliers>().ErrorResponse("Supplier not found", 404);
        return new ApiResponse<Suppliers>().SuccessResponse(sup);
    }

    public async Task<ApiResponse<Suppliers>> Create(Suppliers supplier) {
        if (supplier.CreatedAt == default) supplier.CreatedAt = DateTime.Now;
        supplier.UpdatedAt = supplier.CreatedAt;

        _db.Suppliers.Add(supplier);
        await _db.SaveChangesAsync();

        return new ApiResponse<Suppliers>().SuccessResponse(supplier, "Created supplier successfully", 201);
    }

    public async Task<ApiResponse<Suppliers>> Update(int id, Suppliers supplier) {
        var sup = await _db.Suppliers.FindAsync(id);
        if (sup == null) return new ApiResponse<Suppliers>().ErrorResponse("Supplier not found", 404);

        sup.Name = supplier.Name;
        sup.Phone = supplier.Phone;
        sup.Email = supplier.Email;
        sup.Address = supplier.Address;
        sup.CreatedAt = supplier.CreatedAt == default ? sup.CreatedAt : supplier.CreatedAt;
        sup.UpdatedAt = DateTime.Now;

        await _db.SaveChangesAsync();
        return new ApiResponse<Suppliers>().SuccessResponse(sup, "Updated supplier successfully");
    }

    public async Task<ApiResponse<string>> Delete(int id) {
        var sup = await _db.Suppliers.FindAsync(id);
        if (sup == null) return new ApiResponse<string>().ErrorResponse("Supplier not found", 404);

        _db.Suppliers.Remove(sup);
        await _db.SaveChangesAsync();
        return new ApiResponse<string>().SuccessResponse("Deleted supplier successfully");
    }
}
