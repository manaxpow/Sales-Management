using System.ComponentModel.DataAnnotations;

public class Categories
{
    public Categories() { }
    [Key]

    public int CategoryId { get; set; }

    public string CategoryName { get; set; } = string.Empty;


}