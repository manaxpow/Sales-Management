

public class OrderSTA
{
    public int Count { get; set; }
    public string Time { get; set; } = string.Empty;

}
public class StatisticOrderResponse
{

    public List<OrderSTA> StaOrder { get; set; } = new List<OrderSTA>();
    public  int TotalOrders { get; set; } = 0;
   

}