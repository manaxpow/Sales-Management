public class GetHistoryResponse
{
    public int Id { get; set; }
    public int Customerid { get; set; }
    public int Userid { get; set; }
    public int Status { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public DateTime OrderDate { get; set; }
    public decimal FinalAmount => TotalAmount - DiscountAmount;
}

public class HistoryDetailResponse
{
    public int Id { get; set; }
    public int Customerid { get; set; }
    public int Userid { get; set; }
    public int Status { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public DateTime OrderDate { get; set; }
    public decimal FinalAmount => TotalAmount - DiscountAmount;
    public List<HistoryOrderItemResponse> Items { get; set; } = new();
}

public class HistoryOrderItemResponse
{
    public int OrderItemId { get; set; }
    public int OrderId { get; set; }
    public int Productid { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public decimal SubTotal { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string Barcode { get; set; } = string.Empty;
    public string Unit { get; set; } = "pcs";
    public string? ImageProduct { get; set; }
}

public class PagedHistoryResponse
{
    public IEnumerable<GetHistoryResponse> Data { get; set; } = new List<GetHistoryResponse>();
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    public bool HasPreviousPage => Page > 1;
    public bool HasNextPage => Page < TotalPages;
}
