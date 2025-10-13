using System.ComponentModel.DataAnnotations;

public class Orders
{
    public Orders() { }

        [Key]

    public int Id { get; set; }
    public int Customerid { get; set; }
    public int Userid { get; set; }
    public int Status { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal DiscountAmount { get; set; }

    public DateTime OrderDate { get; set; }


}