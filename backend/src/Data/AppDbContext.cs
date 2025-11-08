



using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions dbContextOptions) : base(dbContextOptions)
    {


    }
    public DbSet<Products> Products { get; set; }
    public DbSet<Users> Users { get; set; }
    public DbSet<Suppliers> Suppliers { get; set; }
    public DbSet<Categories> Categories { get; set; }
    public DbSet<Orders> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Promotions> Promotions { get; set; }
    public DbSet<Customers> Customers { get; set; }
    public DbSet<Inventory> Inventory { get; set; }
    public DbSet<Payments> Payments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Products>()
            .HasOne(p => p.Category)
            .WithMany()
            .HasForeignKey(p => p.CategoryId);

        modelBuilder.Entity<Products>()
            .HasOne(p => p.Supplier)
            .WithMany()
            .HasForeignKey(p => p.SupplierId);

        modelBuilder.Entity<Products>()
            .HasOne(p => p.Inventory)
            .WithOne()
            .HasForeignKey<Inventory>(i => i.ProductId);

        modelBuilder.Entity<Inventory>()
    .HasOne(i => i.Product)
    .WithOne(p => p.Inventory)
    .HasForeignKey<Inventory>(i => i.ProductId)
    .OnDelete(DeleteBehavior.Cascade);

        base.OnModelCreating(modelBuilder);
    }

}
