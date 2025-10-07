using FluentValidation;
using FluentValidation.Results;

public static class BookRoute
{
    public static IEndpointRouteBuilder MapBookEndPoint(this IEndpointRouteBuilder group)
    {
        // Define the endpoints

        // Endpoint to add a new book
        group.MapPost("/books", async (CreateBookRequest createBookRequest, IBookService bookService, IValidator<CreateBookRequest> validator) =>
        {

            // validate
            
            ValidationResult result = await validator.ValidateAsync(createBookRequest);
            if (!result.IsValid)
            {
                Console.WriteLine("e2321");
                return Results.BadRequest(result.Errors.Select(e => new
                {
                    field = e.PropertyName,
                    message = e.ErrorMessage
                }));
            }
            var book = await bookService.AddBookAsync(createBookRequest);

            return Results.Created($"/books/{book.Id}", book);
        });


        // Endpoint to get all books
        // group.MapGet("/books", async (IBookService bookService) =>
        // {
        //     var result = await bookService.GetBooksAsync();
        //     return Results.Ok(result);
        // });

        // // Endpoint to get a book by ID
        // group.MapGet("/books/{id:guid}", async (Guid id, IBookService bookService) =>
        // {
        //     var result = await bookService.GetBookByIdAsync(id);
        //     return result != null ? Results.Ok(result) : Results.NotFound();
        // });


        // Endpoint to update a book by ID
        // group.MapPut("/books/{id:guid}", async (Guid id, UpdateBookRequest updateBookRequest, IBookService bookService) =>
        // {
        //     var result = await bookService.UpdateBookAsync(id, updateBookRequest);
        //     return result != null ? Results.Ok(result) : Results.NotFound();
        // });

        // Endpoint to delete a book by ID
        // group.MapDelete("/books/{id:guid}", async (Guid id, IBookService bookService) =>
        // {
        //     var result = await bookService.DeleteBookAsync(id);
        //     return result ? Results.NoContent() : Results.NotFound();
        // });

        return group;
    }
}

