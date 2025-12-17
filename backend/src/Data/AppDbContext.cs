



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
    public DbSet<Cart> Carts { get; set; }
    public DbSet<CartItem> CartItems { get; set; }

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


        modelBuilder.Entity<CartItem>()
            .HasOne(ci => ci.Cart)
            .WithMany(c => c.Items)
            .HasForeignKey(ci => ci.CartId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<CartItem>()
            .HasOne(ci => ci.Product)
            .WithMany(p => p.CartItems)
            .HasForeignKey(ci => ci.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        base.OnModelCreating(modelBuilder);
    }

    public override int SaveChanges()
    {
        // Check for promotions that have reached their usage limit
        var changedEntries = ChangeTracker.Entries<Promotions>()
            .Where(e => e.State == EntityState.Modified || e.State == EntityState.Added)
            .ToList();

        foreach (var entry in changedEntries)
        {
            var promotion = entry.Entity;
            if (promotion.Usedcount >= promotion.Usagelimit && promotion.Status != 0)
            {
                promotion.Status = 0; // Set status to 0 (inactive)
            }
        }

        return base.SaveChanges();
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Check for promotions that have reached their usage limit
        var changedEntries = ChangeTracker.Entries<Promotions>()
            .Where(e => e.State == EntityState.Modified || e.State == EntityState.Added)
            .ToList();

        foreach (var entry in changedEntries)
        {
            var promotion = entry.Entity;
            if (promotion.Usedcount >= promotion.Usagelimit && promotion.Status != 0)
            {
                promotion.Status = 0; // Set status to 0 (inactive)
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}
