using System.Text;
using BE.Contracts.Repositories;
using BE.Contracts.Services;
using BE.Models;
using BE.Private;
using BE.Repositories;
using BE.Services;
using BE.Services.Hubs;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MongoDB.Bson;

var builder = WebApplication.CreateBuilder(args);

// Save message of chat service
builder.Services.AddSingleton<IDictionary<string, UserConnection>>
(opts => new Dictionary<string, UserConnection>());

// AutoMapper
builder.Services.AddAutoMapper(typeof(Program));

// Info of gmail sender
builder.Services.AddSingleton<EmailInfo>();

// Info of firebase
builder.Services.AddSingleton<FirebaseInfo>();
builder.Services.AddScoped<INotificationSender, FcmSender>();

// EmailSender Services
builder.Services.AddScoped<IEmailSender, EmailSender>();

// ImageUploader Services
builder.Services.AddScoped<IImageUploader, ImageUploader>();

// Add services to the container.
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ICourtRepository, CourtRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IOrderdetailsRepository, OrderdetailsRepository>();
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IFirebaseTokenRepository, FirebaseTokenRepository>();
builder.Services.AddScoped<IConversationRepository, ConversationRepository>();
builder.Services.AddScoped<IContentConversationRepository, ContentConversationRepository>();

// Identity Services
builder.Services.AddIdentity<ApplicationUser, ApplicationRole>()
                .AddMongoDbStores<ApplicationUser, ApplicationRole, ObjectId>(
                    builder.Configuration.GetConnectionString("DefaultConnection"),      // Connection String
                    builder.Configuration.GetSection("MongoDb:DatabaseName").Value)      // Database Name
                .AddTokenProvider<DataProtectorTokenProvider<ApplicationUser>>(TokenOptions.DefaultProvider);

// FCM Service
FirebaseApp.Create(new AppOptions()
{
    Credential = GoogleCredential.FromFile(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "sport-courts-ab2d8-firebase-adminsdk-14hr3-3439fc6419.json")),
});

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

// SignalR
builder.Services.AddSignalR(options =>
{
    options.MaximumReceiveMessageSize = 1024 * 1024; // 1MB
});          

// Config CORS
// cho phép truy cập từ mọi nguồn gốc
builder.Services.AddCors(options =>  
{
    options.AddDefaultPolicy(
        builder => {
            builder.WithOrigins("http://localhost:3000", "http://localhost:3001", "http://113.160.253.36")
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
        }
    );
});

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
// app.UseCors(options => options.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
app.UseCors();

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

app.MapHub<ChatHub>("/chathub");            // signalR

app.Run();
