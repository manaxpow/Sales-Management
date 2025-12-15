public class StatisticResposne
{
    public int TotalItem { get; set; }
    public string ItemName { get; set; } = string.Empty;
}

public class GetStatisticProduct
{
    public List<StatisticResposne> Data { get; set; } = new();
}

