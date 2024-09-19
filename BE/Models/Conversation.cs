using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BE.Models;

public class Conversation {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? ConversationId {get; set;}

    [BsonRepresentation(BsonType.ObjectId)]
    [BsonElement("UsersID")]
    public IList<string>? CustomersId {get; set;}
}