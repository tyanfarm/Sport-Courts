using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace BE.Models;

public class Category {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? CatId {get; set;}

    [BsonElement("CatName")]
    public string Name {get; set;} = null!;

    public string? Description {get; set;}

    public int Published {get; set;}

    public string? Image {get; set;}
}