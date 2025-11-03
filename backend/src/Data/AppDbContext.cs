



using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions dbContextOptions) : base(dbContextOptions)
    {
        
    }

    public DbSet<Books> Book { get; set; }
    public DbSet<Users> Users { get; set; }
    public DbSet<Suppliers> Suppliers { get; set; }
    public DbSet<Categories> Categories { get; set; }
    public DbSet<Orders> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Promotions> Promotions { get; set; }
    public DbSet<Customers> Customers { get; set; }
    public DbSet<Inventory> Inventory { get; set; }
    public DbSet<Payments> Payments { get; set; }

}
