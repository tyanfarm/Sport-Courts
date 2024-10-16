using AspNetCore.Identity.MongoDbCore.Models;
using MongoDB.Bson;
using MongoDbGenericRepository.Attributes;

namespace BE.Models;

[CollectionName("Users")]
public class ApplicationUser : MongoIdentityUser<ObjectId> {
    public string? FullName {get; set;}
    public string? Address {get; set;}
}