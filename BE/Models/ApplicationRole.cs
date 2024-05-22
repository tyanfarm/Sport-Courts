using AspNetCore.Identity.MongoDbCore.Models;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDbGenericRepository.Attributes;

namespace BE.Models;

[CollectionName("Roles")]
public class ApplicationRole : MongoIdentityRole<ObjectId> {

}