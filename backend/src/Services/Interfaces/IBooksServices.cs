
public interface IBookService
{
    Task<BookResponse> AddBookAsync(CreateBookRequest createBookRequest);
    Task<BookResponse> UpdateBookAsync(Guid id, UpdateBookRequest updateBookRequest);
}
