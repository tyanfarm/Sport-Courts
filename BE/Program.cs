using System.Text;
using BE.Models;
using BE.Private;
using BE.Repositories;
using BE.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MongoDB.Bson;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// Enable CORS
// cho phép truy cập từ mọi nguồn gốc
builder.Services.AddCors(c => {
    c.AddPolicy("AllowOrigin", options => options.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

// Info of gmail sender
builder.Services.AddSingleton<EmailInfo>();

// EmailSender Services
builder.Services.AddScoped<IEmailSender, EmailSender>();

// Add services to the container.
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ICourtRepository, CourtRepository>();
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IOrderdetailsRepository, OrderdetailsRepository>();
builder.Services.AddScoped<IAdminRepository, AdminRepository>();
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

// Identity Services
builder.Services.AddIdentity<ApplicationUser, ApplicationRole>()
                .AddMongoDbStores<ApplicationUser, ApplicationRole, ObjectId>(
                    builder.Configuration.GetConnectionString("DefaultConnection"),      // Connection String
                    builder.Configuration.GetSection("MongoDb:DatabaseName").Value)      // Database Name
                .AddTokenProvider<DataProtectorTokenProvider<ApplicationUser>>(TokenOptions.DefaultProvider);

// Key for checking JWT
var key = Encoding.ASCII.GetBytes(builder.Configuration.GetSection("JwtConfig:Secret").Value);
var tokenValidationParameter = new TokenValidationParameters() 
{
    ValidateIssuerSigningKey = true,
    IssuerSigningKey = new SymmetricSecurityKey(key),
    ValidateIssuer = false,     // for dev
    ValidateAudience = false,   // for dev

    ClockSkew = TimeSpan.Zero,
        
    // Kiểm tra token có ngày hết hạn không
    RequireExpirationTime = true,      // for dev - need to update when refresh token is added

    // Kiểm tra token còn sống không
    ValidateLifetime = true
};

builder.Services.AddSingleton(tokenValidationParameter);

// Authentication
builder.Services
.AddAuthentication(options => 
{
    // chỉ định rằng JWT Bearer sẽ được sử dụng cho xác thực mặc định.
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
// Middleware xác thực JWT
.AddJwtBearer(jwt => 
{
    // token sẽ được lưu trong HttpContext sau khi xác thực
    jwt.SaveToken = true;

    jwt.TokenValidationParameters = tokenValidationParameter;
});

// builder.Services.AddAuthorization(options =>
// {
//     options.AddPolicy("AdminOnly", policy => 
//     {
//         policy.AuthenticationSchemes.Add(JwtBearerDefaults.AuthenticationScheme);
//         policy.RequireAuthenticatedUser();
//         policy.RequireRole("Admin");
//     });
// });

builder.Services.AddControllers().AddNewtonsoftJson(options =>
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

// Cấu hình Swagger để hỗ trợ JWT
// Cho phép người dùng nhập token JWT vào Swagger UI và thực hiện các yêu cầu đến các endpoint bảo mật.
builder.Services.AddSwaggerGen(options => {
    options.AddSecurityDefinition(name: JwtBearerDefaults.AuthenticationScheme,
        securityScheme: new OpenApiSecurityScheme {
            // Tên của header HTTP mà token sẽ được gửi trong đó.
            Name = "Authorization",
            Description = "Enter the Bearer Authorization : `Bearer Generated-JWT-Token`",

            // Chỉ định rằng token sẽ được gửi trong phần header của yêu cầu HTTP.
            In = ParameterLocation.Header,

            // Chỉ định loại bảo mật là API key (JWT token hoạt động như một API key).
            Type = SecuritySchemeType.ApiKey,
            Scheme = "Bearer"
        });
    
    options.AddSecurityRequirement(new OpenApiSecurityRequirement 
    {
        {
            new OpenApiSecurityScheme {
                Reference = new OpenApiReference {
                    Type = ReferenceType.SecurityScheme,
                    Id = JwtBearerDefaults.AuthenticationScheme
                }
            }, 
            new string[] {}
        }
    });
});

var app = builder.Build();

// Enable CORS
app.UseCors(options => options.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
