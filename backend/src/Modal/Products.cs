//   product_id INT AUTO_INCREMENT PRIMARY KEY,
//     category_id INT,
//     supplier_id INT,
//     product_name VARCHAR(100) NOT NULL,
//     barcode VARCHAR(50) UNIQUE,
//     price DECIMAL(10,2) NOT NULL,
//     unit VARCHAR(20) DEFAULT 'pcs',
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

using System.ComponentModel.DataAnnotations;

public class Products
{
    public Products() { }
    [Key]
    public int ProductId { get; set; }
    public int SupplierId { get; set; }
    public int CategoryId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string Barcode { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Unit { get; set; } = "pcs";
    // 1 active 2 inactive 3 delete
    public int Status { get; set; } = 1;

    public string? ImageProduct { get; set; } = "/images/defaultImg.png";
    // references key
    public Categories? Category { get; set; }
    public Suppliers? Supplier { get; set; }
    public Inventory? Inventory { get; set; }

    public DateTime CreatedAt { get; set; }
}