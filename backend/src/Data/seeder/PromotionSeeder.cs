using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public static class PromotionSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (await context.Promotions.AnyAsync())
            return;

        var random = new Random();
        var promotions = new List<Promotions>();

        for (int i = 1; i <= 100; i++)
        {
            var isPercentage = random.Next(0, 2) == 0;
            var discountType = isPercentage ? 1 : 2;

            var discountValue = isPercentage
                ? random.Next(5, 50)              
                : random.Next(20000, 200000);       

            var minOrder = isPercentage
                ? random.Next(50000, 300000)       
                : random.Next(300000, 1000000);

            var startDate = DateTime.Now.AddDays(-random.Next(0, 30)); 
            var endDate = startDate.AddDays(random.Next(15, 60));     

            promotions.Add(new Promotions
            {
                Code = $"PROMO{i:D3}",
                Description = isPercentage
                    ? $"Giảm {discountValue}% cho đơn hàng từ {minOrder:N0}đ"
                    : $"Giảm {discountValue:N0}đ cho đơn hàng từ {minOrder:N0}đ",
                DiscountType = discountType,
                DiscountValue = discountValue,
                MinOrderAmount = minOrder,
                Usagelimit = random.Next(10, 200),
                StartDate = startDate,
                EndDate = endDate
            });
        }

        await context.Promotions.AddRangeAsync(promotions);
        await context.SaveChangesAsync();
    }
}
