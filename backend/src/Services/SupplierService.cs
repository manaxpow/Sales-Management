

using System.Text;
using System.Text.RegularExpressions;
using backend.Contract.Supplier.Request;
using backend.Contract.Supplier.Response;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging; 


public class ServiceResponse<T>
{
    public T? Data { get; set; }
    public string Message { get; set; } = string.Empty;
    public bool Success { get; set; } = true;
}

public class SupplierService(AppDbContext context, ILogger<SupplierService> logger) : ISupplierService
{
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

    private bool IsValidEmail(string email)
    {
        string emailRegex = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
        return Regex.IsMatch(email, emailRegex);
    }

    private bool IsValidPhoneNumber(string phone)
    {
        return Regex.IsMatch(phone, @"^0(9|3)\d{8}$");
    }

    private ServiceResponse<T> ValidateSupplierRequest<T>(ISupplierRequest request, ServiceResponse<T> response)
    {
        var messages = new StringBuilder();

        if (string.IsNullOrWhiteSpace(request.Name)) messages.Append("Tên nhà cung cấp không được trống. ");
        if (string.IsNullOrWhiteSpace(request.Phone)) messages.Append("Số điện thoại không được trống. ");
        if (string.IsNullOrWhiteSpace(request.Email)) messages.Append("Email không được trống. ");
        if (string.IsNullOrWhiteSpace(request.Address)) messages.Append("Địa chỉ không được trống. ");

        if (messages.Length > 0)
        {
            response.Message = messages.ToString().Trim();
            response.Success = false;
            return response;
        }

        if (!IsValidPhoneNumber(request.Phone)) messages.Append("Số điện thoại không hợp lệ (Phải là 10 số, bắt đầu bằng 09 hoặc 03). ");
        
        if (!IsValidEmail(request.Email)) messages.Append("Email sai định dạng. ");
        
        if (messages.Length > 0)
        {
            response.Message = messages.ToString().Trim();
            response.Success = false;
        }
        
        return response;
    }


    public async Task<ServiceResponse<SupplierResponse>> AddSupplierAsync(CreateSupplierRequest request)
    {
        var response = new ServiceResponse<SupplierResponse>();

        var validationResult = ValidateSupplierRequest(request, response);
        if (!validationResult.Success)
        {
            return validationResult;
        }

        var existingSupplier = await context.Suppliers.AsNoTracking()
            .FirstOrDefaultAsync(s => s.Name == request.Name || s.Phone == request.Phone || s.Email == request.Email || s.Address == request.Address);

        if (existingSupplier != null)
        {
            var messages = new StringBuilder();
            if (existingSupplier.Name == request.Name) messages.Append("Tên nhà cung cấp đã tồn tại. ");
            if (existingSupplier.Phone == request.Phone) messages.Append("Số điện thoại đã tồn tại. ");
            if (existingSupplier.Email == request.Email) messages.Append("Email đã tồn tại. ");
            if (existingSupplier.Address == request.Address) messages.Append("Địa chỉ đã tồn tại. ");
            
            response.Message = messages.ToString().Trim();
            response.Success = false;
            return response;
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
        response.Data = ToResponse(supplier);
        return response; 
    }

    public async Task<ServiceResponse<IEnumerable<SupplierResponse>>> GetSuppliersAsync()
    {
        var response = new ServiceResponse<IEnumerable<SupplierResponse>>();
        var suppliers = await context.Suppliers
            .AsNoTracking()
            .Select(s => ToResponse(s))
            .ToListAsync();
        response.Data = suppliers;
        return response; 
    }

    public async Task<ServiceResponse<SupplierResponse>> GetSupplierByIdAsync(int id)
    {
        var response = new ServiceResponse<SupplierResponse>();
        var supplier = await context.Suppliers.FindAsync(id);
        if (supplier == null)
        {
            response.Success = false;
            response.Message = "Supplier not found";
            return response;
        }
        response.Data = ToResponse(supplier);
        return response; 
    }

    public async Task<ServiceResponse<SupplierResponse>> UpdateSupplierAsync(UpdateSupplierRequest request)
    {
        var response = new ServiceResponse<SupplierResponse>();

        var validationResult = ValidateSupplierRequest(request, response);
        if (!validationResult.Success)
        {
            return validationResult;
        }

        var supplier = await context.Suppliers.FindAsync(request.Id); 
        if (supplier == null)
        {
            response.Success = false;
            response.Message = "Supplier not found";
            return response;
        }

        var existingSupplier = await context.Suppliers.AsNoTracking()
            .FirstOrDefaultAsync(s => s.Id != request.Id && (s.Name == request.Name || s.Phone == request.Phone || s.Email == request.Email || s.Address == request.Address));

        if (existingSupplier != null)
        {
            var messages = new StringBuilder();
            if (existingSupplier.Name == request.Name) messages.Append("Tên nhà cung cấp đã tồn tại. ");
            if (existingSupplier.Phone == request.Phone) messages.Append("Số điện thoại đã tồn tại. ");
            if (existingSupplier.Email == request.Email) messages.Append("Email đã tồn tại. ");
            if (existingSupplier.Address == request.Address) messages.Append("Địa chỉ đã tồn tại. ");
            
            response.Message = messages.ToString().Trim();
            response.Success = false;
            return response;
        }

        supplier.Name = request.Name;
        supplier.Phone = request.Phone;
        supplier.Email = request.Email;
        supplier.Address = request.Address;
        supplier.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();
        logger.LogInformation("Supplier updated with ID: {Id}", supplier.Id);
        response.Data = ToResponse(supplier);
        return response; 
    }

    public async Task<ServiceResponse<bool>> DeleteSupplierAsync(int id)
    {
        var response = new ServiceResponse<bool>();
        var supplier = await context.Suppliers.FindAsync(id);
        if (supplier == null)
        {
            response.Success = false;
            response.Message = "Supplier not found";
            return response;
        }

        context.Suppliers.Remove(supplier);
        await context.SaveChangesAsync();
        response.Data = true;
        return response; 
    }
}