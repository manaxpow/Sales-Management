using Microsoft.EntityFrameworkCore;

public class OrderService : IOrderService {
    private readonly AppDbContext _db;
    public OrderService(AppDbContext db) { _db = db; }

    public async Task<ApiResponse<IEnumerable<OrderResponse>>> GetAll(
        int? customerId,
        int? userId,
        int? status,
        DateTime? dateFrom,
        DateTime? dateTo) {
        var q = _db.Orders.AsQueryable();

        if (customerId.HasValue) q = q.Where(o => o.Customerid == customerId.Value);
        if (userId.HasValue) q = q.Where(o => o.Userid == userId.Value);
        if (status.HasValue) q = q.Where(o => o.Status == status.Value);
        if (dateFrom.HasValue) q = q.Where(o => o.OrderDate >= dateFrom.Value);
        if (dateTo.HasValue) q = q.Where(o => o.OrderDate <= dateTo.Value);

        var list = await q.OrderByDescending(o => o.OrderDate)
                          .Select(o => new OrderResponse {
                              Id = o.Id,
                              Customerid = o.Customerid,
                              Userid = o.Userid,
                              Status = o.Status,
                              TotalAmount = o.TotalAmount,
                              DiscountAmount = o.DiscountAmount,
                              OrderDate = o.OrderDate
                          })
                          .ToListAsync();

        return new ApiResponse<IEnumerable<OrderResponse>>()
            .SuccessResponse(list, "Fetched orders successfully");
    }

    public async Task<ApiResponse<OrderResponse>> GetById(int id) {
        var o = await _db.Orders.FindAsync(id);
        if (o == null) return new ApiResponse<OrderResponse>().ErrorResponse("Order not found", 404);

        var resp = new OrderResponse {
            Id = o.Id,
            Customerid = o.Customerid,
            Userid = o.Userid,
            Status = o.Status,
            TotalAmount = o.TotalAmount,
            DiscountAmount = o.DiscountAmount,
            OrderDate = o.OrderDate
        };
        return new ApiResponse<OrderResponse>().SuccessResponse(resp);
    }

    public async Task<ApiResponse<OrderResponse>> Create(OrderRequest req) {
        var entity = new Orders {
            Customerid = req.Customerid,
            Userid = req.Userid,
            Status = req.Status,
            TotalAmount = req.TotalAmount,
            DiscountAmount = req.DiscountAmount,
            OrderDate = req.OrderDate == default ? DateTime.Now : req.OrderDate
        };

        _db.Orders.Add(entity);
        await _db.SaveChangesAsync();

        var resp = new OrderResponse {
            Id = entity.Id,
            Customerid = entity.Customerid,
            Userid = entity.Userid,
            Status = entity.Status,
            TotalAmount = entity.TotalAmount,
            DiscountAmount = entity.DiscountAmount,
            OrderDate = entity.OrderDate
        };

        return new ApiResponse<OrderResponse>().SuccessResponse(resp, "Created order successfully", 201);
    }

    public async Task<ApiResponse<OrderResponse>> Update(int id, OrderRequest req) {
        var o = await _db.Orders.FindAsync(id);
        if (o == null) return new ApiResponse<OrderResponse>().ErrorResponse("Order not found", 404);

        o.Customerid = req.Customerid;
        o.Userid = req.Userid;
        o.Status = req.Status;
        o.TotalAmount = req.TotalAmount;
        o.DiscountAmount = req.DiscountAmount;
        o.OrderDate = req.OrderDate == default ? o.OrderDate : req.OrderDate;

        await _db.SaveChangesAsync();

        var resp = new OrderResponse {
            Id = o.Id,
            Customerid = o.Customerid,
            Userid = o.Userid,
            Status = o.Status,
            TotalAmount = o.TotalAmount,
            DiscountAmount = o.DiscountAmount,
            OrderDate = o.OrderDate
        };

        return new ApiResponse<OrderResponse>().SuccessResponse(resp, "Updated order successfully");
    }

    public async Task<ApiResponse<string>> Delete(int id) {
        var o = await _db.Orders.FindAsync(id);
        if (o == null) return new ApiResponse<string>().ErrorResponse("Order not found", 404);

        _db.Orders.Remove(o);
        await _db.SaveChangesAsync();

        return new ApiResponse<string>().SuccessResponse("Deleted order successfully");
    }
}
