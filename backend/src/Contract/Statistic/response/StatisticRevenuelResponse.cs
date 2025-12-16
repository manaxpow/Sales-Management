
using System.Text.Json.Serialization;

public class Revenue
{
    [JsonConverter(typeof(JsonRoundedDecimalConverter))]
    public decimal Amount { get; set; }
    public string Time { get; set; } = string.Empty;
}
public class StatisticRevenuelResponse
{

    [JsonConverter(typeof(JsonRoundedDecimalConverter))]
    public decimal TotalRevenue { get; set; }
    [JsonConverter(typeof(JsonRoundedDecimalConverter))]
    public decimal AverageRevenue { get; set; }

    public List<Revenue> Revenues { get; set; } = new List<Revenue>();

    public int TotalOrders { get; set; }

}