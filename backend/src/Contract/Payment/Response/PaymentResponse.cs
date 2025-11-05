public class PaymentResponse {
    public int PaymentId { get; set; }
    public int OrderId { get; set; }
    public decimal Amount { get; set; }
    public int Paymentmethod { get; set; }
    public DateTime PaymentDate { get; set; }
}
