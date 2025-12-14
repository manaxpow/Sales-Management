using Microsoft.EntityFrameworkCore;

public class HistoryService : IHistoryService
{
    private readonly AppDbContext _db;
    public HistoryService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<ApiResponse<PagedHistoryResponse>> GetOrderHistory(GetHistoryRequest request)
    {
        var query = _db.Orders.AsQueryable();

        // Filter by User ID (required)
        query = query.Where(o => o.Userid == request.UserId);

        // Optional filters
        if (request.Status.HasValue)
            query = query.Where(o => o.Status == request.Status.Value);

        if (request.DateFrom.HasValue)
            query = query.Where(o => o.OrderDate >= request.DateFrom.Value);

        if (request.DateTo.HasValue)
            query = query.Where(o => o.OrderDate <= request.DateTo.Value);

        // Get total count for pagination
        var totalCount = await query.CountAsync();

        // Apply pagination
        var orders = await query
            .OrderByDescending(o => o.OrderDate)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(o => new GetHistoryResponse
            {
                Id = o.Id,
                Customerid = o.Customerid,
                Userid = o.Userid,
                Status = o.Status,
                TotalAmount = o.TotalAmount,
                DiscountAmount = o.DiscountAmount,
                OrderDate = o.OrderDate
            })
            .ToListAsync();

        var pagedResponse = new PagedHistoryResponse
        {
            Data = orders,
            Page = request.Page,
            PageSize = request.PageSize,
            TotalCount = totalCount
        };

        return new ApiResponse<PagedHistoryResponse>()
            .SuccessResponse(pagedResponse, "Fetched order history successfully");
    }

    public async Task<ApiResponse<HistoryDetailResponse>> GetOrderHistoryDetail(GetHistoryDetailRequest request)
    {
        var order = await _db.Orders
            .Where(o => o.Id == request.OrderId && o.Userid == request.UserId)
            .FirstOrDefaultAsync();

        if (order == null)
            return new ApiResponse<HistoryDetailResponse>().ErrorResponse("Order not found or access denied", 404);

        var orderItems = await _db.OrderItems
            .Join(_db.Products, oi => oi.Productid, p => p.ProductId, (oi, p) => new { oi, p })
            .Where(x => x.oi.OrderId == request.OrderId)
            .Select(x => new HistoryOrderItemResponse
            {
                OrderItemId = x.oi.OrderItemId,
                OrderId = x.oi.OrderId,
                Productid = x.oi.Productid,
                Quantity = x.oi.Quantity,
                Price = x.oi.Price,
                SubTotal = x.oi.SubTotal,
                ProductName = x.p.ProductName,
                Barcode = x.p.Barcode,
                Unit = x.p.Unit,
                ImageProduct = x.p.ImageProduct
            })
            .ToListAsync();

        var orderDetail = new HistoryDetailResponse
        {
            Id = order.Id,
            Customerid = order.Customerid,
            Userid = order.Userid,
            Status = order.Status,
            TotalAmount = order.TotalAmount,
            DiscountAmount = order.DiscountAmount,
            OrderDate = order.OrderDate,
            Items = orderItems
        };

        return new ApiResponse<HistoryDetailResponse>()
            .SuccessResponse(orderDetail, "Fetched order detail successfully");
    }
}
