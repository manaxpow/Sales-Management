using Microsoft.EntityFrameworkCore;

public class PaymentService : IPaymentService {
    private readonly AppDbContext _db;
    public PaymentService(AppDbContext db) {
        _db = db;
    }

    public async Task<ApiResponse<IEnumerable<Payments>>> GetAll(int? orderId) {
        var query = _db.Payments.AsQueryable();

        if (orderId.HasValue)
            query = query.Where(p => p.OrderId == orderId.Value);

        var list = await query.OrderByDescending(p => p.PaymentDate).ToListAsync();

        return new ApiResponse<IEnumerable<Payments>>()
            .SuccessResponse(list, "Fetched payments successfully");
    }

    public async Task<ApiResponse<Payments>> GetById(int id) {
        var payment = await _db.Payments.FindAsync(id);
        if (payment == null)
            return new ApiResponse<Payments>().ErrorResponse("Payment not found", 404);

        return new ApiResponse<Payments>().SuccessResponse(payment);
    }

    public async Task<ApiResponse<Payments>> Create(Payments payment) {
        if (payment.PaymentDate == default)
            payment.PaymentDate = DateTime.Now;

        _db.Payments.Add(payment);
        await _db.SaveChangesAsync();

        return new ApiResponse<Payments>().SuccessResponse(payment, "Created payment successfully", 201);
    }

    public async Task<ApiResponse<Payments>> Update(int id, Payments payment) {
        var existing = await _db.Payments.FindAsync(id);
        if (existing == null)
            return new ApiResponse<Payments>().ErrorResponse("Payment not found", 404);

        existing.OrderId = payment.OrderId;
        existing.Amount = payment.Amount;
        existing.Paymentmethod = payment.Paymentmethod;
        existing.PaymentDate = payment.PaymentDate == default ? existing.PaymentDate : payment.PaymentDate;

        await _db.SaveChangesAsync();

        return new ApiResponse<Payments>().SuccessResponse(existing, "Updated payment successfully");
    }

    public async Task<ApiResponse<string>> Delete(int id) {
        var existing = await _db.Payments.FindAsync(id);
        if (existing == null)
            return new ApiResponse<string>().ErrorResponse("Payment not found", 404);

        _db.Payments.Remove(existing);
        await _db.SaveChangesAsync();

        return new ApiResponse<string>().SuccessResponse("Deleted payment successfully");
    }
}
