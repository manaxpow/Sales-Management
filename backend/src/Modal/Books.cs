using System.ComponentModel.DataAnnotations;

public class Books
{
    public Books() { }
    [Key]
    public int BookId { get; set; }
    public int CategoryId { get; set; }
    public int Supplierid { get; set; }

    public string ProductName { get; set; } = string.Empty;



    public string Barcode { get; set; } = string.Empty;
    public decimal Price
    {
        get; set;
    }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }


}