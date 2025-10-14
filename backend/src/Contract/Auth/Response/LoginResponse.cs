using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.src.Contract.Auth.Response
{
    public record LoginResponse
    {
        public required int Id { get; set; }
        public required string UserName { get; set; }
        public required string FullName { get; set; }
        public required int Role { get; set; }
        public required string AccessToken { get; set; }

     

        // access token

    }
}