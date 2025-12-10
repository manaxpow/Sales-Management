using Microsoft.EntityFrameworkCore;

public class CartService : ICartService {
    private readonly AppDbContext _db;
    public CartService(AppDbContext db) => _db = db;

    public async Task<ApiResponse<IEnumerable<CartResponse>>> GetAllByUser(int userId, string? status = null) {
        var q = _db.Carts.Where(c => c.UserId == userId);
        if (!string.IsNullOrEmpty(status)) q = q.Where(c => c.Status == status);

        var list = await q.OrderByDescending(c => c.UpdatedAt)
            .Select(c => new CartResponse {
                CartId = c.CartId,
                UserId = c.UserId,
                CustomerId = c.CustomerId,
                PromoId = c.PromoId,
                PromoCodeSnapshot = c.PromoCodeSnapshot,
                Status = c.Status,
                TotalAmount = c.TotalAmount,
                ItemCount = c.ItemCount,
                DiscountAmount = c.DiscountAmount,
                ShippingAmount = c.ShippingAmount,
                TaxAmount = c.TaxAmount,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt
            }).ToListAsync();

        return new ApiResponse<IEnumerable<CartResponse>>().SuccessResponse(list, "Fetched carts");
    }

    public async Task<ApiResponse<CartResponse>> GetById(int id) {
        var c = await _db.Carts.Include(x => x.Items).FirstOrDefaultAsync(x => x.CartId == id);
        if (c == null) return new ApiResponse<CartResponse>().ErrorResponse("Cart not found", 404);

        var resp = new CartResponse {
            CartId = c.CartId,
            UserId = c.UserId,
            CustomerId = c.CustomerId,
            PromoId = c.PromoId,
            PromoCodeSnapshot = c.PromoCodeSnapshot,
            Status = c.Status,
            TotalAmount = c.TotalAmount,
            ItemCount = c.ItemCount,
            DiscountAmount = c.DiscountAmount,
            ShippingAmount = c.ShippingAmount,
            TaxAmount = c.TaxAmount,
            CreatedAt = c.CreatedAt,
            UpdatedAt = c.UpdatedAt
        };
        return new ApiResponse<CartResponse>().SuccessResponse(resp);
    }

    public async Task<ApiResponse<CartResponse>> Create(CartRequest req) {
        var entity = new Cart {
            UserId = req.UserId!.Value,
            CustomerId = req.CustomerId,
            PromoId = req.PromoId,
            PromoCodeSnapshot = req.PromoCodeSnapshot,
            Status = string.IsNullOrEmpty(req.Status) ? "active" : req.Status,
            TotalAmount = 0m,
            ItemCount = 0,
            DiscountAmount = 0m,
            ShippingAmount = req.ShippingAmount ?? 0m,
            TaxAmount = req.TaxAmount ?? 0m,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };

        _db.Carts.Add(entity);
        await _db.SaveChangesAsync();

        var resp = new CartResponse {
            CartId = entity.CartId,
            UserId = entity.UserId,
            CustomerId = entity.CustomerId,
            PromoId = entity.PromoId,
            PromoCodeSnapshot = entity.PromoCodeSnapshot,
            Status = entity.Status,
            TotalAmount = entity.TotalAmount,
            ItemCount = entity.ItemCount,
            DiscountAmount = entity.DiscountAmount,
            ShippingAmount = entity.ShippingAmount,
            TaxAmount = entity.TaxAmount,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt
        };

        return new ApiResponse<CartResponse>().SuccessResponse(resp, "Created cart", 201);
    }

    public async Task<ApiResponse<CartResponse>> Update(int id, CartRequest req) {
        var c = await _db.Carts.Include(x => x.Items).FirstOrDefaultAsync(x => x.CartId == id);
        if (c == null) return new ApiResponse<CartResponse>().ErrorResponse("Cart not found", 404);

        if (req.CustomerId.HasValue) c.CustomerId = req.CustomerId;
        if (req.PromoId.HasValue) c.PromoId = req.PromoId;
        if (req.PromoCodeSnapshot != null) c.PromoCodeSnapshot = req.PromoCodeSnapshot;
        if (!string.IsNullOrEmpty(req.Status)) c.Status = req.Status;
        if (req.ShippingAmount.HasValue) c.ShippingAmount = req.ShippingAmount.Value;
        if (req.TaxAmount.HasValue) c.TaxAmount = req.TaxAmount.Value;

        // recalc totals
        var items = c.Items ?? await _db.CartItems.Where(i => i.CartId == id).ToListAsync();
        c.ItemCount = items.Sum(i => i.Quantity);
        c.TotalAmount = items.Sum(i => i.Subtotal) + c.ShippingAmount + c.TaxAmount - c.DiscountAmount;

        c.UpdatedAt = DateTime.Now;
        await _db.SaveChangesAsync();

        var resp = new CartResponse {
            CartId = c.CartId,
            UserId = c.UserId,
            CustomerId = c.CustomerId,
            PromoId = c.PromoId,
            PromoCodeSnapshot = c.PromoCodeSnapshot,
            Status = c.Status,
            TotalAmount = c.TotalAmount,
            ItemCount = c.ItemCount,
            DiscountAmount = c.DiscountAmount,
            ShippingAmount = c.ShippingAmount,
            TaxAmount = c.TaxAmount,
            CreatedAt = c.CreatedAt,
            UpdatedAt = c.UpdatedAt
        };

        return new ApiResponse<CartResponse>().SuccessResponse(resp, "Updated cart");
    }

    public async Task<ApiResponse<string>> Delete(int id) {
        var c = await _db.Carts.FindAsync(id);
        if (c == null) return new ApiResponse<string>().ErrorResponse("Cart not found", 404);

        _db.Carts.Remove(c);
        await _db.SaveChangesAsync();
        return new ApiResponse<string>().SuccessResponse("Deleted cart");
    }

    public async Task<ApiResponse<CartResponse>> Checkout(int id) {
        var c = await _db.Carts.Include(x => x.Items).FirstOrDefaultAsync(x => x.CartId == id);
        if (c == null) return new ApiResponse<CartResponse>().ErrorResponse("Cart not found", 404);
        if (c.Status != "active") return new ApiResponse<CartResponse>().ErrorResponse("Cart not active", 400);

        // mark converted (for now)
        c.Status = "converted";
        c.UpdatedAt = DateTime.Now;
        await _db.SaveChangesAsync();

        var resp = new CartResponse {
            CartId = c.CartId,
            UserId = c.UserId,
            CustomerId = c.CustomerId,
            PromoId = c.PromoId,
            PromoCodeSnapshot = c.PromoCodeSnapshot,
            Status = c.Status,
            TotalAmount = c.TotalAmount,
            ItemCount = c.ItemCount,
            DiscountAmount = c.DiscountAmount,
            ShippingAmount = c.ShippingAmount,
            TaxAmount = c.TaxAmount,
            CreatedAt = c.CreatedAt,
            UpdatedAt = c.UpdatedAt
        };

        return new ApiResponse<CartResponse>().SuccessResponse(resp, "Cart converted");
    }
}
