using blazor_web.Models;

public class CustomerService
{
    private List<Customer> _customers;

    public CustomerService()
    {
        _customers = new List<Customer>
        {
            new Customer { CustomerId = 3, Name = "thanh nam", Phone = "0328680661", Email = "nam1@gmail.com", Address = "awd", CreatedAt = DateTime.Parse("2025-11-03 11:44:01"), UpdatedAt = DateTime.Parse("2025-11-03 11:44:01") },
            new Customer { CustomerId = 4, Name = "đưaaawd", Phone = "0977461135", Email = "da@gmail.com", Address = "đưaa", CreatedAt = DateTime.Parse("2025-11-03 11:54:49"), UpdatedAt = DateTime.Parse("2025-11-03 11:54:49") }
        };
    }

    public List<Customer> GetAll() => _customers.OrderByDescending(x => x.CustomerId).ToList();

    public Customer? GetById(int id) => _customers.FirstOrDefault(x => x.CustomerId == id);

    public void Add(Customer customer)
    {
        customer.CustomerId = _customers.Max(x => x.CustomerId) + 1;
        customer.CreatedAt = DateTime.Now;
        customer.UpdatedAt = DateTime.Now;
        _customers.Add(customer);
    }

    public void Update(Customer customer)
    {
        var existing = GetById(customer.CustomerId);
        if (existing != null)
        {
            existing.Name = customer.Name;
            existing.Phone = customer.Phone;
            existing.Email = customer.Email;
            existing.Address = customer.Address;
            existing.UpdatedAt = DateTime.Now;
        }
    }

    public void Delete(int id)
    {
        var item = GetById(id);
        if (item != null) _customers.Remove(item);
    }
}