public class GetHistoryRequest
{
    public int UserId { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public int? Status { get; set; }
    public DateTime? DateFrom { get; set; }
    public DateTime? DateTo { get; set; }
}

public class GetHistoryDetailRequest
{
    public int UserId { get; set; }
    public int OrderId { get; set; }
}
