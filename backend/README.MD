Could not execute because the specified command or file was not found.
Possible reasons for this include:
  * You misspelled a built-in dotnet command.
  * You intended to execute a .NET program, but dotnet-ef does not exist.
  * You intended to run a global tool, but a dotnet-prefixed executable with this name could not be found on the PATH.
bi loi nay thi tai dotnet tool
install ef-tool cli global: 
dotnet tool install --global dotnet-ef --version 9.0.9

or install ef-tool local
dotnet new tool-manifest
dotnet tool install dotnet-ef --version 9.0.9

<!-- EXPLAIN PROJECT STRUCTURE -->
AppContext: Contains the database context and related configurations.

Configurations: Holds Entity Framework Core configurations and seed data for the database.

Contracts: Contains Data Transfer Objects (DTOs) used in our application.

Endpoints: Where we define and configure our minimal API endpoints.

Exceptions: Contains custom exception classes used in the project.

Extensions: Holds extension methods that we will use throughout the project.

Models: Contains business logic models.

Services: Contains service classes that implement business logic.

Interfaces: Holds interface definitions used to map our services.

<!-- LIBRARY -->
dotnet new tool-manifest
dotnet tool install dotnet-ef --version 9.0.9
dotnet add package FluentValidation
dotnet add package FluentValidation.DependencyInjectionExtensions
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer --version 9.0.9
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Pomelo.EntityFrameworkCore.MySql
dotnet add package DotNetEnv
<!-- authenticate -->
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer --version 9.0.9
dotnet add package System.IdentityModel.Tokens.Jwt

<!-- ADD MIGRATIONS AND UPDATE DB -->
run dotnet ef migrations add init_filename to migrations
run dotnet ef database update to create or update databas