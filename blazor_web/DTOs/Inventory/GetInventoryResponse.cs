namespace blazor_web.DTOs.Inventory
{
    public class ProductInventory
    {
        public int Id { get; init; }
        public int ProductId { get; init; }
        public string ProductName { get; init; }
        public string Barcode { get; init; }
        public int Quantity { get; init; }
        public int Price { get; init; }
    }

    public class GetInventoryResponse
    {
        public int TotalCount { get; init; }
        public List<ProductInventory> Products { get; init; } = new();
    }
}