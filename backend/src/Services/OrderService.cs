using Microsoft.EntityFrameworkCore;

public class OrderService : IOrderService
{
    private readonly AppDbContext _db;
    public OrderService(
         AppDbContext db,
         IProductService productService,
         IUserService userService,
         ICustomerService customerService,
         IPromotionService promotionService,
         IPaymentService paymentService)
    {
        _db = db;
        _productService = productService;
        _userService = userService;
        _customerService = customerService;
        _promotionService = promotionService;
        _paymentService = paymentService;
    }
    private readonly IProductService _productService;
    private readonly IUserService _userService;
    private readonly ICustomerService _customerService;
    private readonly IPromotionService _promotionService;
    private readonly IPaymentService _paymentService;

    public async Task<ApiResponse<IEnumerable<OrderResponse>>> GetAll(
        int? customerId,
        int? userId,
        int? status,
        DateTime? dateFrom,
        DateTime? dateTo)
    {
        var q = _db.Orders.AsQueryable();

        if (customerId.HasValue) q = q.Where(o => o.Customerid == customerId.Value);
        if (userId.HasValue) q = q.Where(o => o.Userid == userId.Value);
        if (status.HasValue) q = q.Where(o => o.Status == status.Value);
        if (dateFrom.HasValue) q = q.Where(o => o.OrderDate >= dateFrom.Value);
        if (dateTo.HasValue) q = q.Where(o => o.OrderDate <= dateTo.Value);

        var list = await q.OrderByDescending(o => o.OrderDate)
                          .Select(o => new OrderResponse
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

        return new ApiResponse<IEnumerable<OrderResponse>>()
            .SuccessResponse(list, "Fetched orders successfully");
    }

    public async Task<ApiResponse<OrderResponse>> GetById(int id)
    {
        var o = await _db.Orders.FindAsync(id);
        if (o == null) return new ApiResponse<OrderResponse>().ErrorResponse("Order not found", 404);

        var resp = new OrderResponse
        {
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

    public async Task<ApiResponse<OrderResponse>> Create(OrderRequest req)
    {
        var entity = new Orders
        {
            Customerid = req.Customerid,
            Userid = req.Userid,
            Status = req.Status,
            TotalAmount = req.TotalAmount,
            DiscountAmount = req.DiscountAmount,
            OrderDate = req.OrderDate == default ? DateTime.Now : req.OrderDate
        };

        _db.Orders.Add(entity);
        await _db.SaveChangesAsync();

        var resp = new OrderResponse
        {
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

    public async Task<ApiResponse<OrderResponse>> Update(int id, OrderRequest req)
    {
        var o = await _db.Orders.FindAsync(id);
        if (o == null) return new ApiResponse<OrderResponse>().ErrorResponse("Order not found", 404);

        if (req.Status == 2 && o.Status != 2)
        {
            await RestoreProductQuantity(o.Id);
        }

        o.Customerid = req.Customerid;
        o.Userid = req.Userid;
        o.Status = req.Status;
        o.TotalAmount = req.TotalAmount;
        o.DiscountAmount = req.DiscountAmount;
        o.OrderDate = req.OrderDate == default ? o.OrderDate : req.OrderDate;

        await _db.SaveChangesAsync();

        var resp = new OrderResponse
        {
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

    public async Task<ApiResponse<string>> Delete(int id)
    {
        var o = await _db.Orders.FindAsync(id);
        if (o == null) return new ApiResponse<string>().ErrorResponse("Order not found", 404);

        _db.Orders.Remove(o);
        await _db.SaveChangesAsync();

        return new ApiResponse<string>().SuccessResponse("Deleted order successfully");
    }

    public async Task<ApiResponse<CreateOrderResponse>> CreateWithItems(
     CreateOrderWithItemsRequest req)
    {
        if (req.Items == null || !req.Items.Any())
            return new ApiResponse<CreateOrderResponse>().ErrorResponse("Order must contain at least one item", 400);

        // === KIỂM TRA PAYMENTMETHOD ===
        if (req.Paymentmethod != 1 && req.Paymentmethod != 2)
            return new ApiResponse<CreateOrderResponse>().ErrorResponse("Invalid payment method. Use 1 (Cash) or 2 (Transfer)", 400);

        using var transaction = await _db.Database.BeginTransactionAsync();
        try
        {
            // === 1. KIỂM TRA USER ===
            var userResult = await _userService.GetUserById(req.Userid);
            if (!userResult.Success)
                return new ApiResponse<CreateOrderResponse>().ErrorResponse($"User ID {req.Userid} not found", 400);

            // === 2. KIỂM TRA CUSTOMER ===
            var customerResult = await _customerService.GetCustomerById(req.Customerid);
            if (!customerResult.Success)
                return new ApiResponse<CreateOrderResponse>().ErrorResponse($"Customer ID {req.Customerid} not found", 400);

            // === 3. TẠO ORDER ===
            var order = new Orders
            {
                Customerid = req.Customerid,
                Userid = req.Userid,
                Status = req.Status,
                OrderDate = DateTime.Now,
                DiscountAmount = 0,
                TotalAmount = 0
            };

            _db.Orders.Add(order);
            await _db.SaveChangesAsync();

            var orderItems = new List<OrderItem>();
            decimal subtotalBeforeDiscount = 0;

            // === 4. XỬ LÝ SẢN PHẨM ===
            foreach (var itemReq in req.Items)
            {
                var productResult = await _productService.GetProductById(itemReq.Productid);
                if (!productResult.Success || productResult.Data == null)
                    return new ApiResponse<CreateOrderResponse>().ErrorResponse(
                        $"Product ID {itemReq.Productid} not found", 400);

                var product = productResult.Data;

                if (itemReq.Price != product.Price)
                    return new ApiResponse<CreateOrderResponse>().ErrorResponse(
                        $"Price mismatch for '{product.ProductName}'. Expected: {product.Price}, Received: {itemReq.Price}", 400);

                if (product.Quantity < itemReq.Quantity)
                    return new ApiResponse<CreateOrderResponse>().ErrorResponse(
                        $"Not enough stock for '{product.ProductName}'. Available: {product.Quantity}, Requested: {itemReq.Quantity}", 400);

                var subTotal = product.Price * itemReq.Quantity;
                subtotalBeforeDiscount += subTotal;

                orderItems.Add(new OrderItem
                {
                    OrderId = order.Id,
                    Productid = itemReq.Productid,
                    Quantity = itemReq.Quantity,
                    Price = product.Price,
                    SubTotal = subTotal
                });

                // === TRỪ TỒN KHO ===
                var inventory = await _db.Inventory.FirstOrDefaultAsync(i => i.ProductId == itemReq.Productid);
                if (inventory != null)
                {
                    inventory.Quantity -= itemReq.Quantity;
                    inventory.UpdatedAt = DateTime.Now;
                    _db.Inventory.Update(inventory);
                }
            }

            // === 5. ÁP DỤNG KHUYẾN MÃI ===
            decimal discountAmount = 0;
            string? appliedPromotionCode = null;

            if (!string.IsNullOrWhiteSpace(req.PromotionCode))
            {
                var promoCode = req.PromotionCode.Trim().ToUpper();
                var promoResult = await _promotionService.GetPromotionByCode(promoCode);
                if (!promoResult.Success || promoResult.Data == null)
                    return new ApiResponse<CreateOrderResponse>().ErrorResponse("Invalid promotion code", 400);

                var promo = promoResult.Data;
                var now = DateTime.Now;

                if (promo.Status != 1)
                    return new ApiResponse<CreateOrderResponse>().ErrorResponse("Promotion is not active", 400);

                if (promo.StartDate > now || promo.EndDate < now)
                    return new ApiResponse<CreateOrderResponse>().ErrorResponse("Promotion has expired or not started", 400);

                if (promo.Usagelimit > 0 && promo.Usedcount >= promo.Usagelimit)
                    return new ApiResponse<CreateOrderResponse>().ErrorResponse("Promotion usage limit exceeded", 400);

                if (promo.MinOrderAmount > subtotalBeforeDiscount)
                    return new ApiResponse<CreateOrderResponse>().ErrorResponse(
                        $"Minimum order amount {promo.MinOrderAmount} not met", 400);

                discountAmount = promo.DiscountType == 1
                    ? subtotalBeforeDiscount * promo.DiscountValue / 100
                    : promo.DiscountValue;

                discountAmount = Math.Min(discountAmount, subtotalBeforeDiscount);
                appliedPromotionCode = promoCode;

                var incrementResult = await _promotionService.IncrementUsageCount(promo.PromotionId);
                if (!incrementResult.Success)
                    return new ApiResponse<CreateOrderResponse>().ErrorResponse(incrementResult.Message ?? "Failed to apply promotion", 400);
            }

            // === 6. GÁN GIÁ TRỊ CUỐI CHO ORDER ===
            order.TotalAmount = subtotalBeforeDiscount;
            order.DiscountAmount = discountAmount;

            _db.OrderItems.AddRange(orderItems);
            await _db.SaveChangesAsync();

            // === 7. TẠO PAYMENT ===
            var paymentRequest = new PaymentRequest
            {
                OrderId = order.Id,
                Amount = order.TotalAmount - order.DiscountAmount,
                Paymentmethod = req.Paymentmethod,
                PaymentDate = DateTime.Now
            };

            var paymentResult = await _paymentService.Create(paymentRequest);
            if (!paymentResult.Success || paymentResult.Data == null)
            {
                await transaction.RollbackAsync();
                return new ApiResponse<CreateOrderResponse>().ErrorResponse("Failed to record payment", 500);
            }

            // === 8. COMMIT ===
            await transaction.CommitAsync();

            // === 9. RESPONSE ===
            var orderResponse = new CreateOrderResponse
            {
                Id = order.Id,
                Customerid = order.Customerid,
                Userid = order.Userid,
                Status = order.Status,
                TotalAmount = order.TotalAmount,
                DiscountAmount = order.DiscountAmount,
                PromotionCode = appliedPromotionCode,
                OrderDate = order.OrderDate,
                PaymentId = paymentResult.Data.PaymentId, // ← TRẢ VỀ PAYMENT ID
                Items = orderItems.Select(i => new OrderItemResponse
                {
                    OrderItemId = i.OrderItemId,
                    OrderId = i.OrderId,
                    Productid = i.Productid,
                    Quantity = i.Quantity,
                    Price = i.Price,
                    SubTotal = i.SubTotal
                }).ToList()
            };

            return new ApiResponse<CreateOrderResponse>()
                .SuccessResponse(orderResponse, "Created order and payment successfully", 201);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return new ApiResponse<CreateOrderResponse>()
                .ErrorResponse($"Failed to create order: {ex.Message}", 500);
        }
    }

    private async Task RestoreProductQuantity(int orderId)
    {
        // 1. Lấy danh sách sản phẩm trong đơn hàng đó
        var orderDetails = await _db.OrderItems
            .Where(od => od.OrderId == orderId)
            .ToListAsync();

        // 2. Duyệt qua từng sản phẩm để cộng lại số lượng
        foreach (var item in orderDetails)
        {
            var product = await _db.Inventory.FindAsync(item.Productid);
            if (product != null)
            {
                // Cộng lại số lượng vào kho
                product.Quantity += item.Quantity;
            }
        }
    }
}
