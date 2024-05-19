using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace BE.Models;

public class Category {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? CatId {get; set;}

    public string SportName {get; set;} = null!;

    public string Type {get; set;} = null!;

    public string? Description {get; set;}

    public bool Published {get; set;}

    public string? Image {get; set;}
}