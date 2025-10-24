using Microsoft.EntityFrameworkCore;

public class SupplierService(AppDbContext context, ILogger<SupplierService> logger) : ISupplierService
{
    // --- Helper ---
    private SupplierResponse ToResponse(Suppliers supplier) => new SupplierResponse
    {
        Id = supplier.Id,
        Name = supplier.Name,
        Phone = supplier.Phone,
        Email = supplier.Email,
        Address = supplier.Address,
        CreatedAt = supplier.CreatedAt,
        UpdatedAt = supplier.UpdatedAt
    };
    // --- CREATE ---
    public async Task<SupplierResponse> AddSupplierAsync(CreateSupplierRequest request)
    {
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
        logger.LogInformation("Supplier added successfully with ID: {Id}", supplier.Id);

        return ToResponse(supplier);
    }
    // --- READ ALL ---
    public async Task<IEnumerable<SupplierResponse>> GetSuppliersAsync()
    {
        var suppliers = await context.Suppliers.AsNoTracking().ToListAsync();
        return suppliers.Select(ToResponse);
    }

    // --- READ BY ID ---
    public async Task<SupplierResponse?> GetSupplierByIdAsync(int id)
    {
        var supplier = await context.Suppliers.FindAsync(id);
        return supplier == null ? null : ToResponse(supplier);
    }

    // --- UPDATE ---
    public async Task<SupplierResponse?> UpdateSupplierAsync(int id, UpdateSupplierRequest request)
    {
        var supplier = await context.Suppliers.FindAsync(id);
        if (supplier == null) return null;

        supplier.Name = request.Name;
        supplier.Phone = request.Phone;
        supplier.Email = request.Email;
        supplier.Address = request.Address;
        supplier.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();
        logger.LogInformation("Supplier updated successfully with ID: {Id}", supplier.Id);

        return ToResponse(supplier);
    }

    // --- DELETE --- 
    public async Task<bool> DeleteSupplierAsync(int id)
    {
        var supplier = await context.Suppliers.FindAsync(id);
        if (supplier == null) return false;

        context.Suppliers.Remove(supplier);
        await context.SaveChangesAsync();
        return true;
    }

    // --- DELETE (check tồn tại product)---
    // public async Task<bool> DeleteSupplierAsync(int id)
    // {
    //     var hasProducts = await productService.HasProductsBySupplierIdAsync(id);
    //     if (hasProducts)
    //     {
    //         logger.LogWarning("Cannot delete Supplier ID {Id}", id);
    //         return false;
    //     }

    //     var supplier = await context.Suppliers.FindAsync(id);
    //     if (supplier == null) return false;

    //     context.Suppliers.Remove(supplier);
    //     await context.SaveChangesAsync();
    //     logger.LogInformation("Supplier ID {Id} deleted successfully.", id);
    //     return true;
    // }

}




