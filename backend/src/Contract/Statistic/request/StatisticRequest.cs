using Microsoft.AspNetCore.Mvc;

public class StatisticRequest
{
    [FromQuery] public string StartDate { get; set; } = string.Empty;
    [FromQuery] public string EndDate { get; set; } = string.Empty;
    [FromQuery] public int? Status { get; set; } = 0;
}