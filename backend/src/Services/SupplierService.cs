using System.Text;
using backend.Contract.Supplier.Request;
using backend.Contract.Supplier.Response;
using Microsoft.EntityFrameworkCore;

public class SupplierService(AppDbContext context, ILogger<SupplierService> logger) : ISupplierService
{
    // [SỬA] Làm static method để tránh capture 'this' trong projection
    private static SupplierResponse ToResponse(Suppliers supplier) => new()
    {
        Id = supplier.Id,
        Name = supplier.Name,
        Phone = supplier.Phone,
        Email = supplier.Email,
        Address = supplier.Address,
        CreatedAt = supplier.CreatedAt,
        UpdatedAt = supplier.UpdatedAt
    };

    public async Task<SupplierResponse> AddSupplierAsync(CreateSupplierRequest request)
    {
        var existingSupplier = await context.Suppliers.AsNoTracking()
            .FirstOrDefaultAsync(s => s.Name == request.Name || s.Phone == request.Phone || s.Email == request.Email);

        if (existingSupplier != null)
        {
            var messages = new StringBuilder();
            if (existingSupplier.Name == request.Name) messages.Append("Tên nhà cung cấp đã tồn tại. ");
            if (existingSupplier.Phone == request.Phone) messages.Append("Số điện thoại đã tồn tại. ");
            if (existingSupplier.Email == request.Email) messages.Append("Email đã tồn tại. ");
            throw new InvalidOperationException(messages.ToString().Trim());
        }

        var supplier = new Suppliers
        {
            Name = request.Name,
            Phone = request.Phone,
            Email = request.Email,
            Address = request.Address,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        context.Suppliers.Add(supplier);
        await context.SaveChangesAsync();
        logger.LogInformation("Supplier added with ID: {Id}", supplier.Id);
        return ToResponse(supplier);  // Vẫn gọi bình thường (static không ảnh hưởng)
    }

    public async Task<IEnumerable<SupplierResponse>> GetSuppliersAsync()
    {
        // [SỬA] Bây giờ Select(s => ToResponse(s)) sẽ work vì static
        return await context.Suppliers
            .AsNoTracking()
            .Select(s => ToResponse(s))
            .ToListAsync();
    }

    public async Task<SupplierResponse?> GetSupplierByIdAsync(int id)
    {
        var supplier = await context.Suppliers.FindAsync(id);
        return supplier == null ? null : ToResponse(supplier);  // An toàn
    }

    public async Task<SupplierResponse?> UpdateSupplierAsync(int id, UpdateSupplierRequest request)
    {
        var supplier = await context.Suppliers.FindAsync(id);
        if (supplier == null) return null;

        var existingSupplier = await context.Suppliers.AsNoTracking()
            .FirstOrDefaultAsync(s => s.Id != id && (s.Name == request.Name || s.Phone == request.Phone || s.Email == request.Email));

        if (existingSupplier != null)
        {
            var messages = new StringBuilder();
            if (existingSupplier.Name == request.Name) messages.Append("Tên nhà cung cấp đã tồn tại. ");
            if (existingSupplier.Phone == request.Phone) messages.Append("Số điện thoại đã tồn tại. ");
            if (existingSupplier.Email == request.Email) messages.Append("Email đã tồn tại. ");
            throw new InvalidOperationException(messages.ToString().Trim());
        }

        supplier.Name = request.Name;
        supplier.Phone = request.Phone;
        supplier.Email = request.Email;
        supplier.Address = request.Address;
        supplier.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();
        logger.LogInformation("Supplier updated with ID: {Id}", supplier.Id);
        return ToResponse(supplier);  // An toàn
    }

    public async Task<bool> DeleteSupplierAsync(int id)
    {
        var supplier = await context.Suppliers.FindAsync(id);
        if (supplier == null) return false;

        context.Suppliers.Remove(supplier);
        await context.SaveChangesAsync();
        return true;
    }
}
