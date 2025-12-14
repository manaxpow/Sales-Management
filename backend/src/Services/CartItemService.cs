using Microsoft.EntityFrameworkCore;

public class CartItemService : ICartItemService {
    private readonly AppDbContext _db;
    public CartItemService(AppDbContext db) => _db = db;

    public async Task<ApiResponse<IEnumerable<CartItemResponse>>> GetAll(int? cartId) {
        var q = _db.CartItems.AsQueryable();
        if (cartId.HasValue) q = q.Where(i => i.CartId == cartId.Value);

        var list = await q.OrderBy(i => i.CartItemId).Select(i => new CartItemResponse {
            CartItemId = i.CartItemId,
            CartId = i.CartId,
            ProductId = i.ProductId,
            ProductName = i.ProductName,
            PriceSnapshot = i.PriceSnapshot,
            Quantity = i.Quantity,
            Unit = i.Unit,
            Subtotal = i.Subtotal,
            CreatedAt = i.CreatedAt,
            UpdatedAt = i.UpdatedAt,

        }).ToListAsync();

        return new ApiResponse<IEnumerable<CartItemResponse>>().SuccessResponse(list, "Fetched cart items");
    }

    public async Task<ApiResponse<CartItemResponse>> GetById(int id) {
        var i = await _db.CartItems.FindAsync(id);
        if (i == null) return new ApiResponse<CartItemResponse>().ErrorResponse("Cart item not found", 404);

        var resp = new CartItemResponse {
            CartItemId = i.CartItemId,
            CartId = i.CartId,
            ProductId = i.ProductId,
            ProductName = i.ProductName,
            PriceSnapshot = i.PriceSnapshot,
            Quantity = i.Quantity,
            Unit = i.Unit,
            Subtotal = i.Subtotal,
            CreatedAt = i.CreatedAt,
            UpdatedAt = i.UpdatedAt
        };

        return new ApiResponse<CartItemResponse>().SuccessResponse(resp);
    }

    public async Task<ApiResponse<CartItemResponse>> Create(CartItemRequest req) {
        var cart = await _db.Carts.FindAsync(req.CartId);
        if (cart == null) return new ApiResponse<CartItemResponse>().ErrorResponse("Cart not found", 404);
        if (cart.Status != "active") return new ApiResponse<CartItemResponse>().ErrorResponse("Cart not active", 400);

        // Fill product info if productId exists
        if (req.ProductId.HasValue && string.IsNullOrEmpty(req.ProductName)) {
            var product = await _db.Products.FindAsync(req.ProductId.Value);
            if (product != null) req.ProductName = product.ProductName;
        }

        // Prevent duplicate product in cart (unique constraint)
        if (req.ProductId.HasValue) {
            var exist = await _db.CartItems.AnyAsync(x => x.CartId == req.CartId && x.ProductId == req.ProductId.Value);
            if (exist) return new ApiResponse<CartItemResponse>().ErrorResponse("Product already in cart. Use update to change quantity", 400);
        }

        var entity = new CartItem {
            CartId = req.CartId!.Value,
            ProductId = req.ProductId,
            ProductName = req.ProductName ?? string.Empty,
            PriceSnapshot = req.PriceSnapshot ?? 0m,
            Quantity = req.Quantity ?? 1,
            Unit = req.Unit ?? "pcs",
            Subtotal = (req.PriceSnapshot ?? 0m) * (req.Quantity ?? 1),
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };

        _db.CartItems.Add(entity);
        await _db.SaveChangesAsync();

        await RecalculateCartTotals(entity.CartId);

        var resp = new CartItemResponse {
            CartItemId = entity.CartItemId,
            CartId = entity.CartId,
            ProductId = entity.ProductId,
            ProductName = entity.ProductName,
            PriceSnapshot = entity.PriceSnapshot,
            Quantity = entity.Quantity,
            Unit = entity.Unit,
            Subtotal = entity.Subtotal,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt
        };

        return new ApiResponse<CartItemResponse>().SuccessResponse(resp, "Created cart item", 201);
    }

    public async Task<ApiResponse<CartItemResponse>> Update(int id, CartItemRequest req) {
        var entity = await _db.CartItems.FindAsync(id);
        if (entity == null) return new ApiResponse<CartItemResponse>().ErrorResponse("Cart item not found", 404);

        if (req.ProductId.HasValue) entity.ProductId = req.ProductId;
        if (!string.IsNullOrEmpty(req.ProductName)) entity.ProductName = req.ProductName;
        if (req.PriceSnapshot.HasValue) entity.PriceSnapshot = req.PriceSnapshot.Value;
        if (req.Quantity.HasValue) entity.Quantity = req.Quantity.Value;
        if (!string.IsNullOrEmpty(req.Unit)) entity.Unit = req.Unit;

        entity.Subtotal = entity.PriceSnapshot * entity.Quantity;
        entity.UpdatedAt = DateTime.Now;

        await _db.SaveChangesAsync();
        await RecalculateCartTotals(entity.CartId);

        var resp = new CartItemResponse {
            CartItemId = entity.CartItemId,
            CartId = entity.CartId,
            ProductId = entity.ProductId,
            ProductName = entity.ProductName,
            PriceSnapshot = entity.PriceSnapshot,
            Quantity = entity.Quantity,
            Unit = entity.Unit,
            Subtotal = entity.Subtotal,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt
        };

        return new ApiResponse<CartItemResponse>().SuccessResponse(resp, "Updated cart item");
    }

    public async Task<ApiResponse<string>> Delete(int id) {
        var entity = await _db.CartItems.FindAsync(id);
        if (entity == null) return new ApiResponse<string>().ErrorResponse("Cart item not found", 404);

        var cartId = entity.CartId;
        _db.CartItems.Remove(entity);
        await _db.SaveChangesAsync();

        await RecalculateCartTotals(cartId);

        return new ApiResponse<string>().SuccessResponse("Deleted cart item");
    }

    private async Task RecalculateCartTotals(int cartId) {
        var cart = await _db.Carts.Include(c => c.Items).FirstOrDefaultAsync(c => c.CartId == cartId);
        if (cart == null) return;

        var items = cart.Items ?? await _db.CartItems.Where(i => i.CartId == cartId).ToListAsync();
        cart.ItemCount = items.Sum(i => i.Quantity);
        cart.TotalAmount = items.Sum(i => i.Subtotal) + cart.ShippingAmount + cart.TaxAmount - cart.DiscountAmount;
        cart.UpdatedAt = DateTime.Now;
        await _db.SaveChangesAsync();
    }
}
