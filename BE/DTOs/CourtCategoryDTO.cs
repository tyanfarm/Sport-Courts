using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BE.DTOs;

public class CourtCategoryDTO {
    [BsonRepresentation(BsonType.ObjectId)]
    public string? CourtId {get; set;}

    [BsonRepresentation(BsonType.ObjectId)]
    public string? CatId {get; set;}

    public string? SportName {get; set;}
}