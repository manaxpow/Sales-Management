using Microsoft.EntityFrameworkCore;

public class PaymentService : IPaymentService {
    private readonly AppDbContext _db;
    public PaymentService(AppDbContext db) { _db = db; }

    public async Task<ApiResponse<IEnumerable<PaymentResponse>>> GetAll(int? orderId) {
        var q = _db.Payments.AsQueryable();
        if (orderId.HasValue) q = q.Where(p => p.OrderId == orderId.Value);

        var list = await q.OrderByDescending(p => p.PaymentDate)
                          .Select(p => new PaymentResponse {
                              PaymentId = p.PaymentId,
                              OrderId = p.OrderId,
                              Amount = p.Amount,
                              Paymentmethod = p.Paymentmethod,
                              PaymentDate = p.PaymentDate
                          })
                          .ToListAsync();

        return new ApiResponse<IEnumerable<PaymentResponse>>()
            .SuccessResponse(list, "Fetched payments successfully");
    }

    public async Task<ApiResponse<PaymentResponse>> GetById(int id) {
        var p = await _db.Payments.FindAsync(id);
        if (p == null) return new ApiResponse<PaymentResponse>().ErrorResponse("Payment not found", 404);

        var resp = new PaymentResponse {
            PaymentId = p.PaymentId,
            OrderId = p.OrderId,
            Amount = p.Amount,
            Paymentmethod = p.Paymentmethod,
            PaymentDate = p.PaymentDate
        };
        return new ApiResponse<PaymentResponse>().SuccessResponse(resp);
    }

    public async Task<ApiResponse<PaymentResponse>> Create(PaymentRequest request) {
        var entity = new Payments {
            OrderId = request.OrderId,
            Amount = request.Amount,
            Paymentmethod = request.Paymentmethod,
            PaymentDate = request.PaymentDate == default ? DateTime.Now : request.PaymentDate
        };

        _db.Payments.Add(entity);
        await _db.SaveChangesAsync();

        var resp = new PaymentResponse {
            PaymentId = entity.PaymentId,
            OrderId = entity.OrderId,
            Amount = entity.Amount,
            Paymentmethod = entity.Paymentmethod,
            PaymentDate = entity.PaymentDate
        };

        return new ApiResponse<PaymentResponse>().SuccessResponse(resp, "Created payment successfully", 201);
    }

    public async Task<ApiResponse<PaymentResponse>> Update(int id, PaymentRequest request) {
        var entity = await _db.Payments.FindAsync(id);
        if (entity == null) return new ApiResponse<PaymentResponse>().ErrorResponse("Payment not found", 404);

        entity.OrderId = request.OrderId;
        entity.Amount = request.Amount;
        entity.Paymentmethod = request.Paymentmethod;
        entity.PaymentDate = request.PaymentDate == default ? entity.PaymentDate : request.PaymentDate;

        await _db.SaveChangesAsync();

        var resp = new PaymentResponse {
            PaymentId = entity.PaymentId,
            OrderId = entity.OrderId,
            Amount = entity.Amount,
            Paymentmethod = entity.Paymentmethod,
            PaymentDate = entity.PaymentDate
        };

        return new ApiResponse<PaymentResponse>().SuccessResponse(resp, "Updated payment successfully");
    }

    public async Task<ApiResponse<string>> Delete(int id) {
        var entity = await _db.Payments.FindAsync(id);
        if (entity == null) return new ApiResponse<string>().ErrorResponse("Payment not found", 404);

        _db.Payments.Remove(entity);
        await _db.SaveChangesAsync();

        return new ApiResponse<string>().SuccessResponse("Deleted payment successfully");
    }
}
