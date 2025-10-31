using Microsoft.EntityFrameworkCore;

public class OrderItemService : IOrderItemService {
    private readonly AppDbContext _context;

    public OrderItemService(AppDbContext context) {
        _context = context;
    }

    public async Task<ApiResponse<IEnumerable<OrderItem>>> GetAll(int? orderId) {
        var query = _context.OrderItems.AsQueryable();

        if (orderId.HasValue)
            query = query.Where(i => i.OrderId == orderId.Value);

        var items = await query.ToListAsync();
        return new ApiResponse<IEnumerable<OrderItem>>()
            .SuccessResponse(items, "Fetched order items successfully");
    }

    public async Task<ApiResponse<OrderItem>> GetById(int id) {
        var item = await _context.OrderItems.FindAsync(id);
        if (item == null)
            return new ApiResponse<OrderItem>().ErrorResponse("Order item not found", 404);

        return new ApiResponse<OrderItem>().SuccessResponse(item);
    }

    public async Task<ApiResponse<OrderItem>> Create(OrderItem newItem) {
        newItem.SubTotal = newItem.Price * newItem.Quantity;

        _context.OrderItems.Add(newItem);
        await _context.SaveChangesAsync();

        return new ApiResponse<OrderItem>()
            .SuccessResponse(newItem, "Created order item successfully", 201);
    }

    public async Task<ApiResponse<OrderItem>> Update(int id, OrderItem updatedItem) {
        var item = await _context.OrderItems.FindAsync(id);
        if (item == null)
            return new ApiResponse<OrderItem>().ErrorResponse("Order item not found", 404);

        item.OrderId = updatedItem.OrderId;
        item.Productid = updatedItem.Productid;
        item.Quantity = updatedItem.Quantity;
        item.Price = updatedItem.Price;
        item.SubTotal = updatedItem.Price * updatedItem.Quantity;

        await _context.SaveChangesAsync();

        return new ApiResponse<OrderItem>().SuccessResponse(item, "Updated order item successfully");
    }

    public async Task<ApiResponse<string>> Delete(int id) {
        var item = await _context.OrderItems.FindAsync(id);
        if (item == null)
            return new ApiResponse<string>().ErrorResponse("Order item not found", 404);

        _context.OrderItems.Remove(item);
        await _context.SaveChangesAsync();

        return new ApiResponse<string>().SuccessResponse("Deleted order item successfully");
    }
}
