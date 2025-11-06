using Microsoft.EntityFrameworkCore;

public class OrderItemService : IOrderItemService {
    private readonly AppDbContext _db;
    public OrderItemService(AppDbContext db) { _db = db; }

    public async Task<ApiResponse<IEnumerable<OrderItemResponse>>> GetAll(int? orderId) {
        var q = _db.OrderItems.AsQueryable();
        if (orderId.HasValue) q = q.Where(i => i.OrderId == orderId.Value);

        var items = await q
            .Select(i => new OrderItemResponse {
                OrderItemId = i.OrderItemId,
                OrderId = i.OrderId,
                Productid = i.Productid,
                Quantity = i.Quantity,
                Price = i.Price,
                SubTotal = i.SubTotal
            })
            .ToListAsync();

        return new ApiResponse<IEnumerable<OrderItemResponse>>()
            .SuccessResponse(items, "Fetched order items successfully");
    }

    public async Task<ApiResponse<OrderItemResponse>> GetById(int id) {
        var i = await _db.OrderItems.FindAsync(id);
        if (i == null) return new ApiResponse<OrderItemResponse>().ErrorResponse("Order item not found", 404);

        var resp = new OrderItemResponse {
            OrderItemId = i.OrderItemId,
            OrderId = i.OrderId,
            Productid = i.Productid,
            Quantity = i.Quantity,
            Price = i.Price,
            SubTotal = i.SubTotal
        };
        return new ApiResponse<OrderItemResponse>().SuccessResponse(resp);
    }

    public async Task<ApiResponse<OrderItemResponse>> Create(OrderItemRequest req) {
        var entity = new OrderItem {
            OrderId = req.OrderId,
            Productid = req.Productid,
            Quantity = req.Quantity,
            Price = req.Price,
            SubTotal = req.Price * req.Quantity
        };

        _db.OrderItems.Add(entity);
        await _db.SaveChangesAsync();

        var resp = new OrderItemResponse {
            OrderItemId = entity.OrderItemId,
            OrderId = entity.OrderId,
            Productid = entity.Productid,
            Quantity = entity.Quantity,
            Price = entity.Price,
            SubTotal = entity.SubTotal
        };
        return new ApiResponse<OrderItemResponse>().SuccessResponse(resp, "Created order item successfully", 201);
    }

    public async Task<ApiResponse<OrderItemResponse>> Update(int id, OrderItemRequest req) {
        var entity = await _db.OrderItems.FindAsync(id);
        if (entity == null) return new ApiResponse<OrderItemResponse>().ErrorResponse("Order item not found", 404);

        entity.OrderId = req.OrderId;
        entity.Productid = req.Productid;
        entity.Quantity = req.Quantity;
        entity.Price = req.Price;
        entity.SubTotal = req.Price * req.Quantity;

        await _db.SaveChangesAsync();

        var resp = new OrderItemResponse {
            OrderItemId = entity.OrderItemId,
            OrderId = entity.OrderId,
            Productid = entity.Productid,
            Quantity = entity.Quantity,
            Price = entity.Price,
            SubTotal = entity.SubTotal
        };
        return new ApiResponse<OrderItemResponse>().SuccessResponse(resp, "Updated order item successfully");
    }

    public async Task<ApiResponse<string>> Delete(int id) {
        var entity = await _db.OrderItems.FindAsync(id);
        if (entity == null) return new ApiResponse<string>().ErrorResponse("Order item not found", 404);

        _db.OrderItems.Remove(entity);
        await _db.SaveChangesAsync();

        return new ApiResponse<string>().SuccessResponse("Deleted order item successfully");
    }
}
