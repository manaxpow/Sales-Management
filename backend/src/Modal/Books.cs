using System.ComponentModel.DataAnnotations;

public class Books
{
    public Books() { }
    [Key]
    public int BookId { get; set; }
    public int CategoryId { get; set; }
    public int Supplierid { get; set; }

    [Required]
    public string? ProductName { get; set; }

    [Required]
    public string? Barcode { get; set; }
    public decimal Price
    {
        get; set;
    }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }


}