
public class BookDoesNotExistException : Exception
{
    private int Id { get; set; }

    public BookDoesNotExistException(int id) : base($"Book with id {id} does not exist")
    {
        Id = id;
    }

}
