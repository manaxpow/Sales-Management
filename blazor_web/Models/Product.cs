namespace blazor_web.Models
{
    public class Product
    {
        public int ProductId { get; set; }
        public int CategoryId { get; set; }
        public int SupplierId { get; set; }
        public string ProductName { get; set; } = "";
        public string Barcode { get; set; } = "";
        public decimal Price { get; set; }
        public string Unit { get; set; } = "pcs";
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
