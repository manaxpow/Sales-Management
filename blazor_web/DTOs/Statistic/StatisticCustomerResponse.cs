public class StatisticCustomerResponse
{
    public List<StatisticItem> ByYear { get; set; } = [];
    public List<StatisticItem> ByMonth { get; set; } = [];
    public List<StatisticItem> ByWeek { get; set; } = [];
}

public class StatisticItem
{
    public string Time { get; set; } = "";
    public int Count { get; set; }
}
