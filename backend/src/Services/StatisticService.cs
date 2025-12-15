
using System.Globalization;
using Microsoft.EntityFrameworkCore;

public class StatisticService(AppDbContext context, ILogger<ProductService> logger) : IStatisticService
{
    private readonly ApiResponse<StatisticOrderResponse> _responseStaOrder = new();
    private readonly ApiResponse<StatisticRevenuelResponse> _responseStaRevenue = new();
    private readonly ApiResponse<StatisticCustomerResponse> _responseStaCustomer = new();
    private readonly ApiResponse<GetStatisticProduct> _responseStaProduct = new();


    public async Task<ApiResponse<StatisticOrderResponse>> GetStatisticOrder(StatisticRequest request)
    {
        try
        {
            var startdate = DateTimeHelper.ConvertStringToDateTime(request.StartDate);
            var enddate = DateTimeHelper.ConvertStringToDateTime(request.EndDate);
            if ((enddate - startdate).Days < 0)
            {
                return _responseStaOrder.ErrorResponse("Start date must be before end date");
            }

            var query = context.Orders.AsQueryable();
            if (request.Status.HasValue)
            {
                query = query.Where(u => u.Status == request.Status.Value);
            }

            query = query.Where(u => u.OrderDate >= startdate && u.OrderDate <= enddate);

            var dataRaw = await query
                .GroupBy(u => u.OrderDate.Date)
                .Select(group =>
                    new
                    {
                        Count = group.Count(),
                        Time = group.Key,
                    })
                .OrderBy(u => u.Time)
                .ToListAsync();
            var dataRes = dataRaw
                .Select(x => new OrderSTA
                {
                    Count = x.Count,
                    Time = x.Time.ToString("yyyy/MM/dd")
                })
                .ToList();


            return _responseStaOrder.SuccessResponse(new StatisticOrderResponse
            {
                StaOrder = dataRes,
                TotalOrders = query.Count()
            }, "Get statistic order successfully");
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return _responseStaOrder.ErrorResponse(e.Message);
        }
    }

    public async Task<ApiResponse<GetStatisticProduct>> GetStatisticProduct(string type)
    {
        switch (type.ToLower())
        {
            case "category":
            {
                var query = context.Products.AsQueryable();
                query = query.Where(u => u.Status != 3);
                query.Include(u => u.Category);
                var dataRaw = await query.GroupBy(u => u.Category)
                    .Select(group =>
                        new StatisticResposne
                        {
                            TotalItem = group.Count(),
                            ItemName = group.Key != null ? group.Key.CategoryName : "unknown category"
                        })
                    .ToListAsync();
                return _responseStaProduct.SuccessResponse(new GetStatisticProduct
                {
                    Data = dataRaw
                }, "Get statistic product successfully");
            }
            case "supplier":
            {
                var query = context.Products.AsQueryable();
                query = query.Where(u => u.Status != 3);
                query.Include(u => u.Supplier);
                var dataRaw = await query.GroupBy(u => u.Supplier)
                    .Select(group =>
                        new StatisticResposne
                        {
                            TotalItem = group.Count(),
                            ItemName = group.Key != null ? group.Key.Name : "unknown supplier"
                        })
                    .ToListAsync();
                return _responseStaProduct.SuccessResponse(new GetStatisticProduct
                {
                    Data = dataRaw
                }, "Get statistic product successfully");
            }
            default:
                return _responseStaProduct.ErrorResponse("Nothing to show");
        }
    }

    public async Task<ApiResponse<StatisticRevenuelResponse>> GetStatisticRevenue(StatisticRequest request)
    {
        try
        {
            var startdate = DateTimeHelper.ConvertStringToDateTime(request.StartDate);
            var enddate = DateTimeHelper.ConvertStringToDateTime(request.EndDate);
            if ((enddate - startdate).Days < 0)
            {
                return _responseStaRevenue.ErrorResponse("Start date must be before end date");
            }

            var query = context.Orders.AsQueryable();
            query = query.Where(u => u.OrderDate >= startdate && u.OrderDate <= enddate);
            var dataRaw = await query
                .GroupBy(u => u.OrderDate.Date)
                .Select(group =>
                    new
                    {
                        Amount = group.Sum(u => u.TotalAmount),
                        Time = group.Key
                    })
                .OrderBy(u => u.Time)
                .ToListAsync();

            var dataRes = dataRaw.Select(x => new Revenue
            {
                Time = x.Time.ToString("yyyy/MM/dd"),
                Amount = x.Amount
            }).ToList();

            return _responseStaRevenue.SuccessResponse(new StatisticRevenuelResponse
            {
                Revenues = dataRes,
                TotalRevenue = query.Sum(u => u.TotalAmount),
                AverageRevenue = query.Average(u => u.TotalAmount)
            }, "Get statistic revenue successfully");
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return _responseStaRevenue.ErrorResponse(e.Message);
        }
    }

    public async Task<ApiResponse<StatisticCustomerResponse>> GetStatisticCustomer()
    {
        try
        {
            var query = context.Customers.AsQueryable();
            var now = DateTime.Now;
            var startdate = new DateTime(now.Year, 1, 1);
            var enddate = startdate.AddYears(1);

            var customers = await query.Where(u => u.CreatedAt >= startdate && u.CreatedAt <= enddate)
                .Select(u => u.CreatedAt)
                .ToListAsync();
            var byYear = customers
                .GroupBy(d => d.Year)
                .Select(g => new StatisticItem
                {
                    Time = g.Key.ToString(),
                    Count = g.Count()
                })
                .OrderBy(x => x.Time)
                .ToList();

            // get by month
            var byMonth = customers
                .GroupBy(d => new { d.Year, d.Month })
                .OrderBy(g => g.Key.Year)
                .ThenBy(g => g.Key.Month)
                .Select(g => new StatisticItem
                {
                    Time = $"{g.Key.Month:D2}/{g.Key.Year}",
                    Count = g.Count()
                })
                .ToList();
            // week

            var calendar = CultureInfo.CurrentCulture.Calendar;

            var byWeek = customers
                .GroupBy(d =>
                {
                    var week = calendar.GetWeekOfYear(
                        d,
                        CalendarWeekRule.FirstFourDayWeek,
                        DayOfWeek.Monday);

                    return new { d.Year, Week = week };
                })
                .Select(g => new StatisticItem
                {
                    Time = $"W{g.Key.Week}/{g.Key.Year}",
                    Count = g.Count()
                })
                .OrderBy(x => x.Time)
                .ToList();
            return _responseStaCustomer.SuccessResponse(new StatisticCustomerResponse
            {
                ByYear = byYear,
                ByMonth = byMonth,
                ByWeek = byWeek
            });
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return _responseStaCustomer.ErrorResponse(e.Message);
        }
    }
}
