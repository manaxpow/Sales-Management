public class PaymentRequest {
    public int OrderId { get; set; }
    public decimal Amount { get; set; }
    public int Paymentmethod { get; set; }
    public DateTime PaymentDate { get; set; }
}
