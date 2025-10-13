using System.ComponentModel.DataAnnotations;

public class Inventory
{
    public Inventory() { }
    [Key]

    public int InventoryId { get; set; }
    public int ProductId { get; set; }

    public int Quantity { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }


}