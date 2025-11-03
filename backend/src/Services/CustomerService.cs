using Microsoft.EntityFrameworkCore;

public class CustomerService : ICustomerService {
    private readonly AppDbContext _context;

    public CustomerService(AppDbContext context) {
        _context = context;
    }

    public async Task<bool> CheckExistCustomer(string? email, string? phone, int? id = null)
{
    var query = _context.Customers.AsNoTracking().AsQueryable();

    if (id.HasValue)
        query = query.Where(c => c.CustomerId != id.Value);

    if (!string.IsNullOrWhiteSpace(email) || !string.IsNullOrWhiteSpace(phone))
        return await query.AnyAsync(c => c.Email == email || c.Phone == phone);

    if (!string.IsNullOrWhiteSpace(email))
        return await query.AnyAsync(c => c.Email == email);

    if (!string.IsNullOrWhiteSpace(phone))
        return await query.AnyAsync(c => c.Phone == phone);

    return false;
}

    public async Task<ApiResponse<CustomerResponse>> CreateCustomer(CreateCustomerRequest newCustomer)
    {
        if (await CheckExistCustomer(newCustomer.Email, newCustomer.Phone))
            return new ApiResponse<CustomerResponse>().ErrorResponse("Customer already exists, check your email or phone", 400);

        var customer = new Customers
        {
            Name = newCustomer.Name,
            Email = newCustomer.Email,
            Phone = newCustomer.Phone,
            Address = newCustomer.Address,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();

        return new ApiResponse<CustomerResponse>().SuccessResponse(new CustomerResponse
        {
            Id = customer.CustomerId,
            Name = customer.Name,
            Email = customer.Email,
            Phone = customer.Phone,
            Address = customer.Address,
            CreatedAt = customer.CreatedAt,
            UpdatedAt = customer.UpdatedAt
        }, "Created customer successfully", 201);
    }   
        
    
    public async Task<ApiResponse<string>> DeleteCustomer(int id)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer == null)
            return new ApiResponse<string>().ErrorResponse("Customer not found", 404);

        _context.Customers.Remove(customer);
        await _context.SaveChangesAsync();
        return new ApiResponse<string>().SuccessResponse("Deleted customer successfully");
    }


public async Task<ApiResponse<GetCustomerResponse>> GetAllCustomer(GetCustomerRequest request)
{
    var query = _context.Customers.AsNoTracking().AsQueryable();

    // Search theo name/phone/email
    if (!string.IsNullOrWhiteSpace(request.Search))
    {
        var kw = request.Search.Trim();
        var pattern = $"%{kw}%"; 

        query = query.Where(c =>
            EF.Functions.Like(c.Name, pattern) ||
            EF.Functions.Like(c.Phone, pattern) ||
            EF.Functions.Like(c.Email, pattern));
    }

    // Phân trang
    var limit = request.Limit.GetValueOrDefault(10);
    var page  = request.Page.GetValueOrDefault(1);
    if (page  < 1)  page = 1;

    var total = await query.CountAsync();

    var customers = await query
        .OrderByDescending(c => c.CreatedAt)
        .Skip((page - 1) * limit)
        .Take(limit)
        .Select(c => new CustomerResponse
        {
            Id        = c.CustomerId, 
            Name      = c.Name,
            Phone     = c.Phone,
            Email     = c.Email,
            Address   = c.Address,
            CreatedAt = c.CreatedAt,
            UpdatedAt = c.UpdatedAt
        })
        .ToListAsync();

    var payload = new GetCustomerResponse
    {
        Customers  = customers,
        Total      = total,
        CurrentPage = page,                          
        TotalPage = (int)Math.Ceiling(total / (double)limit)
    };

    return new ApiResponse<GetCustomerResponse>()
        .SuccessResponse(payload, "Fetched customers successfully");
}



    public async Task<ApiResponse<CustomerResponse>> GetCustomerById(int id)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer == null)
            return new ApiResponse<CustomerResponse>().ErrorResponse("Customer not found", 404);

        return new ApiResponse<CustomerResponse>().SuccessResponse(new CustomerResponse
        {
            Id = customer.CustomerId,
            Name = customer.Name,
            Email = customer.Email,
            Phone = customer.Phone,
            Address = customer.Address,
            CreatedAt = customer.CreatedAt,
            UpdatedAt = customer.UpdatedAt
        });
    }

    public async Task<ApiResponse<CustomerResponse>> UpdateCustomer(int id, UpdateCustomerRequest updatedCustomer)
    {
        if(await CheckExistCustomer(updatedCustomer.Email, updatedCustomer.Phone, id))
            return new ApiResponse<CustomerResponse>().ErrorResponse("Customer already exists, check your email or phone", 400);

        var customer = await _context.Customers.FindAsync(id);
        if (customer == null)
            return new ApiResponse<CustomerResponse>().ErrorResponse("Customer not found", 404);

        customer.Name = updatedCustomer.Name;
        customer.Email = updatedCustomer.Email;
        customer.Phone = updatedCustomer.Phone;
        customer.Address = updatedCustomer.Address;
        customer.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new ApiResponse<CustomerResponse>().SuccessResponse(new CustomerResponse
        {
            Id = customer.CustomerId,
            Name = customer.Name,
            Email = customer.Email,
            Phone = customer.Phone,
            Address = customer.Address,
            CreatedAt = customer.CreatedAt,
            UpdatedAt = customer.UpdatedAt
        }, "Updated customer successfully", 200);
    }
}
