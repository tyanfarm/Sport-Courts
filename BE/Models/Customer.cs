using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BE.Models;

public class Customer {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? CustomerId {get; set;}

    public string? FullName {get; set;}

    public string? Address {get; set;}

    public string Email {get; set;} = null!;

    public string? Phone {get; set;}

    public DateTime CreateDate {get; set;}

    public string Password {get; set;} = null!;

    public string Salt {get; set;} = null!;

    public bool EmailConfirmed {get; set;}
}