using Microsoft.EntityFrameworkCore;

public class OrderService : IOrderService {
    private readonly AppDbContext _db;

    public OrderService(AppDbContext db) {
        _db = db;
    }

    public async Task<ApiResponse<IEnumerable<Orders>>> GetAll(
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

        var data = await q.OrderByDescending(o => o.OrderDate).ToListAsync();

        return new ApiResponse<IEnumerable<Orders>>().SuccessResponse(data, "Fetched orders successfully");
    }

    public async Task<ApiResponse<Orders>> GetById(int id) {
        var order = await _db.Orders.FindAsync(id);
        if (order == null) return new ApiResponse<Orders>().ErrorResponse("Order not found", 404);

        return new ApiResponse<Orders>().SuccessResponse(order);
    }

    public async Task<ApiResponse<Orders>> Create(Orders newOrder) {
        // Nếu client không set, có thể tự gán thời gian server
        if (newOrder.OrderDate == default) newOrder.OrderDate = DateTime.Now;

        _db.Orders.Add(newOrder);
        await _db.SaveChangesAsync();

        return new ApiResponse<Orders>().SuccessResponse(newOrder, "Created order successfully", 201);
    }

    public async Task<ApiResponse<Orders>> Update(int id, Orders updated) {
        var order = await _db.Orders.FindAsync(id);
        if (order == null) return new ApiResponse<Orders>().ErrorResponse("Order not found", 404);

        order.Customerid = updated.Customerid;
        order.Userid = updated.Userid;
        order.Status = updated.Status;
        order.TotalAmount = updated.TotalAmount;
        order.DiscountAmount = updated.DiscountAmount;
        order.OrderDate = updated.OrderDate == default ? order.OrderDate : updated.OrderDate;

        await _db.SaveChangesAsync();

        return new ApiResponse<Orders>().SuccessResponse(order, "Updated order successfully");
    }

    public async Task<ApiResponse<string>> Delete(int id) {
        var order = await _db.Orders.FindAsync(id);
        if (order == null) return new ApiResponse<string>().ErrorResponse("Order not found", 404);

        _db.Orders.Remove(order);
        await _db.SaveChangesAsync();

        return new ApiResponse<string>().SuccessResponse("Deleted order successfully");
    }
}
