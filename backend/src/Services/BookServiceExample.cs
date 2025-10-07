



public class BookService(AppDbContext context, ILogger<BookService> logger) : IBookService
{
    public async Task<BookResponse> AddBookAsync(CreateBookRequest createBookRequest)
    {
        try
        {
            var book = new Book
            {
                Actor_id = createBookRequest.Actor_id,
                Category_id = createBookRequest.Category_id,
                Name = createBookRequest.Name,

            };

            // Add the book to the database
            context.Book.Add(book);
            Console.WriteLine(createBookRequest.Name);
            await context.SaveChangesAsync();
            logger.LogInformation("Book added successfully.");

            // Return the details of the created book
            return new BookResponse
            {
                Id = book.Id,
                Name = book.Name,
                Actor_id = book.Actor_id,
                Category_id = book.Category_id

            };
        }
        catch (Exception ex)
        {
            logger.LogError($"Error adding book: {ex.Message}");
            throw;
        }
    }


    public Task<bool> DeleteBookAsync(Guid id)
    {
        throw new NotImplementedException();
    }


    public Task<IEnumerable<BookResponse>> GetBooksAsync()
    {
        throw new NotImplementedException();
    }
    public async Task<BookResponse> GetBookByIdAsync(Guid id)
    {
        try
        {
            // Find the book by its ID
            var book = await context.Book.FindAsync(id);
            if (book == null)
            {
                logger.LogWarning($"Book with ID {id} not found.");
                return null;
            }

            // Return the details of the book
            return new BookResponse
            {
                Id = book.Id,
                Actor_id = book.Actor_id,
                Name = book.Name,

            };
        }
        catch (Exception ex)
        {
            logger.LogError($"Error retrieving book: {ex.Message}");
            throw;
        }
    }
    public Task<BookResponse> UpdateBookAsync(int id, UpdateBookRequest updateBookRequest)
    {
        throw new NotImplementedException();
    }

    public Task<BookResponse> UpdateBookAsync(Guid id, UpdateBookRequest updateBookRequest)
    {
        throw new NotImplementedException();
    }
}
