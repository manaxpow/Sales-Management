
public record UpdateBookRequest
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public int CategoryId { get; set; }
    public int ActorId { get; set; }

}
