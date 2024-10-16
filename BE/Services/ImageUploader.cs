using BE.Contracts.Services;
using BE.Private;
using Firebase.Auth;
using Firebase.Storage;

namespace BE.Services;

public class ImageUploader : IImageUploader
{
    private readonly FirebaseInfo _firebaseInfo;

    public ImageUploader(FirebaseInfo firebaseInfo)
    {
        _firebaseInfo = firebaseInfo;
    }

    public async Task<string> Upload(IFormFile file, string folder, string filename)
    {
        var auth = new FirebaseAuthProvider(new FirebaseConfig(_firebaseInfo.ApiKey));
        var login = await auth.SignInWithEmailAndPasswordAsync(_firebaseInfo.AuthEmail, _firebaseInfo.AuthPassword);

        var cancellation = new CancellationTokenSource();

        try {
            using (var stream = file.OpenReadStream())
            {
                var task = new FirebaseStorage(
                    _firebaseInfo.Bucket,
                    new FirebaseStorageOptions
                    {
                        AuthTokenAsyncFactory = () => Task.FromResult(login.FirebaseToken),
                        ThrowOnCancel = true    // when cancel the upload, exception is thrown
                    })
                    .Child(folder)
                    .Child(filename)
                    .PutAsync(stream, cancellation.Token);

                // Chờ upload hoàn thành và lấy URL của file
                var downloadUrl = await task;

                return downloadUrl;
            }
        }
        catch {
            return null;
        }
    }
}